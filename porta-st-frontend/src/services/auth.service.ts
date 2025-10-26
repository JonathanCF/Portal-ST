import { api } from '@/lib/api';
import { LoginDto, RegisterDto, AuthResponse } from '@/types';

// Serviço de autenticação
export const authService = {
  // Função de login
  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  // Função de registro
  async register(data: RegisterDto): Promise<{ id: number; nome: string; email: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
};