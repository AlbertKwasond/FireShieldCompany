'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { promises as fs } from 'fs';
import path from 'path';

const SINGLETON_ID = 'singleton';

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * If a real image file was uploaded, save it and return its public path.
 * If no file was uploaded, fall back to the hidden `imagePath` field (existing path).
 * Never returns an empty string — returns null if truly nothing is available.
 */
async function processImageUpload(formData: FormData, fileKey: string, pathKey: string): Promise<string | null> {
  const imageFile = formData.get(fileKey) as File | null;

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '-')}`;
    const uploadDir = path.join(process.cwd(), 'public', 'images', 'about');

    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    await fs.writeFile(path.join(uploadDir, filename), buffer);
    return `/images/about/${filename}`;
  }

  // Fall back to whatever path was already stored (sent as hidden field)
  const existingPath = (formData.get(pathKey) as string | null)?.trim() ?? '';
  return existingPath || null;
}

// ─── Read ────────────────────────────────────────────────────────────────────

export async function getAboutContent() {
  try {
    const content = await prisma.aboutContent.findUnique({
      where: { id: SINGLETON_ID },
    });
    
    // Return default empty values if not found, making it easier for the frontend
    if (!content) {
      return {
        id: SINGLETON_ID,
        heroTitle: 'Our Story',
        heroDescription: 'For over two decades, Fire Shield Company Limited has been at the forefront of engineering excellence, protecting assets and securing futures across Ghana and beyond.',
        storyTitle: 'A Legacy of Trust',
        storyDescription1: 'Established in 2003, Fire Shield Company Limited began with a single mission: to elevate the standards of fire safety and engineering in Ghana. As a 100% Ghanaian-owned company, we understand the local landscape while adhering strictly to international standards.',
        storyDescription2: 'Over the years, our expertise has expanded from fire engineering to encompass electronic security, electrical systems, and mission-critical data center infrastructure. Today, we are proud to be the trusted partner for major corporate institutions, government facilities, and industrial complexes.',
        storyImagePath: '',
        mission: 'To provide innovative, reliable, and comprehensive engineering solutions in fire safety, security, and electrical infrastructure, ensuring the total protection and continuous operation of our clients\' critical assets.',
        vision: 'To be the foremost indigenous engineering firm in West Africa, recognized globally for technical excellence, uncompromised safety standards, and sustainable technological integration.',
        timeline: JSON.stringify([
          { year: '2003', title: 'Company Founded', desc: 'Started as a specialized fire engineering firm dedicated to safety.' },
          { year: '2010', title: 'Expansion of Services', desc: 'Integrated electronic security and access control into our portfolio.' },
          { year: '2018', title: 'Mission Critical Infrastructure', desc: 'Launched full-scale data center setup and electrical system services.' },
          { year: 'Present', title: 'Industry Leaders', desc: 'Recognized as a premier engineering partner with 500+ completed projects.' }
        ]),
        coreValues: JSON.stringify([
          { icon: 'ShieldCheck', title: 'Safety First', desc: 'We never compromise on the safety of lives, property, or our workforce. It is the foundation of everything we build.' },
          { icon: 'Target', title: 'Excellence', desc: 'We deliver superior quality in design, installation, and maintenance, consistently exceeding expectations.' },
          { icon: 'CheckCircle', title: 'Integrity', desc: 'We conduct our business with the highest level of professional ethics, transparency, and honesty.' },
          { icon: 'Lightbulb', title: 'Innovation', desc: 'We embrace modern technologies and smart integrations to solve complex engineering challenges.' }
        ]),
        leadership: JSON.stringify([
          { name: 'Managing Director', role: 'Executive Leadership' },
          { name: 'Technical Director', role: 'Engineering & Operations' },
          { name: 'Projects Manager', role: 'Project Execution' }
        ]),
      };
    }
    return content;
  } catch (error) {
    console.error('[getAboutContent]', error);
    return null;
  }
}

// ─── Update ──────────────────────────────────────────────────────────────────

export async function updateAboutContent(formData: FormData) {
  try {
    const heroTitle = (formData.get('heroTitle') as string) || '';
    const heroDescription = (formData.get('heroDescription') as string) || '';
    const storyTitle = (formData.get('storyTitle') as string) || '';
    const storyDescription1 = (formData.get('storyDescription1') as string) || '';
    const storyDescription2 = (formData.get('storyDescription2') as string) || '';
    const mission = (formData.get('mission') as string) || '';
    const vision = (formData.get('vision') as string) || '';
    
    // Timeline, core values, and leadership are passed as JSON strings from the client
    const timeline = (formData.get('timeline') as string) || '[]';
    const coreValues = (formData.get('coreValues') as string) || '[]';
    // Parse leadership to handle images
    const leadershipRaw = (formData.get('leadership') as string) || '[]';
    let leadershipParsed: any[] = [];
    try {
      leadershipParsed = JSON.parse(leadershipRaw);
    } catch {}

    for (let i = 0; i < leadershipParsed.length; i++) {
      const leaderImagePath = await processImageUpload(formData, `leadershipImageFile_${i}`, `leadershipImagePath_${i}`);
      // Always update imagePath — null means the user cleared it (remove image), so store ''
      leadershipParsed[i].imagePath = leaderImagePath ?? '';
    }
    const leadership = JSON.stringify(leadershipParsed);

    let storyImagePath = await processImageUpload(formData, 'storyImageFile', 'storyImagePath');
    if (!storyImagePath) {
      storyImagePath = '';
    }

    await prisma.aboutContent.upsert({
      where: { id: SINGLETON_ID },
      update: {
        heroTitle,
        heroDescription,
        storyTitle,
        storyDescription1,
        storyDescription2,
        storyImagePath,
        mission,
        vision,
        timeline,
        coreValues,
        leadership
      },
      create: {
        id: SINGLETON_ID,
        heroTitle,
        heroDescription,
        storyTitle,
        storyDescription1,
        storyDescription2,
        storyImagePath,
        mission,
        vision,
        timeline,
        coreValues,
        leadership
      }
    });

    revalidatePath('/about');
    revalidatePath('/admin/about');
    
    return { success: true };
  } catch (error) {
    console.error('[updateAboutContent]', error);
    return { success: false, error: 'Failed to update about content' };
  }
}
