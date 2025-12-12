# 🎯 CHE·NU — PLAN D'AMÉLIORATION QUALITÉ

> **Objectif**: Passer de 6.7/10 → 9/10
> **Durée estimée**: 2-3 semaines
> **Priorité**: Production-ready pour Beta Q1 2025

---

## 📊 OBJECTIFS DE SCORE

| Catégorie | Actuel | Cible | Gain |
|-----------|--------|-------|------|
| Architecture | 8/10 | 9/10 | +1 |
| Documentation | 9/10 | 10/10 | +1 |
| Qualité Code | 7/10 | 9/10 | +2 |
| Sécurité | 6/10 | 9/10 | +3 |
| Maintenabilité | 6/10 | 9/10 | +3 |
| Tests | 4/10 | 8/10 | +4 |
| **TOTAL** | **6.7/10** | **9/10** | **+2.3** |

---

## 🗓️ ROADMAP EN 4 PHASES

```
┌─────────────────────────────────────────────────────────────────┐
│ SEMAINE 1                                                        │
│ ════════                                                         │
│ Phase 1: CORRECTIONS CRITIQUES (3 jours)                        │
│ • Consolidation types Preset                                     │
│ • Index.ts manquants                                             │
│ • Sécurité API keys                                              │
├─────────────────────────────────────────────────────────────────┤
│ SEMAINE 2                                                        │
│ ════════                                                         │
│ Phase 2: QUALITÉ CODE (4 jours)                                 │
│ • Éliminer types `any`                                           │
│ • Logger centralisé                                              │
│ • Gestion erreurs async                                          │
│ • Nettoyage console.log                                          │
├─────────────────────────────────────────────────────────────────┤
│ SEMAINE 3                                                        │
│ ════════                                                         │
│ Phase 3: TESTS (5 jours)                                        │
│ • Tests unitaires core                                           │
│ • Tests integration                                              │
│ • Coverage > 70%                                                 │
├─────────────────────────────────────────────────────────────────┤
│ SEMAINE 3-4                                                      │
│ ══════════                                                       │
│ Phase 4: POLISH (3 jours)                                       │
│ • TODOs résolus                                                  │
│ • Documentation API                                              │
│ • Audit final                                                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 PHASE 1: CORRECTIONS CRITIQUES

### 1.1 Consolidation Types Preset

**Problème**: 3 fichiers définissent les mêmes types
**Solution**: UN fichier unique `src/core/preset/types.ts`

```typescript
// FICHIER À CRÉER: src/core/preset/types.ts

/* =========================================
   CHE·NU — PRESET TYPES (Single Source of Truth)
   
   TOUS les autres fichiers importent depuis ici.
   NE JAMAIS dupliquer ces types ailleurs.
   ========================================= */

// === SOURCE ===

export type PresetSource =
  | 'manual'    // Choix explicite utilisateur
  | 'role'      // Changement de rôle
  | 'phase'     // Changement de phase
  | 'project'   // Changement de projet
  | 'sphere'    // Changement de sphère
  | 'agent';    // Suggestion agent acceptée

// === CHANGE EVENT ===

export interface PresetChange {
  /** Timestamp du changement */
  t: number;
  /** ID du preset */
  p: string;
  /** Source du changement */
  s: PresetSource;
  /** Contexte optionnel */
  ctx?: PresetContext;
}

export interface PresetContext {
  role?: string;
  phase?: string;
  project?: string;
  sphere?: string;
  agentId?: string;
  reason?: string;
}

// === AURA (XR) ===

export type AuraAnimation = 'static' | 'pulse' | 'wave' | 'breathe' | 'shimmer';

export interface PresetAuraConfig {
  /** Couleur principale (hex) */
  color: string;
  /** Rayon de l'aura */
  radius: number;
  /** Animation */
  animation?: AuraAnimation;
  /** Intensité (0-1) */
  intensity?: number;
  /** Particules activées */
  particles?: boolean;
}

// === METRICS ===

