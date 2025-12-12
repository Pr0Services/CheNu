/* =========================================
   CHE·NU — ASYNC UTILITIES
   
   Wrappers et helpers pour gestion d'erreurs async.
   
   Usage:
   import { safeAsync, tryAsync, retryAsync } from '@/utils/async';
   
   const data = await safeAsync(() => fetchData(), defaultValue);
   const result = await tryAsync(() => riskyOperation());
   ========================================= */

import { logger } from './logger';

// === TYPES ===

export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export type AsyncFunction<T = void> = () => Promise<T>;

export interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
  context?: string;
  shouldRetry?: (error: unknown, attempt: number) => boolean;
}

// === SAFE ASYNC ===

/**
 * Exécute une fonction async avec fallback en cas d'erreur
 */
export async function safeAsync<T>(
  fn: AsyncFunction<T>,
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
 * Exécute une fonction async et retourne un Result
 */
export async function tryAsync<T, E = Error>(
  fn: AsyncFunction<T>
): Promise<Result<T, E>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as E };
  }
}

/**
 * Wrapper pour les fonctions qui peuvent retourner undefined
 */
export async function safeAsyncOptional<T>(
  fn: AsyncFunction<T | undefined>,
  context?: string
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    logger.warn(
      context ? `${context}: Optional operation failed` : 'Optional async failed',
      error
    );
    return undefined;
  }
}

// === RETRY ===

/**
 * Retry avec backoff exponentiel
 */
export async function retryAsync<T>(
  fn: AsyncFunction<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    context = 'Retry operation',
    shouldRetry = () => true,
  } = options;

  let lastError: Error | undefined;
  let delay = initialDelay;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      logger.warn(
        `${context}: Attempt ${attempt}/${maxRetries} failed`,
        { error: lastError.message, nextDelay: delay }
      );

      if (attempt < maxRetries && shouldRetry(error, attempt)) {
        await sleep(delay);
        delay = Math.min(delay * backoffFactor, maxDelay);
      }
    }
  }

  logger.error(`${context}: All ${maxRetries} attempts failed`, lastError);
  throw lastError;
}

// === TIMEOUT ===

/**
 * Wrapper avec timeout
 */
export async function withTimeout<T>(
  fn: AsyncFunction<T>,
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
 * Wrapper avec timeout et fallback
 */
export async function withTimeoutFallback<T>(
  fn: AsyncFunction<T>,
  timeoutMs: number,
  fallback: T
): Promise<T> {
  try {
    return await withTimeout(fn, timeoutMs);
  } catch {
    return fallback;
  }
}

// === DEBOUNCE / THROTTLE ===

/**
 * Debounce async - seul le dernier appel est exécuté
 */
export function debounceAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  delay: number
): T {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let pendingReject: ((reason?: unknown) => void) | null = null;

  return ((...args: Parameters<T>) => {
    return new Promise((resolve, reject) => {
      // Rejeter la promesse précédente si elle existe
      if (pendingReject) {
        pendingReject(new Error('Debounced'));
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      pendingReject = reject;

      timeoutId = setTimeout(async () => {
        pendingReject = null;
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
 * Throttle async - limite la fréquence d'exécution
 */
export function throttleAsync<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  limit: number
): T {
  let lastRun = 0;
  let pendingPromise: Promise<unknown> | null = null;

  return ((...args: Parameters<T>) => {
    const now = Date.now();

    if (now - lastRun >= limit) {
      lastRun = now;
      pendingPromise = fn(...args);
      return pendingPromise;
    }

    // Retourner la promesse en cours si elle existe
    if (pendingPromise) {
      return pendingPromise;
    }

    // Planifier pour la prochaine fenêtre
    return new Promise((resolve, reject) => {
      const waitTime = limit - (now - lastRun);
      setTimeout(async () => {
        lastRun = Date.now();
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, waitTime);
    });
  }) as T;
}

// === PARALLEL ===

/**
 * Exécution parallèle avec limite de concurrence
 */
export async function parallelLimit<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  limit: number
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  const executing: Set<Promise<void>> = new Set();

  for (let i = 0; i < items.length; i++) {
    const promise = (async () => {
      results[i] = await fn(items[i], i);
    })();

    executing.add(promise);
    promise.finally(() => executing.delete(promise));

    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }

  await Promise.all(executing);
  return results;
}

/**
 * Map parallèle avec gestion d'erreur par item
 */
export async function parallelMap<T, R>(
  items: T[],
  fn: (item: T, index: number) => Promise<R>,
  options: { limit?: number; continueOnError?: boolean } = {}
): Promise<Result<R, Error>[]> {
  const { limit = items.length, continueOnError = true } = options;
  const results: Result<R, Error>[] = [];
  
  await parallelLimit(
    items,
    async (item, index) => {
      try {
        const data = await fn(item, index);
        results[index] = { success: true, data };
      } catch (error) {
        results[index] = { success: false, error: error as Error };
        if (!continueOnError) {
          throw error;
        }
      }
    },
    limit
  );
  
  return results;
}

// === UTILITIES ===

/**
 * Sleep / delay
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Attendre qu'une condition soit vraie
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 100 } = options;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    if (await condition()) {
      return;
    }
    await sleep(interval);
  }

  throw new Error('waitFor timeout');
}

/**
 * Exécuter une fonction après un délai
 */
export function delay<T>(fn: () => T, ms: number): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), ms);
  });
}

/**
 * Créer une promesse avec résolution externe
 */
export function deferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason?: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}

// === QUEUE ===

/**
 * File d'attente async avec exécution séquentielle
 */
export class AsyncQueue {
  private queue: (() => Promise<void>)[] = [];
  private running = false;

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });

      this.process();
    });
  }

  private async process(): Promise<void> {
    if (this.running) return;
    this.running = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        await task();
      }
    }

    this.running = false;
  }

  get size(): number {
    return this.queue.length;
  }

  get isRunning(): boolean {
    return this.running;
  }
}
