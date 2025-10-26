"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import { StatusEmpresa } from "@/types";

interface EmpresaFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusEmpresa | "TODOS";
  onStatusFilterChange: (value: StatusEmpresa | "TODOS") => void;
}

export function EmpresaFilters({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: EmpresaFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Campo de Busca */}
      <div className="space-y-2">
        <Label htmlFor="search">Buscar</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            id="search"
            type="text"
            placeholder="Buscar por nome ou identificador..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filtro de Status */}
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
          <Select
            value={statusFilter}
            onValueChange={(value) => onStatusFilterChange(value as any)}
          >
            <SelectTrigger className="pl-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos os Status</SelectItem>
              <SelectItem value="PENDENTE">Pendentes</SelectItem>
              <SelectItem value="APROVADA">Aprovadas</SelectItem>
              <SelectItem value="REPROVADA">Reprovadas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
