import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import IndustryForm from '../../../components/IndustryForm';
import { getIndustry, updateIndustry } from '@/app/actions/industryActions';

export const metadata = {
  title: 'Edit Industry | Fire Shield Admin',
};

export default async function EditIndustryPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const industry = await getIndustry(params.id);

  if (!industry) {
    notFound();
  }

  // Bind the industry ID to the update action
  const updateAction = updateIndustry.bind(null, industry.id);

  return (
    <div className="admin-page animate-fade-in">
      <div className="admin-page-header">
        <div>
          <Link href="/admin/industries" className="admin-back-link">
            <ArrowLeft size={16} />
            Back to Industries
          </Link>
          <h1 className="admin-page-title" style={{ marginTop: '0.5rem' }}>Edit Industry</h1>
          <p className="admin-page-description">
            Update the details, media, and settings for this industry.
          </p>
        </div>
      </div>

      <IndustryForm industry={industry} action={updateAction} />
    </div>
  );
}
