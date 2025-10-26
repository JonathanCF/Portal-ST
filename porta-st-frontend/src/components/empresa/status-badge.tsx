import { Badge } from "@/components/ui/badge";
import { StatusEmpresa } from "@/types";
import { Clock, CheckCircle, XCircle } from "lucide-react";

interface StatusBadgeProps {
  status: StatusEmpresa;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const configs = {
    PENDENTE: {
      icon: Clock,
      variant: "secondary" as const,
      label: "Aguardando Aprovação",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },
    APROVADA: {
      icon: CheckCircle,
      variant: "default" as const,
      label: "Aprovada",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    REPROVADA: {
      icon: XCircle,
      variant: "destructive" as const,
      label: "Reprovada",
      className: "bg-red-100 text-red-800 hover:bg-red-100",
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={config.className}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
