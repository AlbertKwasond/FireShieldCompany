import React from 'react';
import ProjectForm from '@/app/admin/components/ProjectForm';
import { createProject } from '@/app/actions/projectActions';

export default function CreateProjectPage() {
  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Create Project</h1>
          <p>Add a new project and manage how it appears on your website.</p>
        </div>
      </div>
      <ProjectForm action={createProject} />
    </div>
  );
}
