'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateAboutContent } from '@/app/actions/aboutActions';
import { toast } from 'sonner';
import { Save, Image as ImageIcon, Plus, Trash2 } from 'lucide-react';

interface AboutContentData {
  id: string;
  heroTitle: string;
  heroDescription: string;
  storyTitle: string;
  storyDescription1: string;
  storyDescription2: string;
  storyImagePath: string;
  mission: string;
  vision: string;
  timeline: string;
  coreValues: string;
  leadership: string;
}

interface AboutFormProps {
  initialData: AboutContentData;
}

export default function AboutForm({ initialData }: AboutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [previewImage, setPreviewImage] = useState<string | null>(initialData.storyImagePath || null);
  
  // Parse JSON for dynamic editors
  const [timeline, setTimeline] = useState(() => {
    try { return JSON.parse(initialData.timeline) || []; } catch { return []; }
  });
  
  const [coreValues, setCoreValues] = useState(() => {
    try { return JSON.parse(initialData.coreValues) || []; } catch { return []; }
  });

  const [leadership, setLeadership] = useState(() => {
    try { return JSON.parse(initialData.leadership) || []; } catch { return []; }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    } else {
      setPreviewImage(initialData.storyImagePath || null);
    }
  };

  const handleTimelineChange = (index: number, field: string, value: string) => {
    const newTimeline = [...timeline];
    newTimeline[index] = { ...newTimeline[index], [field]: value };
    setTimeline(newTimeline);
  };

  const handleCoreValueChange = (index: number, field: string, value: string) => {
    const newValues = [...coreValues];
    newValues[index] = { ...newValues[index], [field]: value };
    setCoreValues(newValues);
  };

  const handleLeadershipChange = (index: number, field: string, value: string) => {
    const newLeadership = [...leadership];
    newLeadership[index] = { ...newLeadership[index], [field]: value };
    setLeadership(newLeadership);
  };

  const handleLeadershipImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const newLeadership = [...leadership];
    if (file) {
      newLeadership[index].preview = URL.createObjectURL(file);
    } else {
      newLeadership[index].preview = undefined;
    }
    setLeadership(newLeadership);
  };

  const handleLeadershipRemoveImage = (index: number) => {
    const newLeadership = [...leadership];
    newLeadership[index] = { ...newLeadership[index], imagePath: '', preview: undefined };
    setLeadership(newLeadership);
  };

  const action = async (formData: FormData) => {
    // Inject the stringified JSONs
    formData.set('timeline', JSON.stringify(timeline));
    formData.set('coreValues', JSON.stringify(coreValues));
    
    // Strip preview properties from leadership before stringifying
    const cleanLeadership = leadership.map(({ preview, ...rest }: any) => rest);
    formData.set('leadership', JSON.stringify(cleanLeadership));

    startTransition(async () => {
      const result = await updateAboutContent(formData);
      if (result.success) {
        toast.success('About page updated successfully');
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to update about page');
      }
    });
  };

  return (
    <form action={action} className="admin-form" style={{ maxWidth: '900px', paddingBottom: '4rem' }}>
      <div className="admin-form-actions" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        <button type="submit" disabled={isPending} className="admin-btn admin-btn-primary">
          {isPending ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--black-bg)' }}>Hero Section</h2>
        <div className="admin-form-group">
          <label className="admin-label">Hero Title</label>
          <input type="text" name="heroTitle" className="admin-input" defaultValue={initialData.heroTitle} required />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Hero Description</label>
          <textarea name="heroDescription" className="admin-input" rows={3} defaultValue={initialData.heroDescription} required />
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--black-bg)' }}>Company Story</h2>
        <div className="admin-form-group">
          <label className="admin-label">Story Title</label>
          <input type="text" name="storyTitle" className="admin-input" defaultValue={initialData.storyTitle} required />
        </div>
        
        <div className="admin-form-group">
          <label className="admin-label">Story Image</label>
          <input type="hidden" name="storyImagePath" value={initialData.storyImagePath} />
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div 
              style={{ 
                width: '160px', 
                height: '160px', 
                borderRadius: '8px', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--bg-secondary)',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              {previewImage ? (
                <img src={previewImage} alt="Story Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <ImageIcon size={32} color="var(--charcoal)" opacity={0.5} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <input 
                type="file" 
                name="storyImageFile" 
                accept="image/*" 
                onChange={handleImageChange}
                className="admin-input" 
                style={{ marginBottom: '0.5rem' }}
              />
              <p style={{ fontSize: '0.85rem', color: 'var(--charcoal)' }}>Upload an image to display beside the story timeline. Recommended aspect ratio 3:4 or 1:1.</p>
            </div>
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Story Paragraph 1</label>
          <textarea name="storyDescription1" className="admin-input" rows={4} defaultValue={initialData.storyDescription1} required />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Story Paragraph 2</label>
          <textarea name="storyDescription2" className="admin-input" rows={4} defaultValue={initialData.storyDescription2} required />
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--black-bg)' }}>Mission & Vision</h2>
        <div className="admin-form-group">
          <label className="admin-label">Mission Statement</label>
          <textarea name="mission" className="admin-input" rows={3} defaultValue={initialData.mission} required />
        </div>
        <div className="admin-form-group">
          <label className="admin-label">Vision Statement</label>
          <textarea name="vision" className="admin-input" rows={3} defaultValue={initialData.vision} required />
        </div>
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--black-bg)', margin: 0 }}>Timeline Events</h2>
          <button 
            type="button" 
            onClick={() => setTimeline([...timeline, { year: '', title: '', desc: '' }])}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
          >
            <Plus size={16} /> Add Event
          </button>
        </div>
        
        {timeline.map((item: any, index: number) => (
          <div key={index} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setTimeline(timeline.filter((_: any, i: number) => i !== index))}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            >
              <Trash2 size={16} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem', marginBottom: '1rem', paddingRight: '2rem' }}>
              <div>
                <label className="admin-label" style={{ fontSize: '0.85rem' }}>Year</label>
                <input type="text" className="admin-input" value={item.year} onChange={(e) => handleTimelineChange(index, 'year', e.target.value)} />
              </div>
              <div>
                <label className="admin-label" style={{ fontSize: '0.85rem' }}>Title</label>
                <input type="text" className="admin-input" value={item.title} onChange={(e) => handleTimelineChange(index, 'title', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="admin-label" style={{ fontSize: '0.85rem' }}>Description</label>
              <input type="text" className="admin-input" value={item.desc} onChange={(e) => handleTimelineChange(index, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        {timeline.length === 0 && <p style={{ color: 'var(--charcoal)', fontStyle: 'italic', fontSize: '0.9rem' }}>No timeline events. Add one above.</p>}
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--black-bg)', margin: 0 }}>Core Values</h2>
          <button 
            type="button" 
            onClick={() => setCoreValues([...coreValues, { icon: 'CheckCircle', title: '', desc: '' }])}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
          >
            <Plus size={16} /> Add Value
          </button>
        </div>
        
        {coreValues.map((item: any, index: number) => (
          <div key={index} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setCoreValues(coreValues.filter((_: any, i: number) => i !== index))}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            >
              <Trash2 size={16} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', marginBottom: '1rem', paddingRight: '2rem' }}>
              <div>
                <label className="admin-label" style={{ fontSize: '0.85rem' }}>Icon (Lucide name)</label>
                <input type="text" className="admin-input" value={item.icon} onChange={(e) => handleCoreValueChange(index, 'icon', e.target.value)} />
              </div>
              <div>
                <label className="admin-label" style={{ fontSize: '0.85rem' }}>Title</label>
                <input type="text" className="admin-input" value={item.title} onChange={(e) => handleCoreValueChange(index, 'title', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="admin-label" style={{ fontSize: '0.85rem' }}>Description</label>
              <textarea className="admin-input" rows={2} value={item.desc} onChange={(e) => handleCoreValueChange(index, 'desc', e.target.value)} />
            </div>
          </div>
        ))}
        {coreValues.length === 0 && <p style={{ color: 'var(--charcoal)', fontStyle: 'italic', fontSize: '0.9rem' }}>No core values. Add one above.</p>}
      </div>

      <div className="admin-card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--black-bg)', margin: 0 }}>Leadership</h2>
          <button 
            type="button" 
            onClick={() => setLeadership([...leadership, { name: '', role: '' }])}
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0.5rem', fontSize: '0.9rem' }}
          >
            <Plus size={16} /> Add Leader
          </button>
        </div>
        
        {leadership.map((item: any, index: number) => (
          <div key={index} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem', position: 'relative' }}>
            <button 
              type="button"
              onClick={() => setLeadership(leadership.filter((_: any, i: number) => i !== index))}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            >
              <Trash2 size={16} />
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', paddingRight: '2rem', marginBottom: '1rem' }}>
              <div>
                <label className="admin-label" style={{ fontSize: '0.85rem' }}>Name</label>
                <input type="text" className="admin-input" value={item.name} onChange={(e) => handleLeadershipChange(index, 'name', e.target.value)} />
              </div>
              <div>
                <label className="admin-label" style={{ fontSize: '0.85rem' }}>Role</label>
                <input type="text" className="admin-input" value={item.role} onChange={(e) => handleLeadershipChange(index, 'role', e.target.value)} />
              </div>
            </div>
              <div>
              <label className="admin-label" style={{ fontSize: '0.85rem' }}>Profile Image</label>
              <input type="hidden" name={`leadershipImagePath_${index}`} value={item.imagePath || ''} />
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', paddingRight: '2rem' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', overflow: 'hidden', border: '1px solid var(--border-color)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {(item.preview || item.imagePath) ? (
                    <img src={item.preview || item.imagePath} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <ImageIcon size={20} color="var(--charcoal)" opacity={0.5} />
                  )}
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <input type="file" name={`leadershipImageFile_${index}`} accept="image/*" onChange={(e) => handleLeadershipImageChange(index, e)} className="admin-input" />
                  {(item.preview || item.imagePath) && (
                    <button
                      type="button"
                      onClick={() => handleLeadershipRemoveImage(index)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'none', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '6px', padding: '0.3rem 0.75rem', fontSize: '0.8rem', cursor: 'pointer', width: 'fit-content' }}
                    >
                      <Trash2 size={13} /> Remove Image
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
        {leadership.length === 0 && <p style={{ color: 'var(--charcoal)', fontStyle: 'italic', fontSize: '0.9rem' }}>No leadership team members. Add one above.</p>}
      </div>
      
    </form>
  );
}
