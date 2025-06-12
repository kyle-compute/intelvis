/**
 * Shared type definitions for IntelVis application
 */

export interface User {
  id: string;
  email: string;
}

export interface Device {
  id: string;
  alias: string | null;
  status: string;
  nic: { mac: string } | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthCheckComplete: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export interface ScrollAnimationReturn<T extends HTMLElement = HTMLElement> {
  elementRef: React.RefObject<T | null>;
  isVisible: boolean;
}