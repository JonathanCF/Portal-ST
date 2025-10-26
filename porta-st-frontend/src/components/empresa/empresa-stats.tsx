import { Empresa } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, Clock, CheckCircle, XCircle } from "lucide-react";

interface EmpresaStatsProps {
  empresas: Empresa[];
}

export function EmpresaStats({ empresas }: EmpresaStatsProps) {
  // Calcular estatísticas
  const stats = {
    total: empresas.length,
    pendentes: empresas.filter((e) => e.status === "PENDENTE").length,
    aprovadas: empresas.filter((e) => e.status === "APROVADA").length,
    reprovadas: empresas.filter((e) => e.status === "REPROVADA").length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building2 className="w-10 h-10 text-blue-500" />
          </div>
        </CardContent>
      </Card>

      {/* Pendentes */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats.pendentes}
              </p>
            </div>
            <Clock className="w-10 h-10 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      {/* Aprovadas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.aprovadas}
              </p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </CardContent>
      </Card>

      {/* Reprovadas */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reprovadas</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.reprovadas}
              </p>
            </div>
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
