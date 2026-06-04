'use client';

import React, { useState, useEffect, useRef, useTransition } from 'react';
import Link from 'next/link';
import { UploadCloud, CheckCircle2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
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
import ServiceLivePreview from './ServiceLivePreview';

type ServiceData = {
  id?: string;
  title: string;
  description: string;
  icon: string;
  imagePath: string;
  features: string;
  order: number;
};

// Common icons for the visual grid
const COMMON_ICONS = [
  'ShieldCheck', 'Flame', 'Zap', 'Cctv', 'Server',
  'Building', 'HardHat', 'Wrench', 'Briefcase', 'Activity',
  'Lock', 'Radio', 'Wifi', 'BatteryCharging', 'Camera',
];

export default function PremiumServiceForm({
  service,
  action,
}: {
  service?: ServiceData;
  action: (formData: FormData) => Promise<void>;
}) {
  const [activeTab, setActiveTab] = useState('general');
  // isDirty starts false; only set true after the user actually changes a field
  const [isDirty, setIsDirty] = useState(false);
  const isMounted = useRef(false);

  // Form State
  const [title, setTitle] = useState(service?.title || '');
  const [description, setDescription] = useState(service?.description || '');
  const [icon, setIcon] = useState(service?.icon || 'Layers');
  // storedImagePath = the DB path, never overwritten by a blob URL
  const [storedImagePath, setStoredImagePath] = useState(service?.imagePath || '');
  const [previewImageSrc, setPreviewImageSrc] = useState(service?.imagePath || '');
  const [order, setOrder] = useState(service?.order?.toString() || '0');

  const defaultFeatures = service?.features
    ? JSON.parse(service.features).join('\n')
    : '';
  const [featuresText, setFeaturesText] = useState(defaultFeatures);

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
  }, [title, description, icon, storedImagePath, previewImageSrc, order, featuresText]);

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
      // storedImagePath is left alone — server reads the actual file
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
      service ? 'Updating service…' : 'Publishing service…'
    );

    startTransition(async () => {
      try {
        await action(formData);
        // If redirect() fires, execution never reaches here — handled in catch
        toast.success(
          service ? 'Service updated successfully!' : 'Service published successfully!',
          { id: toastId }
        );
      } catch (err) {
        // Next.js redirect() throws NEXT_REDIRECT — show success then let it navigate
        if (isRedirectError(err)) {
          toast.success(
            service ? 'Service updated successfully!' : 'Service published successfully!',
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
              <label className="admin-label" htmlFor="title">Service Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                className="admin-input"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Fire Alarm Installation"
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
                placeholder="A short summary about this service..."
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label" htmlFor="features">Features (One per line)</label>
              <textarea
                id="features"
                name="features"
                className="admin-textarea"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                style={{ minHeight: '120px' }}
                placeholder={'Advanced Fire Detection\n24/7 Monitoring\nCode-Compliant'}
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-label">Icon Selection</label>
              <div className="admin-icon-grid">
                {COMMON_ICONS.map((i) => {
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  const Icon = (LucideIcons as any)[i];
                  if (!Icon) return null;
                  return (
                    <div
                      key={i}
                      className={`admin-icon-selector ${icon === i ? 'active' : ''}`}
                      onClick={() => setIcon(i)}
                      title={i}
                    >
                      <Icon size={24} />
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '1rem' }}>
                <input
                  type="text"
                  id="icon"
                  name="icon"
                  className="admin-input"
                  required
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  placeholder="Or type any Lucide icon name…"
                />
              </div>
            </div>
          </div>

          {/* ── MEDIA TAB ── */}
          <div style={{ display: activeTab === 'media' ? 'block' : 'none' }}>
            <div className="admin-form-group">
              <label className="admin-label">Service Image</label>
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
                  {isPending ? 'Saving…' : (service ? 'Update Service' : 'Publish Service')}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {service ? 'Update this service?' : 'Publish this service?'}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {service
                      ? 'Your changes will be saved and reflected on the live website immediately.'
                      : 'This service will be visible to all visitors on the public website immediately after publishing.'}
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
                    {service ? 'Yes, update' : 'Yes, publish'}
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
              href="/admin/services"
              className="admin-btn admin-btn-ghost"
              style={{ marginLeft: 'auto' }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      {/* ── RIGHT PANE — LIVE PREVIEW ── */}
      <ServiceLivePreview
        title={title}
        description={description}
        iconName={icon}
        features={featuresText.split('\n').filter((f: string) => f.trim() !== '')}
        imageSrc={previewImageSrc}
      />
    </div>
  );
}
