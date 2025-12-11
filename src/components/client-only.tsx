import { useSyncExternalStore, type ReactNode } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Simple store to track if we're on the client
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Wrapper component that only renders children on the client-side.
 * Use this for components that use browser-only APIs or hooks that fail during SSR.
 * Uses useSyncExternalStore for proper hydration support.
 */
export function ClientOnly({ children, fallback = null }: ClientOnlyProps) {
  const isClient = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isClient) {
    return fallback;
  }

  return children;
}
