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

export async function getProjects() {
  try {
    return await prisma.project.findMany({ orderBy: { order: 'asc' } });
  } catch (error) {
    console.error('[getProjects]', error);
    return [];
  }
}

export async function getProject(id: string) {
  if (!id) return null;
  try {
    return await prisma.project.findUnique({ where: { id } });
  } catch (error) {
    console.error('[getProject]', error);
    return null;
  }
}

// ─── Create ──────────────────────────────────────────────────────────────────

export async function createProject(formData: FormData) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  // ── Validate & sanitise ──
  let title: string, category: string, description: string, location: string, date: string;
  try {
    title       = validateRequired(formData.get('title'),       'Title');
    category    = validateRequired(formData.get('category'),    'Category');
    description = validateRequired(formData.get('description'), 'Description');
    location    = validateRequired(formData.get('location'),    'Location');
    date        = validateRequired(formData.get('date'),        'Date');
  } catch (err) {
    throw new Error((err as Error).message);
  }

  const orderRaw = (formData.get('order') as string | null) ?? '0';
  const order = Math.max(0, parseInt(orderRaw, 10) || 0);

  const imagePath = (await processImageUpload(formData, 'projects')) ?? '';

  // ── Persist ──
  await prisma.project.create({
    data: { title, category, description, location, date, imagePath, order },
  });

  revalidatePath('/projects');
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateProject(id: string, formData: FormData) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  if (!id) throw new Error('Project ID is required.');

  // ── Validate & sanitise ──
  let title: string, category: string, description: string, location: string, date: string;
  try {
    title       = validateRequired(formData.get('title'),       'Title');
    category    = validateRequired(formData.get('category'),    'Category');
    description = validateRequired(formData.get('description'), 'Description');
    location    = validateRequired(formData.get('location'),    'Location');
    date        = validateRequired(formData.get('date'),        'Date');
  } catch (err) {
    throw new Error((err as Error).message);
  }

  const orderRaw = (formData.get('order') as string | null) ?? '0';
  const order = Math.max(0, parseInt(orderRaw, 10) || 0);

  // Preserve existing image unless a new one was uploaded
  const newImagePath = await processImageUpload(formData, 'projects');
  // If even the fallback was empty, keep whatever is currently in DB
  let imagePath = newImagePath;
  if (!imagePath) {
    const existing = await prisma.project.findUnique({ where: { id }, select: { imagePath: true } });
    imagePath = existing?.imagePath ?? '';
  }

  // ── Persist ──
  await prisma.project.update({
    where: { id },
    data: { title, category, description, location, date, imagePath, order },
  });

  revalidatePath('/projects');
  revalidatePath('/admin/projects');
  redirect('/admin/projects');
}

// ─── Delete ──────────────────────────────────────────────────────────────────

export async function deleteProject(id: string) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');

  if (!id) return { success: false, error: 'Invalid project ID.' };
  try {
    await prisma.project.delete({ where: { id } });
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    return { success: true };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[deleteProject]', msg);
    // Prisma P2025 = record not found
    if (msg.includes('P2025')) {
      return { success: false, error: 'Project not found — it may have already been deleted.' };
    }
    return { success: false, error: 'Failed to delete the project. Please try again.' };
  }
}
