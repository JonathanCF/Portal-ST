export enum Permission {
  // Permissões de Empresa
  EMPRESA_CADASTRO = 'EMPRESA_CADASTRO',
  EMPRESA_LISTA = 'EMPRESA_LISTA',
  EMPRESA_EDICAO = 'EMPRESA_EDICAO',
  EMPRESA_MASTER = 'EMPRESA_MASTER',
}

// Mapeamento de permissões por tipo de usuário
export const PERMISSIONS_BY_TYPE = {
  EXTERNO: [Permission.EMPRESA_CADASTRO],
  INTERNO: [
    Permission.EMPRESA_MASTER,
    Permission.EMPRESA_LISTA,
    Permission.EMPRESA_EDICAO,
  ],
};