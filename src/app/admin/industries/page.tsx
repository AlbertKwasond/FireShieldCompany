import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getIndustries } from '@/app/actions/industryActions';
import IndustriesTable from '../components/IndustriesTable';

export const metadata = {
  title: 'Industries Management | Fire Shield Admin',
};

export default async function AdminIndustriesPage() {
  const industries = await getIndustries();

  return (
    <div className="admin-page animate-fade-in">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Industries Management</h1>
          <p className="admin-page-description">
            Manage the industries that appear on the public Industries page.
          </p>
        </div>
        <Link href="/admin/industries/create" className="admin-btn admin-btn-primary">
          <Plus size={18} />
          Add New Industry
        </Link>
      </header>

      <IndustriesTable industries={industries} />
    </div>
  );
}
