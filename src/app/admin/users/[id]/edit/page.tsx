import React from 'react';
import UserForm from '../../../components/UserForm';
import { getUser, updateUser } from '@/app/actions/userActions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const user = await getUser(resolvedParams.id);

  if (!user) {
    notFound();
  }

  // Bind the ID to the update action
  const updateAction = updateUser.bind(null, user.id);

  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <Link href="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textDecoration: 'none' }}>
            <ChevronLeft size={14} />
            Back to Users
          </Link>
          <h1>Edit User: {user.name}</h1>
          <p>Update user details and permissions.</p>
        </div>
      </div>

      <UserForm user={user} action={updateAction} />
    </div>
  );
}
