import prisma from '@/lib/prisma';

export type ActivityAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PUBLISH' | 'SETUP_2FA';
export type EntityType = 'Service' | 'Project' | 'Industry' | 'User' | 'Settings' | 'SecuritySettings' | 'Auth';

export interface LogActivityParams {
  action: ActivityAction;
  entityType: EntityType;
  entityId: string;
  entityName: string;
  userId: string;
  metadata?: Record<string, any>;
}

export async function logActivity(params: LogActivityParams) {
  try {
    await prisma.activityLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        entityName: params.entityName,
        userId: params.userId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch (error) {
    // We log the error but don't throw to prevent activity logging from breaking main workflows
    console.error('[logActivity] Failed to log activity:', error);
  }
}
