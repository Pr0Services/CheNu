/**
 * CHE·NU — ARCHITECTURAL SPHERE
 * Validators
 * 
 * Validates plans, avatars, exports against schema and rules.
 * Enforces FORBIDDEN actions.
 */

import {
  Plan,
  Avatar,
  DecorPreset,
  ThemeConfig,
  ExportPackage,
  ValidationResult,
  Zone,
  FORBIDDEN_ACTIONS,
  DOMAIN_RESTRICTIONS,
  ArchDomain,
  Dimension,
} from './types';

// ============================================================
// VALIDATION HELPERS
// ============================================================

function createError(field: string, message: string, severity: 'error' | 'warning' = 'error') {
  return { field, message, severity };
}

function isValidHexColor(color: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(color);
}

function isValidUUID(id: string): boolean {
  return /^[a-zA-Z0-9-_]+$/.test(id) && id.length >= 3 && id.length <= 64;
}

function isValidVersion(version: string): boolean {
  return /^\d+\.\d+\.\d+$/.test(version);
}

// ============================================================
// ZONE VALIDATOR
// ============================================================

export function validateZone(zone: Zone, index: number): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  const prefix = `zones[${index}]`;
  
  if (!zone.zone_id || !isValidUUID(zone.zone_id)) {
    errors.push(createError(`${prefix}.zone_id`, 'Invalid zone ID'));
  }
  
  if (!zone.name || zone.name.length < 1) {
    errors.push(createError(`${prefix}.name`, 'Zone name is required'));
  }
  
  if (!['conversation', 'visual', 'navigation', 'work', 'reflection'].includes(zone.purpose)) {
    errors.push(createError(`${prefix}.purpose`, 'Invalid zone purpose'));
  }
  
  if (typeof zone.capacity !== 'number' || zone.capacity < 1 || zone.capacity > 1000) {
    errors.push(createError(`${prefix}.capacity`, 'Capacity must be 1-1000'));
  }
  
  if (!['public', 'private', 'invite'].includes(zone.visibility)) {
    errors.push(createError(`${prefix}.visibility`, 'Invalid visibility'));
  }
  
  return { valid: errors.length === 0, errors };
}

// ============================================================
// PLAN VALIDATOR
// ============================================================

export function validatePlan(plan: Plan): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  // Basic fields
  if (!plan.id || !isValidUUID(plan.id)) {
    errors.push(createError('id', 'Invalid plan ID'));
  }
  
  if (!plan.name || plan.name.length < 1 || plan.name.length > 100) {
    errors.push(createError('name', 'Name must be 1-100 characters'));
  }
  
  if (!['personal', 'business', 'scholar', 'xr', 'institution', 'creative'].includes(plan.domain)) {
    errors.push(createError('domain', 'Invalid domain'));
  }
  
  if (!['room', 'hub', 'radial', 'layered'].includes(plan.layout)) {
    errors.push(createError('layout', 'Invalid layout type'));
  }
  
  if (!['2d', '3d', 'xr'].includes(plan.dimension)) {
    errors.push(createError('dimension', 'Invalid dimension'));
  }
  
  // Zones
  if (!Array.isArray(plan.zones) || plan.zones.length === 0) {
    errors.push(createError('zones', 'At least one zone is required'));
  } else {
    plan.zones.forEach((zone, i) => {
      const zoneResult = validateZone(zone, i);
      errors.push(...zoneResult.errors);
    });
    
    // Check for duplicate zone IDs
    const zoneIds = plan.zones.map(z => z.zone_id);
    const duplicates = zoneIds.filter((id, i) => zoneIds.indexOf(id) !== i);
    if (duplicates.length > 0) {
      errors.push(createError('zones', `Duplicate zone IDs: ${duplicates.join(', ')}`));
    }
  }
  
  // Navigation
  if (!plan.navigation) {
    errors.push(createError('navigation', 'Navigation config is required'));
  } else {
    if (!['free', 'guided', 'contextual'].includes(plan.navigation.mode)) {
      errors.push(createError('navigation.mode', 'Invalid navigation mode'));
    }
  }
  
  // Metadata
  if (!plan.metadata) {
    errors.push(createError('metadata', 'Metadata is required'));
  } else {
    if (!plan.metadata.version || !isValidVersion(plan.metadata.version)) {
      errors.push(createError('metadata.version', 'Invalid version format (use x.y.z)'));
    }
  }
  
  // Domain-specific restrictions
  const restrictions = DOMAIN_RESTRICTIONS[plan.domain as ArchDomain] || [];
  if (restrictions.length > 0) {
    errors.push(createError('domain', `Domain restrictions apply: ${restrictions.join(', ')}`, 'warning'));
  }
  
  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}

// ============================================================
// AVATAR VALIDATOR
// ============================================================

