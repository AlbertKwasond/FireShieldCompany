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
import IndustryLivePreview from './IndustryLivePreview';

type IndustryData = {
  id?: string;
  title: string;
  description: string;
  icon: string;
  imagePath: string;
  order: number;
};

export default function IndustryForm({
  industry,
  action,
}: {
  industry?: IndustryData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState('general');
  // isDirty starts false; only set true after the user actually changes a field
  const [isDirty, setIsDirty] = useState(false);
  const isMounted = useRef(false);

  // Form State
  const [title, setTitle] = useState(industry?.title || '');
  const [description, setDescription] = useState(industry?.description || '');
  const [icon, setIcon] = useState(industry?.icon || 'Factory');
  const [order, setOrder] = useState(industry?.order?.toString() || '0');

  // storedImagePath = the DB path, never overwritten by a blob URL
  const [storedImagePath, setStoredImagePath] = useState(industry?.imagePath || '');
  const [previewImageSrc, setPreviewImageSrc] = useState(industry?.imagePath || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [isPending, startTransition] = useTransition();

  // Mark form dirty only after the component has mounted (skip the initial render)
  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    setIsDirty(true);
  }, [title, description, icon, order, storedImagePath, previewImageSrc]);

  // Warn before navigating away with unsaved changes
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

  // Handle file input change → blob preview only (storedImagePath stays unchanged)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImageSrc(url);
      setIsDirty(true);
    }
  };

  // Handle drag-and-drop → also wire the file input
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewImageSrc(url);
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
      }
      setIsDirty(true);
    }
  };

  // Submit handler with Sonner toast feedback
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDirty(false);

    const formData = new FormData(e.currentTarget);
    const toastId = toast.loading(
      industry ? 'Updating industry…' : 'Publishing industry…'
    );

    startTransition(async () => {
      try {
        await action(formData);
        // If redirect() fires, execution never reaches here — handled in catch
        toast.success(
          industry ? 'Industry updated successfully!' : 'Industry published successfully!',
          { id: toastId }
        );
      } catch (err) {
        // Next.js redirect() throws NEXT_REDIRECT — show success then let it navigate
        if (isRedirectError(err)) {
          toast.success(
            industry ? 'Industry updated successfully!' : 'Industry published successfully!',
            { id: toastId }
          );
          throw err;
        }
        toast.error('Something went wrong. Please try again.', { id: toastId });
        setIsDirty(true); // re-enable dirty guard on real errors
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
            Media
          </div>
          <div
            className={`admin-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Settings
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>

          {/* ── GENERAL TAB ── */}
          <div style={{ display: activeTab === 'general' ? 'block' : 'none' }}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="title">Industry Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="admin-input"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Manufacturing"
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="description">Short Description *</label>
              <textarea
                id="description"
                name="description"
                className="admin-textarea"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ minHeight: '80px' }}
                placeholder="A short summary highlighting key solutions..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="icon">Lucide Icon Name *</label>
              <input
                type="text"
                id="icon"
                name="icon"
                className="admin-input"
                required
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="e.g., Factory, Landmark, Server"
              />
              <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Enter the exact name of a Lucide React icon (e.g., Factory, Shield, Hospital).
              </small>
            </div>
          </div>

          {/* ── MEDIA TAB ── */}
          <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
            <div className="admin-form-group">
              <label className="admin-label">Industry Image *</label>
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
                  SVG, PNG, JPG or GIF (max. 800×400 px)
                </div>
                <input
                  type="file"
                  name="imageFile"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {/* Preserve existing DB path when no new file is uploaded */}
              <input type="hidden" name="imagePath" value={storedImagePath} />
            </div>
          </div>

          {/* ── SETTINGS TAB ── */}
          <div style={{ display: activeTab === 'settings' ? 'block' : 'none' }}>
            <div className="admin-form-group">
              <label className="admin-label" htmlFor="order">Display Order *</label>
              <input
                type="number"
                id="order"
                name="order"
                className="admin-input"
                min="0"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                style={{ maxWidth: '150px' }}
              />
              <small style={{ color: 'var(--admin-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' }}>
                Lower numbers appear first on the website.
              </small>
            </div>
          </div>

          {/* ── FORM ACTIONS ── */}
          <div
            className="admin-form-actions"
            style={{ borderTop: '1px solid var(--admin-border)', paddingTop: '1.5rem', marginTop: '2rem' }}
          >
            {/* Primary action with AlertDialog confirmation */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="admin-btn admin-btn-primary"
                  disabled={isPending}
                >
                  <CheckCircle2 size={16} />
                  {isPending ? 'Saving…' : (industry ? 'Update Industry' : 'Publish Industry')}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {industry ? 'Update this industry?' : 'Publish this industry?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {industry
                      ? 'Your changes will be saved and reflected on the live website immediately.'
                      : 'This industry will be visible to all visitors on the public website immediately after publishing.'}
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
                    {industry ? 'Yes, update' : 'Yes, publish'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <button
              type="button"
              className="admin-btn admin-btn-outline"
              disabled={isPending}
              onClick={() => toast.info('Draft saving is not yet connected to the database.')}
            >
              Save as Draft
            </button>

            <Link
              href="/admin/industries"
              className="admin-btn admin-btn-ghost"
              style={{ marginLeft: 'auto' }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* ── RIGHT PANE — LIVE PREVIEW ── */}
      <IndustryLivePreview
        title={title}
        description={description}
        iconName={icon}
        imageSrc={previewImageSrc}
      />
    </div>
  );
}
