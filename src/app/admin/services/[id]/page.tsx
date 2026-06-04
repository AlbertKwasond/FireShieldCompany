import React from 'react';
import { notFound } from 'next/navigation';
import PremiumServiceForm from '@/app/admin/components/PremiumServiceForm';
import { getService, updateService } from '@/app/actions/serviceActions';

export default async function EditServicePage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  // We need to bind the ID to the update action
  const updateAction = updateService.bind(null, id);

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Edit Service</h1>
          <p>Update the service details and preview changes in real-time.</p>
        </div>
      </div>
      <PremiumServiceForm service={service} action={updateAction} />
    </div>
  );
}
