import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Prisma, StatusEmpresa, TipoPessoa, PerfilEmpresa } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateEmpresaStatusDto } from './dto/update-empresa-status.dto';

@Injectable()
export class EmpresaService {
  constructor(private prisma: PrismaService) {}

  async create(createEmpresaDto: CreateEmpresaDto, userId: number) {
    const identificador = this.getIdentificador(createEmpresaDto);

    const empresaExistente = await this.prisma.empresa.findUnique({
      where: { identificador },
    });

    if (empresaExistente) {
      throw new ConflictException('Empresa já cadastrada');
    }

    if (
      createEmpresaDto.documentosOpcionais?.includes(
        createEmpresaDto.documentoObrigatorio,
      )
    ) {
      throw new BadRequestException('Arquivo duplicado');
    }

    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // RN01: Usuário interno aprova automaticamente
    const status: StatusEmpresa =
      usuario.tipo === 'INTERNO' ? StatusEmpresa.APROVADA : StatusEmpresa.PENDENTE;

    return this.prisma.empresa.create({
      data: {
        tipoPessoa: createEmpresaDto.tipoPessoa as TipoPessoa,
        razaoSocial: createEmpresaDto.razaoSocial,
        nome: createEmpresaDto.nome,
        nomeFantasia: createEmpresaDto.nomeFantasia,
        identificador,
        identificadorEstrangeiro: createEmpresaDto.identificadorEstrangeiro,
        perfil: createEmpresaDto.perfil as PerfilEmpresa,
        faturamentoDireto: createEmpresaDto.faturamentoDireto || false,
        documentoObrigatorio: createEmpresaDto.documentoObrigatorio,
        documentosOpcionais: createEmpresaDto.documentosOpcionais?.join(',') || '',
        status,
        criadoPorId: userId,
        aprovadoEm: status === StatusEmpresa.APROVADA ? new Date() : null,
      },
    });
  }

