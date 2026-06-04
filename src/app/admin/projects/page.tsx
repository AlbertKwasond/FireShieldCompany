import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getProjects } from '@/app/actions/projectActions';
import ProjectsTable from '@/app/admin/components/ProjectsTable';

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>Projects</h1>
          <p>Manage your portfolio of projects and deployments.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/projects/create" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add Project
          </Link>
        </div>
      </div>

      <ProjectsTable projects={projects} />
    </div>
  );
}
