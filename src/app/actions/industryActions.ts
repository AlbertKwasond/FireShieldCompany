'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { verifySession } from '@/lib/session';
import { processImageUpload } from '@/lib/upload';

// ─── Helpers ────────────────────────────────────────────────────────────────

function validateRequired(value: FormDataEntryValue | null, fieldName: string): string {
  const str = (value as string | null)?.trim() ?? '';
  if (!str) throw new Error(`${fieldName} is required.`);
  return str;
}



// ─── Read ────────────────────────────────────────────────────────────────────

export async function getIndustries() {
  try {
    return await prisma.industry.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('[getIndustries]', error);
    return [];
  }
}

export async function getIndustry(id: string) {
  if (!id) return null;
  try {
    return await prisma.industry.findUnique({ where: { id } });
  } catch (error) {
    console.error('[getIndustry]', error);
    return null;
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createIndustry(formData: FormData) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  // ── Validate & sanitise ──
  let title: string, description: string, icon: string;
  try {
    title       = validateRequired(formData.get('title'),       'Title');
    description = validateRequired(formData.get('description'), 'Description');
    icon        = validateRequired(formData.get('icon'),        'Icon');
  } catch (err) {
    throw new Error((err as Error).message);
  }

  const orderRaw = (formData.get('order') as string | null) ?? '0';
  const order = Math.max(0, parseInt(orderRaw, 10) || 0);

  const imagePath = (await processImageUpload(formData, 'industries')) ?? '';

  // ── Persist ──
  await prisma.industry.create({
    data: { title, description, icon, imagePath, order },
  });

  revalidatePath('/industries');
  revalidatePath('/admin/industries');
  redirect('/admin/industries');
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateIndustry(id: string, formData: FormData) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  if (!id) throw new Error('Industry ID is required.');

  // ── Validate & sanitise ──
  let title: string, description: string, icon: string;
  try {
    title       = validateRequired(formData.get('title'),       'Title');
    description = validateRequired(formData.get('description'), 'Description');
    icon        = validateRequired(formData.get('icon'),        'Icon');
  } catch (err) {
    throw new Error((err as Error).message);
  }

  const orderRaw = (formData.get('order') as string | null) ?? '0';
  const order = Math.max(0, parseInt(orderRaw, 10) || 0);

  // Preserve existing image unless a new one was uploaded
  const newImagePath = await processImageUpload(formData, 'industries');
  // If even the fallback was empty, keep whatever is currently in DB
  let imagePath = newImagePath;
  if (!imagePath) {
    const existing = await prisma.industry.findUnique({ where: { id }, select: { imagePath: true } });
    imagePath = existing?.imagePath ?? '';
  }

  // ── Persist ──
  await prisma.industry.update({
    where: { id },
    data: { title, description, icon, imagePath, order },
  });

  revalidatePath('/industries');
  revalidatePath('/admin/industries');
  redirect('/admin/industries');
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteIndustry(id: string) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  if (!id) return { success: false, error: 'Invalid industry ID.' };
  try {
    await prisma.industry.delete({ where: { id } });
    revalidatePath('/industries');
    revalidatePath('/admin/industries');
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[deleteIndustry]', msg);
    // Prisma P2025 = record not found
    if (msg.includes('P2025')) {
      return { success: false, error: 'Industry not found — it may have already been deleted.' };
    }
    return { success: false, error: 'Failed to delete the industry. Please try again.' };
  }
}
