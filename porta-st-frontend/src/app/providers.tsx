"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import { useState } from "react";

// Componente Provider que envolve toda a aplicação
export function Providers({ children }: { children: React.ReactNode }) {
  // Cria instância do QueryClient (uma vez por sessão)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutos
            retry: 1, // Tentar novamente 1 vez em caso de erro
            refetchOnWindowFocus: false, // Não recarregar ao focar na janela
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {/* Notificações toast */}
      <Toaster position="top-right" richColors />

      {/* DevTools do React Query (só em desenvolvimento) */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