  async findAll(userId: number, statusFilter?: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    let where: Prisma.EmpresaWhereInput = {};

    if (statusFilter && Object.values(StatusEmpresa).includes(statusFilter as StatusEmpresa)) {
      where.status = statusFilter as StatusEmpresa;
    }

    if (usuario?.tipo !== 'INTERNO') {
      where.criadoPorId = userId;
    }

    return this.prisma.empresa.findMany({
      where,
      include: {
        criadoPor: {
          select: { id: true, nome: true, email: true, tipo: true },
        },
        responsavel: {
          select: { id: true, nome: true, email: true },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      include: {
        criadoPor: true,
        responsavel: true,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    if (usuario?.tipo === 'EXTERNO' && empresa.criadoPorId !== userId) {
      throw new BadRequestException('Sem permissão para visualizar esta empresa');
    }

    return empresa;
  }

  async update(id: number, updateEmpresaDto: UpdateEmpresaDto, userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    // Verificação de permissão: apenas criador externo ou usuário interno
    if (usuario.tipo === 'EXTERNO' && empresa.criadoPorId !== userId) {
      throw new BadRequestException('Sem permissão para editar esta empresa');
    }

    // Empresas aprovadas ou reprovadas não podem ser editadas
    if (empresa.status === StatusEmpresa.APROVADA || empresa.status === StatusEmpresa.REPROVADA) {
      throw new BadRequestException('Empresas aprovadas ou reprovadas não podem ser editadas');
    }

    // Validar arquivo duplicado se ambos forem fornecidos
    if (
      updateEmpresaDto.documentoObrigatorio &&
      updateEmpresaDto.documentosOpcionais?.includes(updateEmpresaDto.documentoObrigatorio)
    ) {
      throw new BadRequestException('Arquivo duplicado');
    }

    // Calcular novo identificador se tipo de pessoa ou documentos mudaram
    let novoIdentificador = empresa.identificador;
    if (updateEmpresaDto.tipoPessoa || updateEmpresaDto.cnpj || updateEmpresaDto.cpf || updateEmpresaDto.identificadorEstrangeiro) {
      const dtoParaIdentificador = {
        tipoPessoa: updateEmpresaDto.tipoPessoa || empresa.tipoPessoa,
        cnpj: updateEmpresaDto.cnpj,
        cpf: updateEmpresaDto.cpf,
        identificadorEstrangeiro: updateEmpresaDto.identificadorEstrangeiro,
      };

      novoIdentificador = this.getIdentificador(dtoParaIdentificador as CreateEmpresaDto);

      // Verificar se o novo identificador já existe (exceto para a própria empresa)
      if (novoIdentificador !== empresa.identificador) {
        const empresaExistente = await this.prisma.empresa.findUnique({
          where: { identificador: novoIdentificador },
        });

        if (empresaExistente) {
          throw new ConflictException('Já existe uma empresa com este identificador');
        }
      }
    }

    // Preparar dados para atualização
    const dataToUpdate: any = {
      ...(updateEmpresaDto.tipoPessoa && { tipoPessoa: updateEmpresaDto.tipoPessoa }),
      ...(updateEmpresaDto.razaoSocial && { razaoSocial: updateEmpresaDto.razaoSocial }),
      ...(updateEmpresaDto.nome && { nome: updateEmpresaDto.nome }),
      ...(updateEmpresaDto.nomeFantasia && { nomeFantasia: updateEmpresaDto.nomeFantasia }),
      ...(novoIdentificador !== empresa.identificador && { identificador: novoIdentificador }),
      ...(updateEmpresaDto.identificadorEstrangeiro && { identificadorEstrangeiro: updateEmpresaDto.identificadorEstrangeiro }),
      ...(updateEmpresaDto.perfil && { perfil: updateEmpresaDto.perfil }),
      ...(updateEmpresaDto.faturamentoDireto !== undefined && { faturamentoDireto: updateEmpresaDto.faturamentoDireto }),
      ...(updateEmpresaDto.documentoObrigatorio && { documentoObrigatorio: updateEmpresaDto.documentoObrigatorio }),
      ...(updateEmpresaDto.documentosOpcionais && { documentosOpcionais: updateEmpresaDto.documentosOpcionais.join(',') }),
    };

    return this.prisma.empresa.update({
      where: { id },
      data: dataToUpdate,
      include: {
        criadoPor: {
          select: { id: true, nome: true, email: true, tipo: true },
        },
        responsavel: {
          select: { id: true, nome: true, email: true },
        },
      },
    });
  }

  async updateStatus(id: number, updateStatusDto: UpdateEmpresaStatusDto, userId: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: userId },
    });

    if (usuario?.tipo !== 'INTERNO') {
      throw new BadRequestException('Apenas usuários internos podem alterar status');
    }

    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa não encontrada');
    }

    const novoStatus = updateStatusDto.status as StatusEmpresa;

    return this.prisma.empresa.update({
      where: { id },
      data: {
        status: novoStatus,
        motivoReprovacao: updateStatusDto.motivoReprovacao,
        responsavelId: updateStatusDto.responsavelId,
        aprovadoEm: novoStatus === StatusEmpresa.APROVADA ? new Date() : empresa.aprovadoEm,
      },
    });
  }

  private getIdentificador(dto: CreateEmpresaDto): string {
    const isValidJuridica = dto.tipoPessoa === 'JURIDICA' && dto.cnpj;
    const isValidFisica = dto.tipoPessoa === 'FISICA' && dto.cpf;
    const isValidEstrangeira =
      dto.tipoPessoa === 'ESTRANGEIRA' && dto.identificadorEstrangeiro;

    if (isValidJuridica) return dto.cnpj!;
    if (isValidFisica) return dto.cpf!;
    if (isValidEstrangeira) return dto.identificadorEstrangeiro!;

    throw new BadRequestException('Tipo de pessoa inválido ou identificador faltando');
  }
}