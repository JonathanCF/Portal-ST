'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Usuario } from '@/types';

interface AuthState {
  user: Usuario | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: Usuario, token: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        console.log('🔐 Salvando autenticação:', { user, token });
        
        // Atualiza o estado do Zustand
        set({ 
          user, 
          token, 
          isAuthenticated: true 
        });
        
        // Salva MANUALMENTE no localStorage (garantia dupla)
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('isAuthenticated', 'true');
            console.log('✅ Salvo no localStorage');
            
            // Verifica se salvou
            const savedToken = localStorage.getItem('token');
            console.log('🔍 Verificando localStorage:', { savedToken });
          } catch (error) {
            console.error('❌ Erro ao salvar no localStorage:', error);
          }
        }
      },

      logout: () => {
        console.log('🚪 Fazendo logout');
        
        set({ user: null, token: null, isAuthenticated: false });
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('auth-storage');
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);