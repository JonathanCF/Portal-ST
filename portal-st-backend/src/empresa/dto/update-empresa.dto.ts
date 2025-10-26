import { IsString, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { TipoPessoa, PerfilEmpresa } from '@prisma/client';

export class UpdateEmpresaDto {
  @IsEnum(TipoPessoa)
  @IsOptional()
  tipoPessoa?: TipoPessoa;

  @IsString()
  @IsOptional()
  razaoSocial?: string;

  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  nomeFantasia?: string;

  @IsString()
  @IsOptional()
  cnpj?: string;

  @IsString()
  @IsOptional()
  cpf?: string;

  @IsString()
  @IsOptional()
  identificadorEstrangeiro?: string;

  @IsEnum(PerfilEmpresa)
  @IsOptional()
  perfil?: PerfilEmpresa;

  @IsBoolean()
  @IsOptional()
  faturamentoDireto?: boolean;

  @IsString()
  @IsOptional()
  documentoObrigatorio?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documentosOpcionais?: string[];
}