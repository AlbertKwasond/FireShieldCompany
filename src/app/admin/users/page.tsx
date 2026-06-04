import React from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getUsers } from '@/app/actions/userActions';
import UsersTable from '@/app/admin/components/UsersTable';

export const dynamic = 'force-dynamic';

export default async function UsersManagementPage() {
  const users = await getUsers();

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <h1>User Management</h1>
          <p>Manage system access, roles, and permissions.</p>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/users/create" className="admin-btn admin-btn-primary">
            <Plus size={18} />
            Add User
          </Link>
        </div>
      </div>

      <UsersTable users={users} />
    </div>
  );
}
