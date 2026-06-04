import React from 'react';
import { getAboutContent } from '@/app/actions/aboutActions';
import AboutForm from '@/app/admin/components/AboutForm';

export default async function AdminAboutPage() {
  const content = await getAboutContent();

  if (!content) {
    return (
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>About Page Settings</h1>
          <p className="text-red-500">Failed to load content from the database. Please check your connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Manage About Page</h1>
          <p>Update the company story, mission, vision, timeline, and core values displayed on the About Us page.</p>
        </div>
      </div>

      <AboutForm initialData={content} />
    </div>
  );
}
