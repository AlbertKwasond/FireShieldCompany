import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getServices } from '@/app/actions/serviceActions';
import ServicesTable from '@/app/admin/components/ServicesTable';

export default async function AdminServices() {
  const services = await getServices();

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Manage Services</h1>
          <p>Create, edit, and organize the engineering services offered.</p>
        </div>
        <Link href="/admin/services/create" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add Service
        </Link>
      </div>

      <ServicesTable services={services} />
    </div>
  );
}
