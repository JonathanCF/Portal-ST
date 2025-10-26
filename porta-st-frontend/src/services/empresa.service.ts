import { api } from '@/lib/api';
import { Empresa, CreateEmpresaDto, UpdateEmpresaStatusDto, StatusEmpresa } from '@/types';

// Serviço de empresas
export const empresaService = {
  // Listar todas as empresas (com filtro opcional de status)
  async getAll(status?: StatusEmpresa): Promise<Empresa[]> {
    const params = status ? { status } : {};
    const response = await api.get<Empresa[]>('/empresas', { params });
    return response.data;
  },

  // Buscar empresa por ID
  async getById(id: number): Promise<Empresa> {
    const response = await api.get<Empresa>(`/empresas/${id}`);
    return response.data;
  },

  // Criar nova empresa
  async create(data: CreateEmpresaDto): Promise<Empresa> {
    const response = await api.post<Empresa>('/empresas', data);
    return response.data;
  },

  // Atualizar status da empresa (aprovar/reprovar)
  async updateStatus(id: number, data: UpdateEmpresaStatusDto): Promise<Empresa> {
    const response = await api.patch<Empresa>(`/empresas/${id}/status`, data);
    return response.data;
  },
};