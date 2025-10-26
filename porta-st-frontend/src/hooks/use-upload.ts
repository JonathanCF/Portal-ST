import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/upload.service';
import { toast } from 'sonner';

export function useUploadFile() {
  return useMutation({
    mutationFn: (file: File) => uploadService.uploadFile(file),
    onSuccess: (data) => {
      console.log('✅ Upload realizado:', data);
    },
    onError: (error: any) => {
      console.error('❌ Erro no upload:', error);
      toast.error(error.response?.data?.message || 'Erro ao fazer upload do arquivo');
    },
  });
}