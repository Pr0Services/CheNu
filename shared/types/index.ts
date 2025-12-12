/**
 * Shared TypeScript types
 */
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Sphere {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface Agent {
  id: string;
  name: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  sphere?: string;
}
