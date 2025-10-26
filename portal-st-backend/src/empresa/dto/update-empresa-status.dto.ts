import { IsIn, IsOptional, IsString, IsInt } from 'class-validator';

export class UpdateEmpresaStatusDto {
  @IsIn(['PENDENTE', 'APROVADA', 'REPROVADA'])
  status: string;

  @IsOptional()
  @IsString()
  motivoReprovacao?: string;

  @IsOptional()
  @IsInt()
  responsavelId?: number;
}