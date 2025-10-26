"use client";

import { AlertModal } from "@/components/ui/alert-modal";
import { Empresa } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StatusBadge } from "./status-badge";
import { useUpdateEmpresaStatus } from "@/hooks/use-empresas";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
} from "lucide-react";

interface EmpresaDetailsDialogProps {
  empresa: Empresa | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EmpresaDetailsDialog({
  empresa,
  open,
  onOpenChange,
}: EmpresaDetailsDialogProps) {
  const { user } = useAuth();
  const updateStatus = useUpdateEmpresaStatus();
  const [motivoReprovacao, setMotivoReprovacao] = useState("");
  const [showReprovarForm, setShowReprovarForm] = useState(false);
  const [successModal, setSuccessModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  } | null>(null);

  if (!empresa) return null;

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

  const getFileUrl = (filename: string) => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ||
      "http://localhost:3333";
    return `${backendUrl}/uploads/${filename}`;
  };

  // Aprovar empresa
  const handleAprovar = () => {
    updateStatus.mutate(
      {
        id: empresa.id,
        data: { status: "APROVADA" },
      },
      {
        onSuccess: () => {
          setSuccessModal({
            isOpen: true,
            title: "Sucesso",
            message: "Empresa aprovada com sucesso",
          });
          onOpenChange(false);
        },
      }
    );
  };

  // Reprovar empresa
  const handleReprovar = () => {
    if (!motivoReprovacao.trim()) {
      alert("Por favor, informe o motivo da reprovação");
      return;
    }

    updateStatus.mutate(
      {
        id: empresa.id,
        data: {
          status: "REPROVADA",
          motivoReprovacao,
        },
      },
      {
        onSuccess: () => {
          setSuccessModal({
            isOpen: true,
            title: "Sucesso",
            message: "Empresa reprovada com sucesso",
          });
          setMotivoReprovacao("");
          setShowReprovarForm(false);
          onOpenChange(false);
        },
      }
    );
  };

  const isInterno = user?.tipo === "INTERNO";
  const isPendente = empresa.status === "PENDENTE";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Detalhes da Empresa</DialogTitle>
            <DialogDescription>
              Informações completas do cadastro
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Status */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {empresa.nomeFantasia}
              </h3>
              <StatusBadge status={empresa.status} />
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Tipo de Pessoa" value={empresa.tipoPessoa} />
              <InfoRow label="Identificador" value={empresa.identificador} />
              <InfoRow label="Perfil" value={empresa.perfil} />
              <InfoRow
                label="Faturamento Direto"
                value={empresa.faturamentoDireto ? "Sim" : "Não"}
              />
              {empresa.razaoSocial && (
                <InfoRow label="Razão Social" value={empresa.razaoSocial} />
              )}
              {empresa.nome && <InfoRow label="Nome" value={empresa.nome} />}
            </div>

            {/* Documentos */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Documentos</h4>
              <div className="space-y-2">
                {/* Documento Obrigatório */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Documento Obrigatório
                      </p>
                      <p className="text-xs text-gray-500">
                        {empresa.documentoObrigatorio}
                      </p>
                    </div>
                  </div>

                  <a
                    href={getFileUrl(empresa.documentoObrigatorio)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Abrir
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Documentos Opcionais */}
                {empresa.documentosOpcionais &&
                  empresa.documentosOpcionais.length > 0 && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Documentos Opcionais
                          </p>
                          <p className="text-xs text-gray-500">
                            {empresa.documentosOpcionais.split(",").join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            {/* Informações de Cadastro */}
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-2">
                Informações do Cadastro
              </h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Criado por:</span>{" "}
                  {empresa.criadoPor?.nome} ({empresa.criadoPor?.tipo})
                </p>
                <p>
                  <span className="font-medium">Data de Cadastro:</span>{" "}
                  {formatDate(empresa.criadoEm)}
                </p>
                {empresa.aprovadoEm && (
                  <p>
                    <span className="font-medium">Data de Aprovação:</span>{" "}
                    {formatDate(empresa.aprovadoEm)}
                  </p>
                )}
              </div>
            </div>

            {/* Motivo de Reprovação */}
            {empresa.motivoReprovacao && (
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="font-medium text-red-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Motivo da Reprovação:
                </p>
                <p className="text-red-700 text-sm">
                  {empresa.motivoReprovacao}
                </p>
              </div>
            )}

            {/* Formulário de Reprovação */}
            {showReprovarForm && (
              <div className="space-y-3">
                <Label htmlFor="motivo">Motivo da Reprovação *</Label>
                <Textarea
                  id="motivo"
                  value={motivoReprovacao}
                  onChange={(e) => setMotivoReprovacao(e.target.value)}
                  placeholder="Descreva o motivo da reprovação..."
                  rows={4}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>

            {isInterno && isPendente && (
              <>
                {!showReprovarForm ? (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => setShowReprovarForm(true)}
                      disabled={updateStatus.isPending}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reprovar
                    </Button>
                    <Button
                      onClick={handleAprovar}
                      disabled={updateStatus.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Aprovar
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReprovarForm(false);
                        setMotivoReprovacao("");
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleReprovar}
                      disabled={
                        updateStatus.isPending || !motivoReprovacao.trim()
                      }
                    >
                      Confirmar Reprovação
                    </Button>
                  </>
                )}
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Modal de sucesso fora do diálogo */}
      {successModal && (
        <AlertModal
          isOpen={successModal.isOpen}
          onClose={() => setSuccessModal(null)}
          title={successModal.title}
          message={successModal.message}
          type="success"
        />
      )}
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b pb-2">
      <span className="text-sm font-medium text-gray-700">{label}:</span>
      <p className="text-sm text-gray-900 mt-1">{value}</p>
    </div>
  );
}
