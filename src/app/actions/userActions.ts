'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import bcrypt from 'bcryptjs';
import { verifySession } from '@/lib/session';
import { processImageUpload } from '@/lib/upload';

// ─── Helpers ────────────────────────────────────────────────────────────────

function validateRequired(value: FormDataEntryValue | null, fieldName: string): string {
  const str = (value as string | null)?.trim() ?? '';
  if (!str) throw new Error(`${fieldName} is required.`);
  return str;
}


// ─── Read ────────────────────────────────────────────────────────────────────

export async function getUsers() {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  try {
    return await prisma.user.findMany({ 
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  } catch (error) {
    console.error('[getUsers]', error);
    return [];
  }
}

export async function getUser(id: string) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  if (!id) return null;
  try {
    return await prisma.user.findUnique({ 
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  } catch (error) {
    console.error('[getUser]', error);
    return null;
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createUser(formData: FormData) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  // FIX #8: Only Admins may create users.
  if (session.role !== 'Admin') throw new Error('Forbidden: insufficient privileges.');

  // ── Validate & sanitise ──
  let name: string, email: string, passwordRaw: string, role: string, status: string;
  try {
    name       = validateRequired(formData.get('name'),       'Name');
    email      = validateRequired(formData.get('email'),      'Email');
    passwordRaw= validateRequired(formData.get('password'),   'Password');
    role       = validateRequired(formData.get('role'),       'Role');
    status     = validateRequired(formData.get('status'),     'Status');
  } catch (err) {
    throw new Error((err as Error).message);
  }

  // FIX #2: Use the secure shared upload helper (validates MIME, magic bytes, size).
  const avatar = (await processImageUpload(formData, 'users', 'avatarFile', 'avatarPath')) ?? '';

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(passwordRaw, salt);

  // ── Persist ──
  try {
    await prisma.user.create({
      data: { name, email, password, role, status, avatar },
    });
  } catch (error) {
    console.error('[createUser] Error saving to database:', error);
    throw new Error('Failed to create user in the database.');
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateUser(id: string, formData: FormData) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  // FIX #8: Only Admins may update users.
  if (session.role !== 'Admin') throw new Error('Forbidden: insufficient privileges.');

  if (!id) throw new Error('User ID is required.');

  // ── Validate & sanitise ──
  let name: string, email: string, role: string, status: string;
  try {
    name       = validateRequired(formData.get('name'),       'Name');
    email      = validateRequired(formData.get('email'),      'Email');
    role       = validateRequired(formData.get('role'),       'Role');
    status     = validateRequired(formData.get('status'),     'Status');
  } catch (err) {
    throw new Error((err as Error).message);
  }

  const passwordRaw = (formData.get('password') as string | null)?.trim();
  const updateData: Record<string, unknown> = { name, email, role, status };

  if (passwordRaw) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(passwordRaw, salt);
  }

  // Preserve existing avatar unless a new one was uploaded
  // FIX #2: Use the secure shared upload helper.
  const newAvatarPath = await processImageUpload(formData, 'users', 'avatarFile', 'avatarPath');
  // If even the fallback was empty, keep whatever is currently in DB
  let avatar = newAvatarPath;
  if (!avatar) {
    const existing = await prisma.user.findUnique({ where: { id }, select: { avatar: true } });
    avatar = existing?.avatar ?? '';
  }
  updateData.avatar = avatar;

  // ── Persist ──
  try {
    await prisma.user.update({
      where: { id },
      data: updateData,
    });
  } catch (error) {
    console.error('[updateUser] Error updating database:', error);
    throw new Error('Failed to update user in the database.');
  }

  revalidatePath('/admin/users');
  redirect('/admin/users');
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteUser(id: string) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  // FIX #8: Only Admins may delete users.
  if (session.role !== 'Admin') throw new Error('Forbidden: insufficient privileges.');
  // FIX #8: Prevent self-deletion.
  if (id === session.userId) {
    return { success: false, error: 'You cannot delete your own account.' };
  }

  if (!id) return { success: false, error: 'Invalid user ID.' };
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[deleteUser]', msg);
    if (msg.includes('P2025')) {
      return { success: false, error: 'User not found — it may have already been deleted.' };
    }
    return { success: false, error: 'Failed to delete the user. Please try again.' };
  }
}
