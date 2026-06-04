'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { promises as fs } from 'fs';
import path from 'path';

// ─── Helpers ────────────────────────────────────────────────────────────────

function validateRequired(value: FormDataEntryValue | null, fieldName: string): string {
  const str = (value as string | null)?.trim() ?? '';
  if (!str) throw new Error(`${fieldName} is required.`);
  return str;
}

/**
 * If a real image file was uploaded, save it and return its public path.
 * If no file was uploaded, fall back to the hidden `imagePath` field (existing path).
 * Never returns an empty string — returns null if truly nothing is available.
 */
async function processImageUpload(formData: FormData): Promise<string | null> {
  const imageFile = formData.get('imageFile') as File | null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'projects');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return `/images/projects/${filename}`;
  }

  // Fall back to whatever path was already stored (sent as hidden field)
  const existingPath = (formData.get('imagePath') as string | null)?.trim() ?? '';
  return existingPath || null;
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

  const imagePath = (await processImageUpload(formData)) ?? '';

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
  const newImagePath = await processImageUpload(formData);
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