export interface PresetMetric {
  /** ID du preset */
  presetId: string;
  /** Nombre d'activations */
  count: number;
  /** Durée totale (ms) */
  durationMs: number;
  /** Taux d'acceptation (si suggéré) */
  acceptanceRate?: number;
}

// === TRANSITION ===

export interface PresetTransition {
  /** Preset de départ */
  from: string;
  /** Preset d'arrivée */
  to: string;
  /** Timestamp */
  at: number;
  /** Durée animation (ms) */
  duration?: number;
}

// === RESOLUTION ===

export interface PresetResolution {
  /** Preset résolu */
  preset: PresetConfig;
  /** Raisons de la suggestion */
  reasons: string[];
  /** Source de la résolution */
  source: PresetSource;
  /** Timestamp */
  timestamp: number;
}

export interface PresetConfig {
  id: string;
  label: string;
  description?: string;
  density: 'minimal' | 'balanced' | 'rich';
  xr: {
    enabled: boolean;
    aura?: PresetAuraConfig;
  };
}

// === LAWS (Immuables) ===

export const PRESET_LAWS = [
  'Timeline = vérité absolue',
  'XR = visualisation, jamais décision',
  'Metrics = observation, jamais jugement',
  'Aucun preset automatique',
  'Humain > système, toujours',
] as const;

export type PresetLaw = typeof PRESET_LAWS[number];
```

**Fichiers à mettre à jour**:
```bash
# Remplacer les imports dans:
src/core/preset-trunk.ts      → import { PresetChange, ... } from './preset/types'
src/core/preset-core.ts       → import { PresetChange, ... } from './preset/types'
src/core/preset-observability.ts → import { PresetChange, ... } from './preset/types'
src/core/preset-fusion.tsx    → import { PresetChange, ... } from './preset/types'
src/xr/presets/*              → import { PresetAuraConfig, ... } from '@core/preset/types'
```

---

### 1.2 Index.ts Manquants

**Créer**: `src/core/index.ts`

```typescript
// FICHIER À CRÉER: src/core/index.ts

/* =========================================
   CHE·NU — CORE BARREL EXPORTS
   ========================================= */

// === PRESET SYSTEM ===
export * from './preset/types';
export * from './preset-trunk';

// === DIMENSION ===
export * from './dimension';

// === LAYOUT ===
export * from './layout';

// === THEME ===
export * from './theme';

// === AGENTS ===
export * from './agents';

// === MEETINGS ===
export * from './meetings';

// === CONFIG ===
export { default as config } from './config/chenu.config.json';
```

**Créer**: `src/ui/index.ts`

```typescript
// FICHIER À CRÉER: src/ui/index.ts

/* =========================================
   CHE·NU — UI BARREL EXPORTS
   ========================================= */

// === SPHERES ===
export * from './spheres';

// === AGENTS ===
export * from './agents';

// === PERSONALIZATION ===
export * from './personalization';

// === MEETINGS ===
export * from './meetings';

// === CONTAINERS ===
export { AdaptiveContainer } from './containers/AdaptiveContainer';
```

**Créer**: `src/core/preset/index.ts`

```typescript
// FICHIER À CRÉER: src/core/preset/index.ts

/* =========================================
   CHE·NU — PRESET BARREL EXPORTS
   ========================================= */

// Types (Single Source of Truth)
export * from './types';

// Re-export from trunk (canonical implementation)
export {
  PresetTimeline,
  addPresetChange,
  recordPreset,
  currentPreset,
  clearTimeline,
  PresetAura,
  getPresetAura,
  setPresetAura,
  presetAt,
  transitions,
  transitionAt,
  presetMetrics,
  topPresets,
  sourceCount,
  explainPreset,
  explainCurrent,
  sessionSummary,
} from '../preset-trunk';
```

---

### 1.3 Sécurité API Keys

**Créer**: `.env.example`

```bash
# FICHIER À CRÉER: .env.example

# =========================================
# CHE·NU — Environment Variables Template
# =========================================

# === APPLICATION ===
NODE_ENV=development
APP_NAME=CHE-NU
APP_VERSION=0.1.0

# === API KEYS (NEVER COMMIT REAL VALUES) ===
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
GOOGLE_API_KEY=xxxxxxxxxxxxx

