import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import IndustryForm from '../../components/IndustryForm';
import { createIndustry } from '@/app/actions/industryActions';

export const metadata = {
  title: 'Add New Industry | Fire Shield Admin',
};

export default function CreateIndustryPage() {
  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/industries" className="admin-back-link">
            <ArrowLeft size={16} />
            Back to Industries
          </Link>
          <h1 className="admin-page-title" style={{ marginTop: '0.5rem' }}>Add New Industry</h1>
          <p className="admin-page-description">
            Create a new industry profile to display on the public website.
          </p>
        </div>
      </div>

      <IndustryForm action={createIndustry} />
    </div>
  );
}
