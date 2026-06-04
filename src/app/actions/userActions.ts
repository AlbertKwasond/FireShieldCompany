'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

// ─── Helpers ────────────────────────────────────────────────────────────────

function validateRequired(value: FormDataEntryValue | null, fieldName: string): string {
  const str = (value as string | null)?.trim() ?? '';
  if (!str) throw new Error(`${fieldName} is required.`);
  return str;
}

/**
 * If a real image file was uploaded, save it and return its public path.
 * If no file was uploaded, fall back to the hidden `avatarPath` field (existing path).
 * Never returns an empty string — returns null if truly nothing is available.
 */
async function processAvatarUpload(formData: FormData): Promise<string | null> {
  const avatarFile = formData.get('avatarFile') as File | null;

  if (avatarFile && avatarFile.size > 0) {
    const bytes = await avatarFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${avatarFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'users');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return `/images/users/${filename}`;
  }

  // Fall back to whatever path was already stored (sent as hidden field)
  const existingPath = (formData.get('avatarPath') as string | null)?.trim() ?? '';
  return existingPath || null;
}

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getUsers() {
  try {
    return await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('[getUsers]', error);
    return [];
  }
}

export async function getUser(id: string) {
  if (!id) return null;
  try {
    return await prisma.user.findUnique({ where: { id } });
  } catch (error) {
    console.error('[getUser]', error);
    return null;
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createUser(formData: FormData) {
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

  const avatar = (await processAvatarUpload(formData)) ?? '';

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
  let updateData: any = { name, email, role, status };

  if (passwordRaw) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(passwordRaw, salt);
  }

  // Preserve existing avatar unless a new one was uploaded
  const newAvatarPath = await processAvatarUpload(formData);
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
