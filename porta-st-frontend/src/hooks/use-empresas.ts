import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { empresaService } from '@/services/empresa.service';
import { CreateEmpresaDto, UpdateEmpresaStatusDto, StatusEmpresa } from '@/types';
import { toast } from 'sonner';

// Hook para listar empresas
export function useEmpresas(
  status?: StatusEmpresa, 
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: ['empresas', status],
    queryFn: () => empresaService.getAll(status),
    staleTime: 1000 * 60 * 5,
    enabled: options?.enabled ?? true, // Adiciona opção enabled
  });
}

// Hook para buscar empresa por ID
export function useEmpresa(id: number) {
  return useQuery({
    queryKey: ['empresa', id],
    queryFn: () => empresaService.getById(id),
    enabled: !!id,
  });
}

// Hook para criar empresa
export function useCreateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEmpresaDto) => empresaService.create(data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success('Empresa cadastrada com sucesso!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cadastrar empresa');
    },
  });
}

// Hook para atualizar status da empresa
export function useUpdateEmpresaStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEmpresaStatusDto }) =>
      empresaService.updateStatus(id, data),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success('Status atualizado com sucesso!');
    },
    
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao atualizar status');
    },
  });
}