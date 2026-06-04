import React from 'react';
import { notFound } from 'next/navigation';
import ProjectForm from '@/app/admin/components/ProjectForm';
import { getProject, updateProject } from '@/app/actions/projectActions';

export default async function EditProjectPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const project = await getProject(params.id);

  if (!project) {
    notFound();
  }

  // Bind the ID to the update action
  const updateProjectWithId = updateProject.bind(null, project.id);

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Edit Project</h1>
          <p>Update the details and visibility of this project.</p>
        </div>
      </div>
      <ProjectForm project={project} action={updateProjectWithId} />
    </div>
  );
}
