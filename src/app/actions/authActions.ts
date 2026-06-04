'use server';

import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { createSession, deleteSession, encrypt, decrypt } from '@/lib/session';
import { encrypt as encryptData, decrypt as decryptData } from '@/lib/encryption';
import { redirect } from 'next/navigation';
import { generateSecret, generateURI, verifySync } from 'otplib';
import QRCode from 'qrcode';
import { getSecuritySettings, getSettings } from './settingsActions';
import { logActivity } from '@/lib/logger';

export async function loginUser(formData: FormData) {
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

    const securitySettings = await getSecuritySettings();
    const is2FAEnabledGlobally = securitySettings?.enable2FA;

    if (is2FAEnabledGlobally) {
      if (user.twoFactorSecretEncrypted) {
        // User has 2FA set up, require code
        const tempToken = await encrypt({
          userId: user.id,
          email: user.email,
          role: user.role,
          pending2FA: true,
        }, '10m'); // 10 minutes expiry

        return { requires2FA: true, tempToken };
      } else {
        // User needs to set up 2FA
        const secret = generateSecret();
        const generalSettings = await getSettings();
        const appName = generalSettings?.siteName || 'Fire Shield';
        const otpauth = generateURI({ issuer: appName, label: user.email, secret });
        const qrCode = await QRCode.toDataURL(otpauth);
        
        const tempToken = await encrypt({
          userId: user.id,
          email: user.email,
          role: user.role,
          pending2FA: true,
        }, '10m');

        return { setup2FA: true, tempSecret: secret, qrCode, tempToken };
      }
    }

    // No 2FA required
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

export async function setup2FA(tempToken: string, tempSecret: string, code: string) {
  try {
    const payload = await decrypt(tempToken);
    if (!payload || !payload.pending2FA) {
      return { error: 'Invalid or expired setup session.' };
    }

    const result = verifySync({ token: code, secret: tempSecret });

    if (!result.valid) {
      return { error: 'Invalid verification code. Please try again.' };
    }

    const encryptedSecret = encryptData(tempSecret);
    
    // Save to user
    await prisma.user.update({
      where: { id: payload.userId },
      data: { twoFactorSecretEncrypted: encryptedSecret },
    });

    // Create the real session
    await createSession({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    await logActivity({
      action: 'SETUP_2FA',
      entityType: 'Auth',
      entityId: payload.userId,
      entityName: payload.email,
      userId: payload.userId,
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
