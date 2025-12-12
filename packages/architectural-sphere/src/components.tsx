/**
 * CHE·NU — ARCHITECTURAL SPHERE
 * React Components
 * 
 * UI components for creating and editing spatial plans, avatars, and decor.
 * VISUAL ONLY — no logic modification capabilities.
 */

import React, { useState, useCallback, CSSProperties } from 'react';
import { useArchitectural } from './ArchitecturalContext';
import {
  Plan,
  Avatar,
  DecorPreset,
  Zone,
  ArchDomain,
  LayoutType,
  Dimension,
  ZonePurpose,
  Visibility,
  AvatarStyle,
  AvatarAnimation,
  DEFAULT_ZONE,
  DEFAULT_AVATAR_VISUAL,
  DEFAULT_AVATAR_PRESENCE,
  DEFAULT_ROLE_INDICATOR,
  DEFAULT_NAVIGATION,
} from './types';

// ============================================================
// STYLES
// ============================================================

const styles: Record<string, CSSProperties> = {
  container: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    padding: 20,
    maxWidth: 800,
    margin: '0 auto',
  },
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: 20,
    marginBottom: 20,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottom: '1px solid #e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    margin: '4px 0 0 0',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    outline: 'none',
    boxSizing: 'border-box' as const,
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    fontSize: 14,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    background: '#fff',
    outline: 'none',
  },
  colorInput: {
    width: 60,
    height: 36,
    padding: 2,
    border: '1px solid #d1d5db',
    borderRadius: 6,
    cursor: 'pointer',
  },
  button: {
    padding: '8px 16px',
    fontSize: 14,
    fontWeight: 500,
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  buttonPrimary: {
    background: '#7c3aed',
    color: '#fff',
  },
  buttonSecondary: {
    background: '#e5e7eb',
    color: '#374151',
  },
  buttonDanger: {
    background: '#ef4444',
    color: '#fff',
  },
  row: {
    display: 'flex',
    gap: 12,
    alignItems: 'flex-end',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
  },
  preview: {
    background: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    minHeight: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
    marginTop: 4,
  },
  badge: {
    display: 'inline-block',
    padding: '2px 8px',
    fontSize: 11,
    fontWeight: 500,
    borderRadius: 12,
    marginRight: 6,
  },
  zoneCard: {
    background: '#f9fafb',
    border: '1px solid #e5e7eb',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
  },
};

// ============================================================
// HELPER COMPONENTS
// ============================================================

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
}

function FormField({ label, children, error }: FormFieldProps) {
  return (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      {children}
      {error && <div style={styles.error}>{error}</div>}
    </div>
  );
}

// ============================================================
// PLAN EDITOR
// ============================================================

interface PlanEditorProps {
  plan?: Plan;
  onSave: (plan: Plan) => void;
  onCancel: () => void;
}

