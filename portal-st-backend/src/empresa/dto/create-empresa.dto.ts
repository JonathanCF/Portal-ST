import { IsString, IsBoolean, IsOptional, MinLength, Matches, ValidateIf, IsIn, IsArray } from 'class-validator';

export class CreateEmpresaDto {
  @IsIn(['JURIDICA', 'FISICA', 'ESTRANGEIRA'], { message: 'Tipo de pessoa inválido' })
  tipoPessoa: string;

  @ValidateIf(o => o.tipoPessoa === 'JURIDICA' || o.tipoPessoa === 'ESTRANGEIRA')
  @IsString()
  @MinLength(3, { message: 'Mínimo de 3 caracteres' })
  razaoSocial?: string;

  @ValidateIf(o => o.tipoPessoa === 'FISICA')
  @IsString()
  @MinLength(3, { message: 'Mínimo de 3 caracteres' })
  nome?: string;

  @IsString()
  @MinLength(3, { message: 'Mínimo de 3 caracteres' })
  nomeFantasia: string;

  @ValidateIf(o => o.tipoPessoa === 'JURIDICA')
  @IsString()
  @Matches(/^\d{14}$/, { message: 'CNPJ inválido' })
  cnpj?: string;

  @ValidateIf(o => o.tipoPessoa === 'FISICA')
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF inválido' })
  cpf?: string;

  @ValidateIf(o => o.tipoPessoa === 'ESTRANGEIRA')
  @IsString()
  @MinLength(3, { message: 'Mínimo de 3 caracteres' })
  identificadorEstrangeiro?: string;

  @IsIn(['DESPACHANTE', 'BENEFICIARIO', 'CONSIGNATARIO', 'ARMADOR', 'AGENTE_CARGA', 'TRANSPORTADORA'], 
    { message: 'Selecione um perfil para a empresa' })
  perfil: string;

  @IsBoolean()
  @IsOptional()
  faturamentoDireto?: boolean;

  @IsString()
  documentoObrigatorio: string;

  @IsOptional()
  @IsArray()
  documentosOpcionais?: string[];
}