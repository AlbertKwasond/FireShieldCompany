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

export async function getServices() {
  try {
    return await prisma.service.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('[getServices]', error);
    return [];
  }
}

export async function getService(id: string) {
  if (!id) return null;
  try {
    return await prisma.service.findUnique({ where: { id } });
  } catch (error) {
    console.error('[getService]', error);
    return null;
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createService(formData: FormData) {
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

  const featuresRaw = (formData.get('features') as string | null) ?? '';
  const features = JSON.stringify(
    featuresRaw.split('\n').map((f) => f.trim()).filter(Boolean)
  );

  const orderRaw = (formData.get('order') as string | null) ?? '0';
  const order = Math.max(0, parseInt(orderRaw, 10) || 0);

  const imagePath = (await processImageUpload(formData, 'services')) ?? '';

  // ── Persist ──
  await prisma.service.create({
    data: { title, description, icon, imagePath, features, order },
  });

  revalidatePath('/services');
  revalidatePath('/admin/services');
  redirect('/admin/services');
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateService(id: string, formData: FormData) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  if (!id) throw new Error('Service ID is required.');

  // ── Validate & sanitise ──
  let title: string, description: string, icon: string;
  try {
    title       = validateRequired(formData.get('title'),       'Title');
    description = validateRequired(formData.get('description'), 'Description');
    icon        = validateRequired(formData.get('icon'),        'Icon');
  } catch (err) {
    throw new Error((err as Error).message);
  }

  const featuresRaw = (formData.get('features') as string | null) ?? '';
  const features = JSON.stringify(
    featuresRaw.split('\n').map((f) => f.trim()).filter(Boolean)
  );

  const orderRaw = (formData.get('order') as string | null) ?? '0';
  const order = Math.max(0, parseInt(orderRaw, 10) || 0);

  // Preserve existing image unless a new one was uploaded
  const newImagePath = await processImageUpload(formData, 'services');
  // If even the fallback was empty, keep whatever is currently in DB
  let imagePath = newImagePath;
  if (!imagePath) {
    const existing = await prisma.service.findUnique({ where: { id }, select: { imagePath: true } });
    imagePath = existing?.imagePath ?? '';
  }

  // ── Persist ──
  await prisma.service.update({
    where: { id },
    data: { title, description, icon, imagePath, features, order },
  });

  revalidatePath('/services');
  revalidatePath('/admin/services');
  redirect('/admin/services');
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteService(id: string) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  if (!id) return { success: false, error: 'Invalid service ID.' };
  try {
    await prisma.service.delete({ where: { id } });
    revalidatePath('/services');
    revalidatePath('/admin/services');
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[deleteService]', msg);
    // Prisma P2025 = record not found
    if (msg.includes('P2025')) {
      return { success: false, error: 'Service not found — it may have already been deleted.' };
    }
    return { success: false, error: 'Failed to delete the service. Please try again.' };
  }
}
