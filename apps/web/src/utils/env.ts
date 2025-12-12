/* =========================================
   CHE·NU — ENVIRONMENT CONFIGURATION
   
   Gestion centralisée des variables d'environnement.
   
   Usage:
   import { env, isDev, isProd } from '@/utils/env';
   
   if (isDev) { ... }
   const url = env.API_BASE_URL;
   ========================================= */

// === TYPES ===

interface EnvConfig {
  // Application
  NODE_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_VERSION: string;
  
  // Features
  ENABLE_XR: boolean;
  ENABLE_MULTIPLAYER: boolean;
  ENABLE_VOICE: boolean;
  DEBUG_MODE: boolean;
  
  // API
  API_BASE_URL: string;
  API_TIMEOUT: number;
  
  // WebSocket
  WS_URL: string;
  WS_RECONNECT_ATTEMPTS: number;
}

// === HELPERS ===

function getEnvVar(key: string, defaultValue?: string): string {
  // Support Vite
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[`VITE_${key}`];
    if (value !== undefined) return value;
  }
  
  // Support Node
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key];
    if (value !== undefined) return value;
  }
  
  // Default
  if (defaultValue !== undefined) return defaultValue;
  
  console.warn(`[CHE·NU] Missing env var: ${key}`);
  return '';
}

function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, String(defaultValue));
  return value === 'true' || value === '1';
}

function getEnvNumber(key: string, defaultValue: number): number {
  const value = getEnvVar(key, String(defaultValue));
  const num = parseInt(value, 10);
  return isNaN(num) ? defaultValue : num;
}

// === ENVIRONMENT DETECTION ===

const nodeEnv = getEnvVar('NODE_ENV', 'development') as EnvConfig['NODE_ENV'];

export const isDev = nodeEnv === 'development';
export const isProd = nodeEnv === 'production';
export const isTest = nodeEnv === 'test';

// === CONFIGURATION ===

export const env: EnvConfig = {
  NODE_ENV: nodeEnv,
  APP_NAME: getEnvVar('APP_NAME', 'CHE·NU'),
  APP_VERSION: getEnvVar('APP_VERSION', '0.1.0'),
  
  ENABLE_XR: getEnvBool('ENABLE_XR', true),
  ENABLE_MULTIPLAYER: getEnvBool('ENABLE_MULTIPLAYER', false),
  ENABLE_VOICE: getEnvBool('ENABLE_VOICE', true),
  DEBUG_MODE: getEnvBool('DEBUG_MODE', isDev),
  
  API_BASE_URL: getEnvVar('API_BASE_URL', 'http://localhost:8000'),
  API_TIMEOUT: getEnvNumber('API_TIMEOUT', 30000),
  
  WS_URL: getEnvVar('WS_URL', 'ws://localhost:8000/ws'),
  WS_RECONNECT_ATTEMPTS: getEnvNumber('WS_RECONNECT_ATTEMPTS', 5),
};

// === VALIDATION ===

function validateEnv(): void {
  const warnings: string[] = [];
  
  if (isProd && env.DEBUG_MODE) {
    warnings.push('DEBUG_MODE should be disabled in production');
  }
  
  if (isProd && env.API_BASE_URL.includes('localhost')) {
    warnings.push('API_BASE_URL contains localhost in production');
  }
  
  if (warnings.length > 0) {
    warnings.forEach((w) => console.warn(`[CHE·NU ENV] ${w}`));
  }
}

// Valider au chargement (sauf en test)
if (!isTest) {
  validateEnv();
}

// === FEATURE FLAGS ===

export const features = {
  xr: env.ENABLE_XR,
  multiplayer: env.ENABLE_MULTIPLAYER,
  voice: env.ENABLE_VOICE,
  debug: env.DEBUG_MODE,
} as const;

// === BUILD INFO ===

export const buildInfo = {
  name: env.APP_NAME,
  version: env.APP_VERSION,
  env: env.NODE_ENV,
  buildTime: __BUILD_TIME__ ?? new Date().toISOString(),
} as const;

// Déclaration pour TypeScript
declare const __BUILD_TIME__: string | undefined;

// === EXPORTS ===

export type { EnvConfig };
