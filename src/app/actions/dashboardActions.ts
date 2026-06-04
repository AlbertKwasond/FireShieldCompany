'use server';

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';

export async function getDashboardOverview() {
  const session = await verifySession();
  if (!session?.userId) {
    throw new Error('Unauthorized');
  }

  // 1. Fetch KPIs
  const kpisPromise = Promise.all([
    prisma.service.count(),
    prisma.project.count(),
    prisma.industry.count(),
    prisma.user.count(),
  ]);

  // 2. Fetch Recent Activity
  const recentActivityPromise = prisma.activityLog.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: { name: true, avatar: true }
      }
    }
  });

  // 3. Generate Chart Data (Last 7 Days)
  const today = new Date();
  const chartDataPromises = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextDay = new Date(d);
    nextDay.setDate(d.getDate() + 1);

    const countPromise = prisma.activityLog.count({
      where: {
        createdAt: {
          gte: d,
          lt: nextDay,
        }
      }
    }).then(count => ({
      name: d.toLocaleDateString('en-US', { weekday: 'short' }),
      activity: count,
    }));
    
    chartDataPromises.push(countPromise);
  }

  // Execute all queries concurrently
  const [
    [services, projects, industries, users],
    recentActivity,
    chartData
  ] = await Promise.all([
    kpisPromise,
    recentActivityPromise,
    Promise.all(chartDataPromises)
  ]);

  return {
    kpis: { services, projects, industries, users },
    recentActivity,
    chartData,
  };
}
