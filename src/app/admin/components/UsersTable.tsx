'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { deleteUser } from '@/app/actions/userActions';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

type UserData = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  createdAt: Date;
};

export default function UsersTable({ users }: { users: UserData[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    const toastId = toast.loading('Deleting user...');
    try {
      const res = await deleteUser(id);
      if (res.success) {
        toast.success('User deleted successfully.', { id: toastId });
      } else {
        toast.error(res.error || 'Failed to delete user.', { id: toastId });
      }
    } catch {
      toast.error('An unexpected error occurred.', { id: toastId });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="admin-card">
      <div className="admin-card-header" style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--admin-border)' }}>
        <div className="admin-search" style={{ width: '250px' }}>
          <Search size={16} color="var(--admin-text-muted)" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Added</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--admin-text-muted)' }}>
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="admin-user-avatar" style={{ width: 32, height: 32, fontSize: '0.75rem', overflow: 'hidden', backgroundColor: 'var(--admin-bg-alt)' }}>
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          user.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--admin-text-main)' }}>{user.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${user.role === 'Super Admin' ? 'admin-badge-neutral' : 'admin-badge-warning'}`} style={{ backgroundColor: user.role === 'Super Admin' ? '#f1f5f9' : '#f0fdfa', color: user.role === 'Super Admin' ? '#475569' : '#0f766e' }}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-badge ${user.status === 'Active' ? 'admin-badge-success' : 'admin-badge-neutral'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Link href={`/admin/users/${user.id}/edit`} className="admin-icon-btn">
                        <Edit2 size={16} />
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button className="admin-icon-btn" style={{ color: 'var(--admin-danger)' }} disabled={isDeleting === user.id}>
                            <Trash2 size={16} />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the user account.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              style={{ backgroundColor: 'var(--admin-danger)', color: 'white' }}
                              onClick={() => handleDelete(user.id)}
                            >
                              Yes, delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
