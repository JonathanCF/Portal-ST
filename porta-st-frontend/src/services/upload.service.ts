import { api } from '@/lib/api';

export const uploadService = {
  /**
   * Faz upload de um arquivo
   * @param file - Arquivo a ser enviado
   * @returns Dados do arquivo salvo (filename, url, etc)
   */
  async uploadFile(file: File): Promise<{
    filename: string;
    originalName: string;
    size: number;
    path: string;
    url: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};