'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { verifySession } from '@/lib/session';

/**
 * Public read — no auth required.
 * Returns only the fields needed by public-facing pages and the login flow.
 * FIX #5: Keeps sensitive admin config fields private.
 */
export async function getPublicSettings() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'singleton' },
      select: { siteName: true, maintenanceMode: true, contactEmail: true, phoneNumber: true, address: true },
    });
    return settings ?? { siteName: 'Fire Shield Company Limited', maintenanceMode: false, contactEmail: null, phoneNumber: null, address: null };
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return { siteName: 'Fire Shield Company Limited', maintenanceMode: false, contactEmail: null, phoneNumber: null, address: null };
  }
}

/**
 * Admin read — session required.
 * Returns the full settings object for the admin dashboard.
 */
export async function getSettings() {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  try {
    let settings = await prisma.settings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          id: 'singleton',
          siteName: 'Fire Shield Company Limited',
          contactEmail: 'info@fireshieldghana.com',
          phoneNumber: '0544015490, 0501676271',
          address: '54 Faanofa Road, Kokomlemle - Accra, Ghana',
          timezone: 'GMT',
          maintenanceMode: false,
        },
      });
    }

    return settings;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export async function updateSettings(data: Partial<Prisma.SettingsUpdateInput>) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  try {
    const settings = await prisma.settings.update({
      where: { id: 'singleton' },
      data,
    });

    // Revalidate paths so the frontend updates immediately
    revalidatePath('/', 'layout');
    
    return { success: true, settings };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { success: false, error: 'Failed to update settings' };
  }
}

export async function getSecuritySettings() {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  try {
    let settings = await prisma.securitySettings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      settings = await prisma.securitySettings.create({
        data: {
          id: 'singleton',
          passwordMinLength: 8,
          requireSpecialChar: true,
          sessionTimeoutMins: 60,
          enable2FA: false,
        },
      });
    }
    return settings;
  } catch (error) {
    console.error('Error fetching security settings:', error);
    return null;
  }
}

export async function updateSecuritySettings(data: Partial<Prisma.SecuritySettingsUpdateInput>) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  try {
    const settings = await prisma.securitySettings.update({
      where: { id: 'singleton' },
      data,
    });
    revalidatePath('/', 'layout');
    return { success: true, settings };
  } catch (error) {
    console.error('Error updating security settings:', error);
    return { success: false, error: 'Failed to update security settings' };
  }
}

export async function getNotificationSettings() {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  try {
    let settings = await prisma.notificationSettings.findUnique({
      where: { id: 'singleton' },
    });

    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: {
          id: 'singleton',
          emailNotifications: true,
          securityAlerts: true,
          systemNotifications: true,
        },
      });
    }
    return settings;
  } catch (error) {
    console.error('Error fetching notification settings:', error);
    return null;
  }
}

export async function updateNotificationSettings(data: Partial<Prisma.NotificationSettingsUpdateInput>) {
  const session = await verifySession();
  if (!session) throw new Error('Unauthorized');
  try {
    const settings = await prisma.notificationSettings.update({
      where: { id: 'singleton' },
      data,
    });
    revalidatePath('/', 'layout');
    return { success: true, settings };
  } catch (error) {
    console.error('Error updating notification settings:', error);
    return { success: false, error: 'Failed to update notification settings' };
  }
}
