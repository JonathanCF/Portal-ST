import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { EmpresaService } from './empresa.service';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { UpdateEmpresaStatusDto } from './dto/update-empresa-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('empresas')
@UseGuards(JwtAuthGuard)
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Post()
  create(@Body() createEmpresaDto: CreateEmpresaDto, @Request() req) {
    return this.empresaService.create(createEmpresaDto, req.user.id);
  }

  @Get()
  findAll(@Request() req, @Query('status') status?: string) {
    return this.empresaService.findAll(req.user.id, status);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.empresaService.findOne(id, req.user.id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmpresaDto: UpdateEmpresaDto,
    @Request() req,
  ) {
    return this.empresaService.update(id, updateEmpresaDto, req.user.id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateEmpresaStatusDto,
    @Request() req,
  ) {
    return this.empresaService.updateStatus(id, updateStatusDto, req.user.id);
  }
}