# === DATABASE ===
DATABASE_URL=postgresql://user:password@localhost:5432/chenu
REDIS_URL=redis://localhost:6379

# === SECURITY ===
SECRET_KEY=your-256-bit-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440

# === CORS ===
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# === FEATURES ===
ENABLE_XR=true
ENABLE_MULTIPLAYER=false
DEBUG_MODE=true
```

**Mettre à jour**: `.gitignore`

```bash
# Ajouter à .gitignore:

# Environment
.env
.env.local
.env.*.local
*.env

# API Keys
**/api_keys.json
**/secrets.json

# IDE
.idea/
.vscode/
*.swp
*.swo

# Build
dist/
build/
*.log

# Dependencies
node_modules/
__pycache__/
*.pyc
.venv/
```

**Créer**: `src/utils/env.ts`

```typescript
// FICHIER À CRÉER: src/utils/env.ts

/* =========================================
   CHE·NU — Environment Configuration
   ========================================= */

interface EnvConfig {
  // App
  NODE_ENV: 'development' | 'production' | 'test';
  APP_NAME: string;
  APP_VERSION: string;
  
  // Features
  ENABLE_XR: boolean;
  ENABLE_MULTIPLAYER: boolean;
  DEBUG_MODE: boolean;
  
  // API (frontend-safe only)
  API_BASE_URL: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = import.meta.env[`VITE_${key}`] ?? defaultValue;
  if (value === undefined) {
    console.warn(`[CHE·NU] Missing env var: ${key}`);
    return '';
  }
  return value;
}

function getEnvBool(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key, String(defaultValue));
  return value === 'true' || value === '1';
}

export const env: EnvConfig = {
  NODE_ENV: (getEnvVar('NODE_ENV', 'development') as EnvConfig['NODE_ENV']),
  APP_NAME: getEnvVar('APP_NAME', 'CHE·NU'),
  APP_VERSION: getEnvVar('APP_VERSION', '0.1.0'),
  
  ENABLE_XR: getEnvBool('ENABLE_XR', true),
  ENABLE_MULTIPLAYER: getEnvBool('ENABLE_MULTIPLAYER', false),
  DEBUG_MODE: getEnvBool('DEBUG_MODE', true),
  
  API_BASE_URL: getEnvVar('API_BASE_URL', 'http://localhost:8000'),
};

export const isDev = env.NODE_ENV === 'development';
export const isProd = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Validation au démarrage
if (isProd && env.DEBUG_MODE) {
  console.warn('[CHE·NU] DEBUG_MODE should be disabled in production!');
}
```

---

## 📁 PHASE 2: QUALITÉ CODE

### 2.1 Logger Centralisé

**Créer**: `src/utils/logger.ts`

```typescript
// FICHIER À CRÉER: src/utils/logger.ts

/* =========================================
   CHE·NU — Centralized Logger
   
   Remplace tous les console.log du projet.
   Désactivé automatiquement en production.
   ========================================= */

import { isDev, isProd } from './env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: number;
  module?: string;
}

// Buffer pour analytics (optionnel)
const logBuffer: LogEntry[] = [];
const MAX_BUFFER_SIZE = 1000;

function formatMessage(module: string | undefined, message: string): string {
  const prefix = module ? `[CHE·NU:${module}]` : '[CHE·NU]';
  return `${prefix} ${message}`;
}

function createLogEntry(
  level: LogLevel,
  message: string,
  data?: unknown,
  module?: string
): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: Date.now(),
    module,
  };
}

function bufferLog(entry: LogEntry): void {
  logBuffer.push(entry);
  if (logBuffer.length > MAX_BUFFER_SIZE) {
    logBuffer.shift();
  }
}

// === LOGGER PRINCIPAL ===

