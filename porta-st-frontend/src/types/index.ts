// Tipos de Usuário
export type TipoUsuario = 'INTERNO' | 'EXTERNO';

export type PerfilUsuario = 
  | 'DESPACHANTE' 
  | 'BENEFICIARIO' 
  | 'CONSIGNATARIO' 
  | 'ARMADOR' 
  | 'AGENTE_CARGA' 
  | 'TRANSPORTADORA' 
  | 'NOVO_USUARIO' 
  | 'ADMIN';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipo: TipoUsuario;
  perfil: PerfilUsuario;
  permissoes: string[]; // ← NOVO
}

// Tipos de Empresa
export type TipoPessoa = 'JURIDICA' | 'FISICA' | 'ESTRANGEIRA';

export type PerfilEmpresa = 
  | 'DESPACHANTE' 
  | 'BENEFICIARIO' 
  | 'CONSIGNATARIO' 
  | 'ARMADOR' 
  | 'AGENTE_CARGA' 
  | 'TRANSPORTADORA';

export type StatusEmpresa = 'PENDENTE' | 'APROVADA' | 'REPROVADA';

export interface Empresa {
  id: number;
  tipoPessoa: TipoPessoa;
  razaoSocial?: string;
  nome?: string;
  nomeFantasia: string;
  identificador: string;
  identificadorEstrangeiro?: string;
  perfil: PerfilEmpresa;
  faturamentoDireto: boolean;
  documentoObrigatorio: string;
  documentosOpcionais: string;
  status: StatusEmpresa;
  motivoReprovacao?: string;
  criadoPorId: number;
  criadoPor?: Usuario;
  responsavelId?: number;
  responsavel?: Usuario;
  criadoEm: string;
  atualizadoEm: string;
  aprovadoEm?: string;
}

// DTOs de Autenticação
export interface LoginDto {
  email: string;
  senha: string;
}

export interface RegisterDto {
  nome: string;
  email: string;
  senha: string;
  tipo: TipoUsuario;
  perfil: PerfilUsuario;
}

export interface AuthResponse {
  access_token: string;
  user: Usuario;
}

// DTO de Empresa
export interface CreateEmpresaDto {
  tipoPessoa: TipoPessoa;
  razaoSocial?: string;
  nome?: string;
  nomeFantasia: string;
  cnpj?: string;
  cpf?: string;
  identificadorEstrangeiro?: string;
  perfil: PerfilEmpresa;
  faturamentoDireto?: boolean;
  documentoObrigatorio: string;
  documentosOpcionais?: string[];
}

export interface UpdateEmpresaStatusDto {
  status: StatusEmpresa;
  motivoReprovacao?: string;
  responsavelId?: number;
}