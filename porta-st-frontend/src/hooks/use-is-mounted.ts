// src/hooks/use-is-mounted.ts
import { useEffect, useState } from 'react';

/**
 * Hook simples para saber quando o componente foi montado.
 * Evita erros de "hydration mismatch" em componentes client.
 */
export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
