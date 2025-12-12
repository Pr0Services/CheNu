/* =========================================
   CHE·NU — COMMON TYPE DEFINITIONS
   
   Types réutilisables pour éliminer `any`.
   Importer depuis '@/types/common'
   ========================================= */

import type { ReactNode, CSSProperties } from 'react';

// ============================================
// GENERIC UTILITIES
// ============================================

/** Record générique typé */
export type TypedRecord<K extends string, V> = Record<K, V>;

/** Objet avec clés string et valeurs unknown */
export type AnyObject = Record<string, unknown>;

/** Fonction générique */
export type AnyFunction = (...args: unknown[]) => unknown;

/** Fonction async générique */
export type AsyncFunction<T = void> = () => Promise<T>;

/** Callback générique */
export type Callback<T = void> = (value: T) => void;

/** Nullable type */
export type Nullable<T> = T | null;

/** Optional type */
export type Optional<T> = T | undefined;

/** Maybe type (null ou undefined) */
export type Maybe<T> = T | null | undefined;

// ============================================
// RESULT / ERROR HANDLING
// ============================================

/** Résultat d'opération (Either pattern) */
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

/** Résultat async */
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

/** Erreur API standardisée */
export interface ApiError {
  code: string;
  message: string;
  details?: AnyObject;
  statusCode?: number;
}

/** Créer un Result success */
export function ok<T>(data: T): Result<T, never> {
  return { success: true, data };
}

/** Créer un Result error */
export function err<E>(error: E): Result<never, E> {
  return { success: false, error };
}

// ============================================
// API TYPES
// ============================================

/** Réponse API standardisée */
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
  timestamp?: number;
}

/** Réponse paginée */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  nextCursor?: string;
}

/** Paramètres de pagination */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

/** Paramètres de tri */
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Paramètres de filtre */
export interface FilterParams {
  search?: string;
  filters?: TypedRecord<string, string | number | boolean>;
}

/** Query params combinés */
export type QueryParams = PaginationParams & SortParams & FilterParams;

// ============================================
// EVENT TYPES
// ============================================

/** Événement de base */
export interface BaseEvent {
  type: string;
  timestamp: number;
  source?: string;
}

/** Événement avec payload typé */
export interface TypedEvent<T = unknown> extends BaseEvent {
  payload: T;
}

/** Handler d'événement */
export type EventHandler<T = unknown> = (event: TypedEvent<T>) => void;

/** Unsubscribe function */
export type Unsubscribe = () => void;

// ============================================
// COMPONENT TYPES
// ============================================

/** Props de base pour composants */
export interface BaseProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

/** Props avec ref */
export interface WithRef<T> {
  ref?: React.Ref<T>;
}

/** Entité avec ID */
export interface WithId {
  id: string;
}

/** Entité avec timestamps */
export interface WithTimestamps {
  createdAt: number;
  updatedAt: number;
}

/** Entité avec métadonnées */
export interface WithMetadata {
  metadata?: AnyObject;
}

/** Entité complète */
export type Entity = WithId & WithTimestamps & WithMetadata;

// ============================================
// STATE TYPES
// ============================================

/** État de chargement */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** État avec données */
export interface DataState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

/** Action de reducer */
export interface Action<T = string, P = unknown> {
  type: T;
  payload?: P;
}

// ============================================
// UTILITY TYPES
// ============================================

/** Rend certaines propriétés optionnelles */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Rend certaines propriétés requises */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

/** Extrait les clés de type string */
export type StringKeys<T> = Extract<keyof T, string>;

/** Extrait les clés de type number */
export type NumberKeys<T> = Extract<keyof T, number>;

/** Deep Partial - toutes les propriétés optionnelles récursivement */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** Deep Required - toutes les propriétés requises récursivement */
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

/** Deep Readonly */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/** Non Nullable pour toutes les propriétés */
export type NonNullableFields<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/** Exclure les propriétés d'un certain type */
export type OmitByType<T, U> = {
  [P in keyof T as T[P] extends U ? never : P]: T[P];
};

/** Garder seulement les propriétés d'un certain type */
export type PickByType<T, U> = {
  [P in keyof T as T[P] extends U ? P : never]: T[P];
};

/** Valeur ou fonction retournant la valeur */
export type ValueOrGetter<T> = T | (() => T);

/** Promesse ou valeur directe */
export type MaybePromise<T> = T | Promise<T>;

// ============================================
// VALIDATION
// ============================================

/** Résultat de validation */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/** Erreur de validation */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/** Fonction de validation */
export type Validator<T> = (value: T) => ValidationResult;

// ============================================
// JSON TYPES (safe alternatives to any)
// ============================================

/** Valeur JSON primitive */
export type JsonPrimitive = string | number | boolean | null;

/** Valeur JSON */
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/** Objet JSON */
export type JsonObject = { [key: string]: JsonValue };

/** Tableau JSON */
export type JsonArray = JsonValue[];

// ============================================
// BRAND TYPES (nominal typing)
// ============================================

/** Type branded pour éviter les mélanges */
export type Brand<T, B> = T & { __brand: B };

/** ID utilisateur */
export type UserId = Brand<string, 'UserId'>;

/** ID preset */
export type PresetId = Brand<string, 'PresetId'>;

/** ID agent */
export type AgentId = Brand<string, 'AgentId'>;

/** ID sphère */
export type SphereId = Brand<string, 'SphereId'>;

/** Timestamp en millisecondes */
export type Timestamp = Brand<number, 'Timestamp'>;

// ============================================
// HELPERS
// ============================================

/** Type guard pour vérifier si une valeur est définie */
export function isDefined<T>(value: T | undefined | null): value is T {
  return value !== undefined && value !== null;
}

/** Type guard pour vérifier si c'est un objet */
export function isObject(value: unknown): value is AnyObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Type guard pour vérifier si c'est une fonction */
export function isFunction(value: unknown): value is AnyFunction {
  return typeof value === 'function';
}

/** Type guard pour vérifier si c'est une promesse */
export function isPromise<T>(value: unknown): value is Promise<T> {
  return value instanceof Promise;
}

/** Assertion de type */
export function assertDefined<T>(
  value: T | undefined | null,
  message = 'Value is not defined'
): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(message);
  }
}
