import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PERMISSIONS_BY_TYPE } from './permissions.enum';
import { PerfilUsuario, TipoUsuario } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    console.log('🔍 Verificando se email já existe:', registerDto.email);
    
    const userExists = await this.prisma.usuario.findUnique({
      where: { email: registerDto.email },
    });

    if (userExists) {
      throw new ConflictException('Email já cadastrado');
    }

    console.log('🔐 Criando hash da senha');
    const hashedPassword = await bcrypt.hash(registerDto.senha, 10);

    // ⭐ DEFINIR PERMISSÕES BASEADO NO TIPO
    const permissoes = PERMISSIONS_BY_TYPE[registerDto.tipo].join(',');
    console.log('🔑 Permissões atribuídas:', permissoes);

    console.log('💾 Criando usuário no banco');
    const user = await this.prisma.usuario.create({
      data: {
        nome: registerDto.nome,
        email: registerDto.email,
        senha: hashedPassword,
        tipo: registerDto.tipo as TipoUsuario,
        perfil: registerDto.perfil as PerfilUsuario,
        permissoes, // ← NOVO
      },
    });

    const { senha, ...result } = user;
    console.log('✅ Usuário criado:', result.email);
    return result;
  }

  async login(loginDto: LoginDto) {
    console.log('🔍 Buscando usuário:', loginDto.email);
    
    const user = await this.prisma.usuario.findUnique({
      where: { email: loginDto.email },
    });

    if (!user || !user.ativo) {
      console.log('❌ Usuário não encontrado ou inativo');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log('🔐 Verificando senha');
    const isPasswordValid = await bcrypt.compare(loginDto.senha, user.senha);
    
    if (!isPasswordValid) {
      console.log('❌ Senha incorreta');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log('🎫 Gerando token JWT');
    const payload = { 
      email: user.email, 
      sub: user.id,
      tipo: user.tipo,
      perfil: user.perfil,
      permissoes: user.permissoes, // ← INCLUIR NO TOKEN
    };

    const access_token = this.jwtService.sign(payload);

    console.log('✅ Login bem-sucedido:', user.email);
    
    return {
      access_token,
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        perfil: user.perfil,
        permissoes: user.permissoes.split(','), // ← RETORNAR COMO ARRAY
      },
    };
  }
}