export const logger = {
  debug(message: string, data?: unknown, module?: string): void {
    if (!isDev) return;
    const entry = createLogEntry('debug', message, data, module);
    bufferLog(entry);
    console.debug(formatMessage(module, message), data ?? '');
  },

  info(message: string, data?: unknown, module?: string): void {
    if (!isDev) return;
    const entry = createLogEntry('info', message, data, module);
    bufferLog(entry);
    console.info(formatMessage(module, message), data ?? '');
  },

  warn(message: string, data?: unknown, module?: string): void {
    const entry = createLogEntry('warn', message, data, module);
    bufferLog(entry);
    console.warn(formatMessage(module, message), data ?? '');
  },

  error(message: string, error?: unknown, module?: string): void {
    const entry = createLogEntry('error', message, error, module);
    bufferLog(entry);
    console.error(formatMessage(module, message), error ?? '');
    
    // En prod, envoyer à un service de monitoring
    if (isProd) {
      // TODO: Intégrer Sentry ou similaire
      // sendToMonitoring(entry);
    }
  },

  // Créer un logger scopé pour un module
  scope(module: string) {
    return {
      debug: (msg: string, data?: unknown) => logger.debug(msg, data, module),
      info: (msg: string, data?: unknown) => logger.info(msg, data, module),
      warn: (msg: string, data?: unknown) => logger.warn(msg, data, module),
      error: (msg: string, err?: unknown) => logger.error(msg, err, module),
    };
  },

  // Récupérer le buffer (pour debug/export)
  getBuffer(): readonly LogEntry[] {
    return [...logBuffer];
  },

  // Vider le buffer
  clearBuffer(): void {
    logBuffer.length = 0;
  },
};

// === LOGGERS SCOPÉS PRÉ-DÉFINIS ===

export const presetLogger = logger.scope('Preset');
export const xrLogger = logger.scope('XR');
export const agentLogger = logger.scope('Agent');
export const meetingLogger = logger.scope('Meeting');
export const timelineLogger = logger.scope('Timeline');

// === USAGE ===
/*
import { logger, presetLogger } from '@/utils/logger';

// Logger général
logger.info('Application started');
logger.error('Something failed', error);

// Logger scopé
presetLogger.info('Preset changed', { from: 'focus', to: 'exploration' });
xrLogger.debug('Aura updated', { color: '#8E44AD' });
*/
```

---

### 2.2 Script de Remplacement console.log

**Créer**: `scripts/replace-console-logs.sh`

```bash
#!/bin/bash
# FICHIER À CRÉER: scripts/replace-console-logs.sh

# =========================================
# CHE·NU — Replace console.log with logger
# =========================================

echo "🔄 Replacing console.log statements..."

# Pattern de remplacement
find src -name "*.ts" -o -name "*.tsx" | while read file; do
  # Ajouter import si nécessaire
  if grep -q "console\." "$file"; then
    echo "  Processing: $file"
    
    # Compter les occurrences
    count=$(grep -c "console\." "$file" || true)
    echo "    Found $count console statements"
  fi
done

echo ""
echo "📋 Manual replacement guide:"
echo "  console.log(...)   → logger.info(...)"
echo "  console.warn(...)  → logger.warn(...)"
echo "  console.error(...) → logger.error(...)"
echo "  console.debug(...) → logger.debug(...)"
echo ""
echo "⚠️  Add import at top of file:"
echo "  import { logger } from '@/utils/logger';"
```

---

### 2.3 Éliminer Types `any`

**Créer**: `src/types/common.ts`

```typescript
// FICHIER À CRÉER: src/types/common.ts

/* =========================================
   CHE·NU — Common Type Definitions
   
   Types réutilisables pour remplacer `any`
   ========================================= */

// === GENERIC TYPES ===

/** Record générique typé */
export type TypedRecord<K extends string, V> = Record<K, V>;

/** Fonction async générique */
export type AsyncFunction<T = void> = () => Promise<T>;

/** Callback générique */
export type Callback<T = void> = (value: T) => void;

/** Résultat d'opération */
export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

// === API TYPES ===

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// === EVENT TYPES ===

export interface BaseEvent {
  type: string;
  timestamp: number;
  source?: string;
}

export interface CustomEvent<T = unknown> extends BaseEvent {
  payload: T;
}

// === COMPONENT TYPES ===

export interface BaseProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export interface WithId {
  id: string;
}

