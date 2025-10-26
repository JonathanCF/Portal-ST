"use client";

import { useState } from "react";
import { Empresa } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./status-badge";
import { Eye, Building2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EmpresaTableProps {
  empresas: Empresa[];
  onViewDetails: (empresa: Empresa) => void;
}

export function EmpresaTable({ empresas, onViewDetails }: EmpresaTableProps) {
  // Formatar data
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
        locale: ptBR,
      });
    } catch {
      return "Data inválida";
    }
  };

  // Se não houver empresas
  if (empresas.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Nenhuma empresa encontrada
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Tente ajustar os filtros ou adicione uma nova empresa.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>Identificador</TableHead>
            <TableHead>Perfil</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data Cadastro</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {empresas.map((empresa) => (
            <TableRow key={empresa.id}>
              {/* Coluna Empresa */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full">
                    <Building2 className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {empresa.nomeFantasia}
                    </div>
                    <div className="text-sm text-gray-500">
                      {empresa.tipoPessoa}
                    </div>
                  </div>
                </div>
              </TableCell>

              {/* Coluna Identificador */}
              <TableCell className="font-mono text-sm">
                {empresa.identificador}
              </TableCell>

              {/* Coluna Perfil */}
              <TableCell>{empresa.perfil}</TableCell>

              {/* Coluna Status */}
              <TableCell>
                <StatusBadge status={empresa.status} />
              </TableCell>

              {/* Coluna Data */}
              <TableCell className="text-sm text-gray-500">
                {formatDate(empresa.criadoEm)}
              </TableCell>

              {/* Coluna Ações */}
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewDetails(empresa)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver Detalhes
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