export function validateAvatar(avatar: Avatar): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  if (!avatar.id || !isValidUUID(avatar.id)) {
    errors.push(createError('id', 'Invalid avatar ID'));
  }
  
  if (!avatar.name || avatar.name.length < 1) {
    errors.push(createError('name', 'Avatar name is required'));
  }
  
  if (!['user', 'agent', 'system'].includes(avatar.type)) {
    errors.push(createError('type', 'Invalid avatar type'));
  }
  
  // Visual
  if (!avatar.visual) {
    errors.push(createError('visual', 'Visual config is required'));
  } else {
    if (!['abstract', 'humanoid', 'symbolic', 'custom'].includes(avatar.visual.style)) {
      errors.push(createError('visual.style', 'Invalid style'));
    }
    if (!isValidHexColor(avatar.visual.primary_color)) {
      errors.push(createError('visual.primary_color', 'Invalid hex color'));
    }
    if (!isValidHexColor(avatar.visual.accent_color)) {
      errors.push(createError('visual.accent_color', 'Invalid hex color'));
    }
  }
  
  // Presence
  if (!avatar.presence) {
    errors.push(createError('presence', 'Presence config is required'));
  } else {
    if (avatar.presence.opacity < 0 || avatar.presence.opacity > 1) {
      errors.push(createError('presence.opacity', 'Opacity must be 0-1'));
    }
    if (avatar.presence.aura_radius < 0 || avatar.presence.aura_radius > 100) {
      errors.push(createError('presence.aura_radius', 'Aura radius must be 0-100'));
    }
  }
  
  // CRITICAL: Avatar cannot define permissions
  // This is enforced by schema - no permission fields exist
  
  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}

// ============================================================
// DECOR PRESET VALIDATOR
// ============================================================

export function validateDecorPreset(preset: DecorPreset): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  if (!preset.id || !isValidUUID(preset.id)) {
    errors.push(createError('id', 'Invalid preset ID'));
  }
  
  if (!preset.name || preset.name.length < 1) {
    errors.push(createError('name', 'Name is required'));
  }
  
  // Colors
  if (!preset.colors) {
    errors.push(createError('colors', 'Colors config is required'));
  } else {
    ['primary', 'secondary', 'accent', 'background'].forEach(key => {
      if (!isValidHexColor((preset.colors as any)[key])) {
        errors.push(createError(`colors.${key}`, 'Invalid hex color'));
      }
    });
  }
  
  // Lighting
  if (preset.lighting) {
    if (preset.lighting.intensity < 0 || preset.lighting.intensity > 1) {
      errors.push(createError('lighting.intensity', 'Intensity must be 0-1'));
    }
  }
  
  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}

// ============================================================
// EXPORT PACKAGE VALIDATOR
// ============================================================

export function validateExportPackage(pkg: ExportPackage): ValidationResult {
  const errors: ValidationResult['errors'] = [];
  
  if (pkg.sphere_id !== 'architectural') {
    errors.push(createError('sphere_id', 'Must be "architectural"'));
  }
  
  if (!['decor', 'avatar', 'plan', 'theme', 'navigation'].includes(pkg.asset_type)) {
    errors.push(createError('asset_type', 'Invalid asset type'));
  }
  
  if (!isValidVersion(pkg.version)) {
    errors.push(createError('version', 'Invalid version format'));
  }
  
  if (!pkg.hash_signature || pkg.hash_signature.length < 32) {
    errors.push(createError('hash_signature', 'Invalid hash signature'));
  }
  
  if (!Array.isArray(pkg.compatibility_tags) || pkg.compatibility_tags.length === 0) {
    errors.push(createError('compatibility_tags', 'At least one compatibility tag required'));
  }
  
  // Validate payload based on type
  if (pkg.payload) {
    let payloadResult: ValidationResult | null = null;
    
    switch (pkg.asset_type) {
      case 'plan':
        payloadResult = validatePlan(pkg.payload as Plan);
        break;
      case 'avatar':
        payloadResult = validateAvatar(pkg.payload as Avatar);
        break;
      case 'decor':
        payloadResult = validateDecorPreset(pkg.payload as DecorPreset);
        break;
    }
    
    if (payloadResult) {
      errors.push(...payloadResult.errors.map(e => ({
        ...e,
        field: `payload.${e.field}`,
      })));
    }
  }
  
  return { valid: errors.filter(e => e.severity === 'error').length === 0, errors };
}

// ============================================================
// FORBIDDEN ACTION CHECKER
// ============================================================

export interface ActionCheck {
  action: string;
  allowed: boolean;
  reason?: string;
}

export function checkForbiddenAction(action: string): ActionCheck {
  const forbidden = FORBIDDEN_ACTIONS.find(f => action.toLowerCase().includes(f.replace('_', '')));
  
  if (forbidden) {
    return {
      action,
      allowed: false,
      reason: `Action "${action}" is forbidden in Architectural Sphere: ${forbidden}`,
    };
  }
  
  return { action, allowed: true };
}

// ============================================================
// COMPATIBILITY CHECKER
// ============================================================

export function checkCompatibility(
  source: Dimension[],
  target: Dimension
): { compatible: boolean; reason?: string } {
  if (source.includes(target)) {
    return { compatible: true };
  }
  
  // 3D can fallback to 2D
  if (target === '2d' && source.includes('3d')) {
    return { compatible: true };
  }
  
  // XR can fallback to 3D or 2D
  if (target === '3d' && source.includes('xr')) {
    return { compatible: true };
  }
  
  if (target === '2d' && source.includes('xr')) {
    return { compatible: true };
  }
  
  return {
    compatible: false,
    reason: `Target dimension "${target}" not compatible with source [${source.join(', ')}]`,
  };
}

// ============================================================
// HASH GENERATOR
// ============================================================

export async function generateHash(data: unknown): Promise<string> {
  const str = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(str);
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  
  // Fallback for non-crypto environments
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}
