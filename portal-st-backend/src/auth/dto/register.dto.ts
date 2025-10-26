import { IsEmail, IsString, MinLength, IsIn } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Nome deve ter no mínimo 3 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  senha: string;

  @IsIn(['INTERNO', 'EXTERNO'])
  tipo: string;

  @IsIn(['DESPACHANTE', 'BENEFICIARIO', 'CONSIGNATARIO', 'ARMADOR', 'AGENTE_CARGA', 'TRANSPORTADORA', 'NOVO_USUARIO', 'ADMIN'])
  perfil: string;
}