export function PlanEditor({ plan, onSave, onCancel }: PlanEditorProps) {
  const [formData, setFormData] = useState<Partial<Plan>>(plan || {
    id: `plan-${Date.now()}`,
    name: '',
    domain: 'xr',
    layout: 'room',
    dimension: '3d',
    zones: [],
    navigation: DEFAULT_NAVIGATION,
    metadata: {
      created_at: new Date().toISOString(),
      created_by: 'current-user',
      version: '1.0.0',
    },
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const updateField = <K extends keyof Plan>(field: K, value: Plan[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  };
  
  const addZone = () => {
    const newZone: Zone = {
      zone_id: `zone-${Date.now()}`,
      name: `Zone ${(formData.zones?.length || 0) + 1}`,
      ...DEFAULT_ZONE,
    };
    setFormData(prev => ({
      ...prev,
      zones: [...(prev.zones || []), newZone],
    }));
  };
  
  const updateZone = (index: number, updates: Partial<Zone>) => {
    setFormData(prev => ({
      ...prev,
      zones: prev.zones?.map((z, i) => i === index ? { ...z, ...updates } : z),
    }));
  };
  
  const removeZone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      zones: prev.zones?.filter((_, i) => i !== index),
    }));
  };
  
  const handleSubmit = () => {
    if (!formData.name) {
      setErrors({ name: 'Name is required' });
      return;
    }
    if (!formData.zones?.length) {
      setErrors({ zones: 'At least one zone is required' });
      return;
    }
    onSave(formData as Plan);
  };
  
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{plan ? 'Edit Plan' : 'Create Plan'}</h2>
          <p style={styles.subtitle}>Design a spatial layout for CHE·NU</p>
        </div>
      </div>
      
      <div style={styles.grid}>
        <FormField label="Plan Name" error={errors.name}>
          <input
            style={styles.input}
            value={formData.name || ''}
            onChange={e => updateField('name', e.target.value)}
            placeholder="Meeting Room Alpha"
          />
        </FormField>
        
        <FormField label="Domain">
          <select
            style={styles.select}
            value={formData.domain}
            onChange={e => updateField('domain', e.target.value as ArchDomain)}
          >
            <option value="xr">XR / Immersive</option>
            <option value="scholar">Scholar</option>
            <option value="institution">Institution</option>
            <option value="creative">Creative</option>
            <option value="business">Business</option>
            <option value="personal">Personal</option>
          </select>
        </FormField>
        
        <FormField label="Layout Type">
          <select
            style={styles.select}
            value={formData.layout}
            onChange={e => updateField('layout', e.target.value as LayoutType)}
          >
            <option value="room">Room (Enclosed)</option>
            <option value="hub">Hub (Central)</option>
            <option value="radial">Radial (Circular)</option>
            <option value="layered">Layered (Stacked)</option>
          </select>
        </FormField>
        
        <FormField label="Dimension">
          <select
            style={styles.select}
            value={formData.dimension}
            onChange={e => updateField('dimension', e.target.value as Dimension)}
          >
            <option value="2d">2D</option>
            <option value="3d">3D</option>
            <option value="xr">XR (Immersive)</option>
          </select>
        </FormField>
      </div>
      
      {/* Zones */}
      <div style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Zones</h3>
          <button
            style={{ ...styles.button, ...styles.buttonSecondary }}
            onClick={addZone}
          >
            + Add Zone
          </button>
        </div>
        
        {errors.zones && <div style={styles.error}>{errors.zones}</div>}
        
        {formData.zones?.map((zone, index) => (
          <div key={zone.zone_id} style={styles.zoneCard}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
              <input
                style={{ ...styles.input, flex: 1 }}
                value={zone.name}
                onChange={e => updateZone(index, { name: e.target.value })}
                placeholder="Zone name"
              />
              <select
                style={{ ...styles.select, width: 150 }}
                value={zone.purpose}
                onChange={e => updateZone(index, { purpose: e.target.value as ZonePurpose })}
              >
                <option value="conversation">Conversation</option>
                <option value="visual">Visual</option>
                <option value="navigation">Navigation</option>
                <option value="work">Work</option>
                <option value="reflection">Reflection</option>
              </select>
              <select
                style={{ ...styles.select, width: 120 }}
                value={zone.visibility}
                onChange={e => updateZone(index, { visibility: e.target.value as Visibility })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
                <option value="invite">Invite Only</option>
              </select>
              <input
                style={{ ...styles.input, width: 80 }}
                type="number"
                value={zone.capacity}
                onChange={e => updateZone(index, { capacity: parseInt(e.target.value) || 1 })}
                placeholder="Cap"
              />
              <button
                style={{ ...styles.button, ...styles.buttonDanger, padding: '8px 12px' }}
                onClick={() => removeZone(index)}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        <button
          style={{ ...styles.button, ...styles.buttonSecondary }}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          style={{ ...styles.button, ...styles.buttonPrimary }}
          onClick={handleSubmit}
        >
          {plan ? 'Update Plan' : 'Create Plan'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// AVATAR EDITOR
// ============================================================

interface AvatarEditorProps {
  avatar?: Avatar;
  onSave: (avatar: Avatar) => void;
  onCancel: () => void;
}

export function AvatarEditor({ avatar, onSave, onCancel }: AvatarEditorProps) {
  const [formData, setFormData] = useState<Partial<Avatar>>(avatar || {
    id: `avatar-${Date.now()}`,
    type: 'agent',
    name: '',
    visual: DEFAULT_AVATAR_VISUAL,
    presence: DEFAULT_AVATAR_PRESENCE,
    role_indicator: DEFAULT_ROLE_INDICATOR,
    metadata: {
      created_at: new Date().toISOString(),
      created_by: 'current-user',
      version: '1.0.0',
    },
  });
  
  const updateVisual = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      visual: { ...prev.visual!, [key]: value },
    }));
  };
  
  const updatePresence = (key: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      presence: { ...prev.presence!, [key]: value },
    }));
  };
  
  const handleSubmit = () => {
    if (!formData.name) return;
    onSave(formData as Avatar);
  };
  
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{avatar ? 'Edit Avatar' : 'Create Avatar'}</h2>
          <p style={styles.subtitle}>Design a visual shell (no permissions)</p>
        </div>
      </div>
      
      {/* Preview */}
      <div style={styles.preview}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: formData.visual?.style === 'abstract' ? '50%' : 8,
          background: formData.visual?.primary_color || '#5DA9FF',
          boxShadow: formData.visual?.glow 
            ? `0 0 20px ${formData.visual?.primary_color}60`
            : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 24,
          fontWeight: 'bold',
        }}>
          {formData.name?.charAt(0).toUpperCase() || '?'}
        </div>
      </div>
      
      <div style={styles.grid}>
        <FormField label="Avatar Name">
          <input
            style={styles.input}
            value={formData.name || ''}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Nova Assistant"
          />
        </FormField>
        
        <FormField label="Type">
          <select
            style={styles.select}
            value={formData.type}
            onChange={e => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
          >
            <option value="user">User</option>
            <option value="agent">Agent</option>
            <option value="system">System</option>
          </select>
        </FormField>
        
        <FormField label="Style">
          <select
            style={styles.select}
            value={formData.visual?.style}
            onChange={e => updateVisual('style', e.target.value)}
          >
            <option value="abstract">Abstract</option>
            <option value="humanoid">Humanoid</option>
            <option value="symbolic">Symbolic</option>
            <option value="custom">Custom</option>
          </select>
        </FormField>
        
        <FormField label="Animation">
          <select
            style={styles.select}
            value={formData.visual?.animation}
            onChange={e => updateVisual('animation', e.target.value)}
          >
            <option value="idle">Idle</option>
            <option value="active">Active</option>
            <option value="thinking">Thinking</option>
            <option value="none">None</option>
          </select>
        </FormField>
      </div>
      
      <div style={{ ...styles.row, marginTop: 16 }}>
        <FormField label="Primary Color">
          <input
            type="color"
            style={styles.colorInput}
            value={formData.visual?.primary_color || '#5DA9FF'}
            onChange={e => updateVisual('primary_color', e.target.value)}
          />
        </FormField>
        
        <FormField label="Accent Color">
          <input
            type="color"
            style={styles.colorInput}
            value={formData.visual?.accent_color || '#E8B86D'}
            onChange={e => updateVisual('accent_color', e.target.value)}
          />
        </FormField>
        
        <FormField label="Glow">
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="checkbox"
              checked={formData.visual?.glow || false}
              onChange={e => updateVisual('glow', e.target.checked)}
            />
            Enable glow effect
          </label>
        </FormField>
      </div>
      
      <div style={{ ...styles.row, marginTop: 16 }}>
        <FormField label="Size">
          <select
            style={styles.select}
            value={formData.presence?.size}
            onChange={e => updatePresence('size', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </FormField>
        
        <FormField label={`Opacity: ${(formData.presence?.opacity || 1) * 100}%`}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={formData.presence?.opacity || 1}
            onChange={e => updatePresence('opacity', parseFloat(e.target.value))}
            style={{ width: '100%' }}
          />
        </FormField>
        
        <FormField label={`Aura: ${formData.presence?.aura_radius || 20}`}>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.presence?.aura_radius || 20}
            onChange={e => updatePresence('aura_radius', parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </FormField>
      </div>
      
      {/* Warning */}
      <div style={{
        background: '#FEF3C7',
        border: '1px solid #F59E0B',
        borderRadius: 6,
        padding: 12,
        marginTop: 20,
        fontSize: 13,
      }}>
        ⚠️ <strong>Avatar = Visual Shell Only</strong><br />
        This avatar defines appearance only. It does NOT grant permissions, 
        intelligence, or data access.
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
        <button style={{ ...styles.button, ...styles.buttonSecondary }} onClick={onCancel}>
          Cancel
        </button>
        <button style={{ ...styles.button, ...styles.buttonPrimary }} onClick={handleSubmit}>
          {avatar ? 'Update Avatar' : 'Create Avatar'}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// PLAN LIST
// ============================================================

export function PlanList() {
  const { state, deletePlan, setActivePlan, enterSandbox } = useArchitectural();
  const plans = Array.from(state.plans.values());
  
  if (plans.length === 0) {
    return (
      <div style={{ ...styles.card, textAlign: 'center', color: '#6b7280' }}>
        No plans created yet. Create your first spatial plan!
      </div>
    );
  }
  
  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id} style={styles.card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{plan.name}</h3>
              <div style={{ marginTop: 8 }}>
                <span style={{ ...styles.badge, background: '#E9D5FF', color: '#7C3AED' }}>
                  {plan.domain}
                </span>
                <span style={{ ...styles.badge, background: '#DBEAFE', color: '#2563EB' }}>
                  {plan.layout}
                </span>
                <span style={{ ...styles.badge, background: '#D1FAE5', color: '#059669' }}>
                  {plan.dimension}
                </span>
                <span style={{ ...styles.badge, background: '#F3F4F6', color: '#6B7280' }}>
                  {plan.zones.length} zones
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary, padding: '6px 12px' }}
                onClick={() => enterSandbox(plan)}
              >
                Preview
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonPrimary, padding: '6px 12px' }}
                onClick={() => setActivePlan(plan.id)}
              >
                Edit
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonDanger, padding: '6px 12px' }}
                onClick={() => deletePlan(plan.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// AVATAR LIST
// ============================================================

export function AvatarList() {
  const { state, deleteAvatar, setActiveAvatar, enterSandbox } = useArchitectural();
  const avatars = Array.from(state.avatars.values());
  
  if (avatars.length === 0) {
    return (
      <div style={{ ...styles.card, textAlign: 'center', color: '#6b7280' }}>
        No avatars created yet. Design your first avatar!
      </div>
    );
  }
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
      {avatars.map(avatar => (
        <div key={avatar.id} style={styles.card}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 60,
              height: 60,
              margin: '0 auto 12px',
              borderRadius: avatar.visual.style === 'abstract' ? '50%' : 8,
              background: avatar.visual.primary_color,
              boxShadow: avatar.visual.glow 
                ? `0 0 15px ${avatar.visual.primary_color}60`
                : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 20,
              fontWeight: 'bold',
            }}>
              {avatar.name.charAt(0).toUpperCase()}
            </div>
            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{avatar.name}</h4>
            <span style={{ ...styles.badge, marginTop: 8, background: '#F3F4F6', color: '#6B7280' }}>
              {avatar.type}
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button
              style={{ ...styles.button, ...styles.buttonSecondary, flex: 1, padding: '6px 8px', fontSize: 12 }}
              onClick={() => setActiveAvatar(avatar.id)}
            >
              Edit
            </button>
            <button
              style={{ ...styles.button, ...styles.buttonDanger, padding: '6px 8px', fontSize: 12 }}
              onClick={() => deleteAvatar(avatar.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// DOMAIN ENABLEMENT
// ============================================================

export function DomainEnablement() {
  const { state, enableDomain, disableDomain } = useArchitectural();
  
  const domains: { id: ArchDomain; name: string; icon: string }[] = [
    { id: 'xr', name: 'XR / Immersive', icon: '🥽' },
    { id: 'scholar', name: 'Scholar', icon: '📚' },
    { id: 'institution', name: 'Institutions', icon: '🏛️' },
    { id: 'creative', name: 'Creative', icon: '🎨' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'personal', name: 'Personal', icon: '👤' },
  ];
  
  return (
    <div style={styles.card}>
      <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Domain Enablement</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        {domains.map(domain => {
          const enabled = state.enabledDomains.has(domain.id);
          return (
            <label
              key={domain.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: 12,
                border: `2px solid ${enabled ? '#7C3AED' : '#e5e7eb'}`,
                borderRadius: 8,
                cursor: 'pointer',
                background: enabled ? '#F5F3FF' : '#fff',
              }}
            >
              <input
                type="checkbox"
                checked={enabled}
                onChange={e => e.target.checked ? enableDomain(domain.id) : disableDomain(domain.id)}
              />
              <span style={{ fontSize: 20 }}>{domain.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 500 }}>{domain.name}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// EXPORT
// ============================================================

export { PlanEditor, AvatarEditor, PlanList, AvatarList, DomainEnablement };
