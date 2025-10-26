import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface UpdateEmpresaData {
  tipoPessoa?: string;
  razaoSocial?: string;
  nome?: string;
  nomeFantasia?: string;
  cnpj?: string;
  cpf?: string;
  identificadorEstrangeiro?: string;
  perfil?: string;
  faturamentoDireto?: boolean;
  documentoObrigatorio?: string;
  documentosOpcionais?: string[];
}

export function useUpdateEmpresa() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateEmpresaData }) => {
      const response = await api.put(`/empresas/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success('Empresa atualizada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Erro ao atualizar empresa';
      toast.error(message);
      console.error('Erro ao atualizar empresa:', error);
    },
  });
}