export interface WithTimestamps {
  createdAt: number;
  updatedAt: number;
}

// === UTILITY TYPES ===

/** Rend certaines propriétés optionnelles */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Rend certaines propriétés requises */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Extrait les clés de type string */
export type StringKeys<T> = Extract<keyof T, string>;

/** Deep Partial */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Non Nullable */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
```

---

### 2.4 Wrapper Async avec Gestion Erreurs

**Créer**: `src/utils/async.ts`

```typescript
// FICHIER À CRÉER: src/utils/async.ts

/* =========================================
   CHE·NU — Async Utilities
   
   Wrappers pour gestion d'erreurs async
   ========================================= */

import { logger } from './logger';
import { Result } from '@/types/common';

/**
 * Exécute une fonction async avec gestion d'erreur
 */
export async function safeAsync<T>(
  fn: () => Promise<T>,
  fallback: T,
  context?: string
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    logger.error(
      context ? `${context}: Operation failed` : 'Async operation failed',
      error
    );
    return fallback;
  }
}

/**
 * Exécute et retourne un Result
 */
export async function tryAsync<T, E = Error>(
  fn: () => Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as E };
  }
}

/**
 * Retry avec backoff exponentiel
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    context?: string;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    context = 'Retry operation',
  } = options;

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      logger.warn(`${context}: Attempt ${attempt}/${maxRetries} failed`, error);

      if (attempt < maxRetries) {
        await sleep(delay);
        delay = Math.min(delay * 2, maxDelay);
      }
    }
  }

  throw lastError;
}

/**
 * Timeout wrapper
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  return Promise.race([
    fn(),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Debounce async
 */
export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return ((...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  }) as T;
}

/**
 * Sleep utility
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Execute en parallèle avec limite de concurrence
 */
export async function parallelLimit<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < items.length; i++) {
    const promise = fn(items[i], i).then((result) => {
      results[i] = result;
    });

    executing.push(promise);

    if (executing.length >= limit) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((p) => p === promise),
        1
      );
    }
  }

  await Promise.all(executing);
  return results;
}
```

---

## 📁 PHASE 3: TESTS

### 3.1 Configuration Jest

**Créer**: `jest.config.js`

```javascript
// FICHIER À CRÉER: jest.config.js

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  
  // Module resolution
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@xr/(.*)$': '<rootDir>/src/xr/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
  },
  
  // Setup
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  
  // Coverage
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  
  // Transform
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  
  // Ignore
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
};
```

**Créer**: `src/test/setup.ts`

```typescript
// FICHIER À CRÉER: src/test/setup.ts

import '@testing-library/jest-dom';

// Mock des APIs navigateur
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Suppress console in tests (optional)
// global.console = {
//   ...console,
//   log: jest.fn(),
//   debug: jest.fn(),
//   info: jest.fn(),
// };
```

---

### 3.2 Tests Core Preset

**Créer**: `src/core/preset/__tests__/preset.test.ts`

```typescript
// FICHIER À CRÉER: src/core/preset/__tests__/preset.test.ts

import {
  PresetTimeline,
  addPresetChange,
  recordPreset,
  currentPreset,
  clearTimeline,
  presetAt,
  transitions,
  presetMetrics,
  topPresets,
  sourceCount,
} from '../index';

