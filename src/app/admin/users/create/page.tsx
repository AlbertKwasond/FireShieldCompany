import React from 'react';
import UserForm from '../../components/UserForm';
import { createUser } from '@/app/actions/userActions';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function CreateUserPage() {
  return (
    <div>
      <div className="admin-header">
        <div className="admin-header-title">
          <Link href="/admin/users" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--admin-text-muted)', marginBottom: '0.5rem', textDecoration: 'none' }}>
            <ChevronLeft size={14} />
            Back to Users
          </Link>
          <h1>Add New User</h1>
          <p>Create a new user account with specific permissions.</p>
        </div>
      </div>

      <UserForm action={createUser} />
    </div>
  );
}
