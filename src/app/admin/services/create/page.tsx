import React from 'react';
import PremiumServiceForm from '@/app/admin/components/PremiumServiceForm';
import { createService } from '@/app/actions/serviceActions';

export default function CreateServicePage() {
  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Create Service</h1>
          <p>Add a new service and manage how it appears on your website.</p>
        </div>
      </div>
      <PremiumServiceForm action={createService} />
    </div>
  );
}