describe('CHE·NU Preset System', () => {
  beforeEach(() => {
    clearTimeline();
  });

  describe('Timeline', () => {
    it('should start empty', () => {
      expect(PresetTimeline).toHaveLength(0);
      expect(currentPreset()).toBeUndefined();
    });

    it('should record preset changes', () => {
      const change = recordPreset('focus', 'manual');
      
      expect(PresetTimeline).toHaveLength(1);
      expect(change.p).toBe('focus');
      expect(change.s).toBe('manual');
      expect(change.t).toBeLessThanOrEqual(Date.now());
    });

    it('should track current preset', () => {
      recordPreset('focus', 'manual');
      expect(currentPreset()).toBe('focus');
      
      recordPreset('exploration', 'phase');
      expect(currentPreset()).toBe('exploration');
    });

    it('should clear timeline', () => {
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      
      clearTimeline();
      
      expect(PresetTimeline).toHaveLength(0);
      expect(currentPreset()).toBeUndefined();
    });
  });

  describe('Replay', () => {
    it('should find preset at specific time', () => {
      const t1 = Date.now();
      addPresetChange({ t: t1, p: 'focus', s: 'manual' });
      
      const t2 = t1 + 1000;
      addPresetChange({ t: t2, p: 'exploration', s: 'phase' });
      
      expect(presetAt(t1)?.p).toBe('focus');
      expect(presetAt(t2)?.p).toBe('exploration');
      expect(presetAt(t1 + 500)?.p).toBe('focus');
    });

    it('should return undefined for time before first change', () => {
      addPresetChange({ t: Date.now(), p: 'focus', s: 'manual' });
      
      expect(presetAt(0)).toBeUndefined();
    });

    it('should calculate transitions', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 2000, p: 'exploration', s: 'phase' });
      addPresetChange({ t: 3000, p: 'audit', s: 'role' });
      
      const trans = transitions();
      
      expect(trans).toHaveLength(2);
      expect(trans[0]).toEqual({ from: 'focus', to: 'exploration', at: 2000 });
      expect(trans[1]).toEqual({ from: 'exploration', to: 'audit', at: 3000 });
    });
  });

  describe('Metrics', () => {
    it('should compute preset metrics', () => {
      addPresetChange({ t: 1000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 3000, p: 'exploration', s: 'phase' });
      addPresetChange({ t: 4000, p: 'focus', s: 'manual' });
      addPresetChange({ t: 6000, p: 'audit', s: 'role' });
      
      const metrics = presetMetrics();
      
      expect(metrics.focus.count).toBe(2);
      expect(metrics.focus.durationMs).toBe(4000); // 2000 + 2000
      expect(metrics.exploration.count).toBe(1);
      expect(metrics.exploration.durationMs).toBe(1000);
    });

    it('should return top presets by count', () => {
      recordPreset('focus', 'manual');
      recordPreset('focus', 'manual');
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      recordPreset('audit', 'role');
      
      const top = topPresets(2);
      
      expect(top[0]).toBe('focus');
      expect(top).toHaveLength(2);
    });

    it('should count by source', () => {
      recordPreset('focus', 'manual');
      recordPreset('focus', 'manual');
      recordPreset('exploration', 'phase');
      recordPreset('audit', 'role');
      recordPreset('meeting', 'agent');
      
      const counts = sourceCount();
      
      expect(counts.manual).toBe(2);
      expect(counts.phase).toBe(1);
      expect(counts.role).toBe(1);
      expect(counts.agent).toBe(1);
      expect(counts.project).toBe(0);
      expect(counts.sphere).toBe(0);
    });
  });

  describe('Laws', () => {
    it('should never auto-apply presets', () => {
      // Every change must have explicit source
      const change = recordPreset('focus', 'manual');
      expect(change.s).toBeDefined();
      expect(['manual', 'role', 'phase', 'project', 'sphere', 'agent'])
        .toContain(change.s);
    });

    it('should maintain timeline immutability', () => {
      recordPreset('focus', 'manual');
      const length = PresetTimeline.length;
      
      // Timeline should only grow, never shrink (except clear)
      recordPreset('exploration', 'phase');
      expect(PresetTimeline.length).toBe(length + 1);
    });
  });
});
```

---

### 3.3 Tests Logger

**Créer**: `src/utils/__tests__/logger.test.ts`

```typescript
// FICHIER À CRÉER: src/utils/__tests__/logger.test.ts

import { logger } from '../logger';

