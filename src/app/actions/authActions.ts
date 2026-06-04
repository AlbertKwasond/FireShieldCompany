'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession, encrypt, decrypt } from '@/lib/session';
import { encrypt as encryptData, decrypt as decryptData } from '@/lib/encryption';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';
import { getPublicSettings } from './settingsActions';
import { logActivity } from '@/lib/logger';
import { checkLoginRateLimit } from '@/lib/ratelimit';

// ─── Internal helpers (no session required) ───────────────────────────────────

/**
 * SECURITY: This is an internal-only helper for reading security settings
 * during the login flow — before a session exists. It intentionally has no
 * session guard. Do NOT export this function.
 */
async function getSecuritySettingsInternal() {
  try {
    return await prisma.securitySettings.findUnique({ where: { id: 'singleton' } });
  } catch {
    return null;
  }
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export async function loginUser(formData: FormData) {
  // FIX #1: Rate limit login attempts — max 5 per IP per 15 minutes.
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0].trim() ??
              headersList.get('x-real-ip') ??
              'unknown';
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    const retryAfterMins = Math.ceil((rateLimit.resetAt - Date.now()) / 60000);
    return {
      error: `Too many login attempts. Please try again in ${retryAfterMins} minute${retryAfterMins !== 1 ? 's' : ''}.`,
    };
  }

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email and password are required.' };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.status !== 'Active') {
      return { error: 'Invalid credentials or inactive account.' };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return { error: 'Invalid credentials.' };
    }

    // FIX #4: Use the internal variant that does not require a valid session.
    const securitySettings = await getSecuritySettingsInternal();
    const is2FAEnabledGlobally = securitySettings?.enable2FA;

    if (is2FAEnabledGlobally) {
      if (user.twoFactorSecretEncrypted) {
        // User has 2FA set up — issue a short-lived pending token, require code next.
        const tempToken = await encrypt({
          userId: user.id,
          email: user.email,
          role: user.role,
          pending2FA: true,
          // FIX #6: tempSecret is NEVER stored in the JWT — it lives only in the DB.
        }, '10m');

        return { requires2FA: true, tempToken };
      } else {
        // User needs to set up 2FA.
        const secret = generateSecret();
        const generalSettings = await getPublicSettings();
        const appName = generalSettings?.siteName || 'Fire Shield';
        const otpauth = generateURI({ issuer: appName, label: user.email, secret });
        const qrCode = await QRCode.toDataURL(otpauth);

        // FIX #6: Store the pending secret in the DB with a 10-minute expiry.
        // It is NEVER placed inside the JWT where a client could decode it.
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twoFactorPendingSecret: secret,
            twoFactorPendingExpiry: new Date(Date.now() + 10 * 60 * 1000),
          },
        });

        const tempToken = await encrypt({
          userId: user.id,
          email: user.email,
          role: user.role,
          pending2FA: true,
        }, '10m');

        return { setup2FA: true, qrCode, tempToken };
      }
    }

    // No 2FA required — create session immediately.
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await logActivity({
      action: 'LOGIN',
      entityType: 'Auth',
      entityId: user.id,
      entityName: user.email,
      userId: user.id,
      metadata: { method: 'password' }
    });

    return { success: true };
  } catch (error) {
    console.error('[loginUser]', error);
    return { error: 'An unexpected error occurred during login.' };
  }
}

export async function verify2FALogin(tempToken: string, code: string) {
  try {
    const payload = await decrypt(tempToken);
    if (!payload || !payload.pending2FA) {
      return { error: 'Invalid or expired session.' };
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
    });

    if (!user || !user.twoFactorSecretEncrypted) {
      return { error: '2FA not properly configured.' };
    }

    const secret = decryptData(user.twoFactorSecretEncrypted);
    if (!secret) {
      return { error: 'Internal error decrypting 2FA secret.' };
    }

    const result = verifySync({ token: code, secret });

    if (!result.valid) {
      return { error: 'Invalid verification code.' };
    }

    // Create the real session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await logActivity({
      action: 'LOGIN',
      entityType: 'Auth',
      entityId: user.id,
      entityName: user.email,
      userId: user.id,
      metadata: { method: '2fa_verify' }
    });

    return { success: true };
  } catch (error) {
    console.error('[verify2FALogin]', error);
    return { error: 'An unexpected error occurred during verification.' };
  }
}

export async function setup2FA(tempToken: string, code: string) {
  try {
    const payload = await decrypt(tempToken);
    if (!payload || !payload.pending2FA) {
      return { error: 'Invalid or expired setup session.' };
    }

    // FIX #6: Retrieve the pending secret from the DB (not from the JWT).
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        role: true,
        twoFactorPendingSecret: true,
        twoFactorPendingExpiry: true,
      },
    });

    if (!user) {
      return { error: 'User not found.' };
    }

    if (!user.twoFactorPendingSecret || !user.twoFactorPendingExpiry) {
      return { error: 'No pending 2FA setup found. Please log in again.' };
    }

    if (user.twoFactorPendingExpiry < new Date()) {
      // Clean up the expired secret
      await prisma.user.update({
        where: { id: user.id },
        data: { twoFactorPendingSecret: null, twoFactorPendingExpiry: null },
      });
      return { error: '2FA setup session has expired. Please log in again.' };
    }

    const result = verifySync({ token: code, secret: user.twoFactorPendingSecret });

    if (!result.valid) {
      return { error: 'Invalid verification code. Please try again.' };
    }

    const encryptedSecret = encryptData(user.twoFactorPendingSecret);

    // Save the confirmed secret and clear the temporary pending fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecretEncrypted: encryptedSecret,
        twoFactorPendingSecret: null,
        twoFactorPendingExpiry: null,
      },
    });

    // Create the real session
    await createSession({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await logActivity({
      action: 'SETUP_2FA',
      entityType: 'Auth',
      entityId: user.id,
      entityName: user.email,
      userId: user.id,
    });

    return { success: true };
  } catch (error) {
    console.error('[setup2FA]', error);
    return { error: 'An unexpected error occurred during 2FA setup.' };
  }
}

export async function logoutUser() {
  await deleteSession();
  redirect('/admin/login');
}
