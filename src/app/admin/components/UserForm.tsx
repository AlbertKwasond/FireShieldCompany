'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { isRedirectError } from 'next/dist/client/components/redirect-error';
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
import UserLivePreview from './UserLivePreview';

type UserData = {
  id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
};

export default function UserForm({
  user,
  action,
}: {
  user?: UserData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState('general');
  const [isDirty, setIsDirty] = useState(false);
  const isMounted = useRef(false);

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(user?.role || 'Viewer');
  const [status, setStatus] = useState(user?.status || 'Active');

  const [storedAvatarPath, setStoredAvatarPath] = useState(user?.avatar || '');
  const [previewAvatarSrc, setPreviewAvatarSrc] = useState(user?.avatar || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setIsDirty(true);
  }, [name, email, password, role, status, previewAvatarSrc]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewAvatarSrc(url);
      setIsDirty(true);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewAvatarSrc(url);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      setIsDirty(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDirty(false);

    const formData = new FormData(e.currentTarget);
    const toastId = toast.loading(
      user ? 'Updating user…' : 'Creating user…'
    );

    startTransition(async () => {
      try {
        await action(formData);
        toast.success(
          user ? 'User updated successfully!' : 'User created successfully!',
          { id: toastId }
        );
      } catch (err) {
        if (isRedirectError(err)) {
          toast.success(
            user ? 'User updated successfully!' : 'User created successfully!',
            { id: toastId }
          );
          throw err;
        }
        toast.error('Something went wrong. Please try again.', { id: toastId });
        setIsDirty(true);
      }
    });
  };

  return (
    <div className="admin-preview-layout">
      {/* ── LEFT PANE — FORM ── */}
      <div className="admin-card" style={{ padding: '2rem' }}>

        {/* Tabs */}
        <div className="admin-tabs">
          <div
            className={`admin-tab ${activeTab === 'general' ? 'active' : ''}`}
            onClick={() => setActiveTab('general')}
          >
            General Info
          </div>
          <div
            className={`admin-tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            Avatar
          </div>
          <div
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Permissions
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>

          {/* ── GENERAL TAB ── */}
          <div style={{ display: activeTab === 'general' ? 'block' : 'none' }}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                className="admin-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., John Doe"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                className="admin-input"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., john@fireshieldghana.com"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="password">
                Password {user ? '(Leave blank to keep unchanged)' : '*'}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="admin-input"
                required={!user}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
              />
            </div>
          </div>

          {/* ── MEDIA TAB ── */}
          <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
            <div className="admin-form-group">
              <label className="admin-label">Profile Avatar</label>
              <div
                className="admin-dropzone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadCloud
                  size={32}
                  color="var(--admin-text-muted)"
                  style={{ margin: '0 auto 1rem auto' }}
                />
                <div style={{ fontWeight: 500, color: 'var(--admin-text-main)', marginBottom: '0.25rem' }}>
                  Click to upload or drag and drop
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--admin-text-muted)' }}>
                  SVG, PNG, JPG or GIF (max. 400×400 px)
                </div>
                <input
                  type="file"
                  name="avatarFile"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
              <input type="hidden" name="avatarPath" value={storedAvatarPath} />
            </div>
          </div>

          {/* ── SETTINGS TAB ── */}
          <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="role">User Role *</label>
              <select
                id="role"
                name="role"
                className="admin-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="status">Account Status *</label>
              <select
                id="status"
                name="status"
                className="admin-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* ── FORM ACTIONS ── */}
          <div
            className="admin-form-actions"
            style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', marginTop: '2rem' }}
          >
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  disabled={isPending}
                >
                  <CheckCircle2 size={16} />
                  {isPending ? 'Saving…' : (user ? 'Update User' : 'Create User')}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {user ? 'Update this user?' : 'Create this user?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {user
                      ? 'Are you sure you want to save these changes to the user profile?'
                      : 'This user will be created and granted the specified permissions immediately.'}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      if (formRef.current) {
                        formRef.current.requestSubmit();
                      }
                    }}
                  >
                    {user ? 'Yes, update' : 'Yes, create'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Link
              href="/admin/users"
              className="admin-btn admin-btn-ghost"
              style={{ marginLeft: 'auto' }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* ── RIGHT PANE — LIVE PREVIEW ── */}
      <UserLivePreview
        name={name}
        email={email}
        role={role}
        status={status}
        avatarSrc={previewAvatarSrc}
      />
    </div>
  );
}