describe('Logger', () => {
  beforeEach(() => {
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
    logger.clearBuffer();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should log with correct prefix', () => {
    logger.info('Test message');
    expect(console.info).toHaveBeenCalledWith(
      '[CHE·NU] Test message',
      ''
    );
  });

  it('should log with module scope', () => {
    logger.info('Test', undefined, 'Preset');
    expect(console.info).toHaveBeenCalledWith(
      '[CHE·NU:Preset] Test',
      ''
    );
  });

  it('should create scoped logger', () => {
    const scopedLogger = logger.scope('XR');
    scopedLogger.info('Test');
    expect(console.info).toHaveBeenCalledWith(
      '[CHE·NU:XR] Test',
      ''
    );
  });

  it('should buffer logs', () => {
    logger.info('Message 1');
    logger.warn('Message 2');
    
    const buffer = logger.getBuffer();
    expect(buffer).toHaveLength(2);
    expect(buffer[0].message).toBe('Message 1');
    expect(buffer[1].level).toBe('warn');
  });

  it('should clear buffer', () => {
    logger.info('Test');
    expect(logger.getBuffer()).toHaveLength(1);
    
    logger.clearBuffer();
    expect(logger.getBuffer()).toHaveLength(0);
  });
});
```

---

## 📁 PHASE 4: POLISH

### 4.1 Résoudre TODOs

| TODO | Fichier | Solution |
|------|---------|----------|
| Hand tracking pinch | `XRInteractions.tsx` | Implémenter ou marquer "v2" |
| deep_ocean theme | `themeEngine.ts` | Créer thème |
| midnight theme | `themeEngine.ts` | Créer thème |
| high_contrast theme | `themeEngine.ts` | Créer thème |

### 4.2 Thèmes Manquants

**Créer**: `src/core/theme/themes/deep_ocean.ts`

```typescript
// FICHIER À CRÉER: src/core/theme/themes/deep_ocean.ts

import { Theme } from '../theme.types';

export const deepOceanTheme: Theme = {
  id: 'deep_ocean',
  name: 'Deep Ocean',
  colors: {
    primary: '#0077be',
    secondary: '#00a8e8',
    background: '#001f3f',
    surface: '#003366',
    text: '#e0f7ff',
    textSecondary: '#80d4ff',
    accent: '#00ffcc',
    error: '#ff6b6b',
    warning: '#ffd93d',
    success: '#00e676',
  },
  spheres: {
    personal: '#00bcd4',
    business: '#0288d1',
    creative: '#26c6da',
    social: '#4dd0e1',
    scholar: '#00acc1',
    methodology: '#0097a7',
    institutions: '#00838f',
    xr: '#006064',
    governance: '#004d40',
  },
};
```

---

## 📋 CHECKLIST FINALE

### Phase 1 ✅
- [ ] Créer `src/core/preset/types.ts`
- [ ] Créer `src/core/preset/index.ts`
- [ ] Créer `src/core/index.ts`
- [ ] Créer `src/ui/index.ts`
- [ ] Créer `.env.example`
- [ ] Mettre à jour `.gitignore`
- [ ] Créer `src/utils/env.ts`

### Phase 2 ✅
- [ ] Créer `src/utils/logger.ts`
- [ ] Créer `src/types/common.ts`
- [ ] Créer `src/utils/async.ts`
- [ ] Remplacer tous les `console.log`
- [ ] Éliminer tous les types `any`

### Phase 3 ✅
- [ ] Créer `jest.config.js`
- [ ] Créer `src/test/setup.ts`
- [ ] Créer tests preset
- [ ] Créer tests logger
- [ ] Coverage > 70%

### Phase 4 ✅
- [ ] Créer thèmes manquants
- [ ] Résoudre TODOs
- [ ] Documentation API
- [ ] Audit final

---

## 🎯 RÉSULTAT ATTENDU

```
┌─────────────────────────────────────────┐
│ SCORE APRÈS AMÉLIORATION                │
├─────────────────────────────────────────┤
│ Architecture:      9/10  (+1)           │
│ Documentation:    10/10  (+1)           │
│ Qualité Code:      9/10  (+2)           │
│ Sécurité:          9/10  (+3)           │
│ Maintenabilité:    9/10  (+3)           │
│ Tests:             8/10  (+4)           │
├─────────────────────────────────────────┤
│ TOTAL:             9/10  (+2.3)         │
└─────────────────────────────────────────┘
```

---

*Plan créé le 8 décembre 2025*
*CHE·NU Quality Improvement v1.0*
