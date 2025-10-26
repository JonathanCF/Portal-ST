"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEmpresas } from "@/hooks/use-empresas";
import { usePermissions, Permission } from "@/hooks/use-permissions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmpresaTable } from "@/components/empresa/empresa-table";
import { EmpresaFilters } from "@/components/empresa/empresa-filters";
import { EmpresaStats } from "@/components/empresa/empresa-stats";
import { EmpresaDetailsDialog } from "@/components/empresa/empresa-details-dialog";
import { EmpresaForm } from "@/components/empresa/empresa-form";
import { Building2, Plus, LogOut, Loader2, AlertCircle } from "lucide-react";
import { Empresa, StatusEmpresa } from "@/types";

export default function DashboardPage() {
  const router = useRouter();
  const { hasPermission } = usePermissions();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusEmpresa | "TODOS">(
    "TODOS"
  );
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresa | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const [editingEmpresa, setEditingEmpresa] = useState<Empresa | null>(null);

  // Verificar autenticação
  useEffect(() => {
    console.log("📊 Dashboard montado");

    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        console.log("❌ Não autenticado - Redirecionando para login");
        router.push("/login");
        return;
      }

      try {
        const parsedUser = JSON.parse(userStr);
        console.log("✅ Usuário autenticado:", parsedUser.nome);
        console.log("🔑 Permissões:", parsedUser.permissoes);
        setUser(parsedUser);
        setLoading(false);
      } catch (error) {
        console.error("❌ Erro ao parsear user:", error);
        localStorage.clear();
        router.push("/login");
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [router]);

  const canListEmpresas =
    hasPermission(Permission.EMPRESA_LISTA) ||
    hasPermission(Permission.EMPRESA_MASTER);

  const canCreateEmpresa =
    hasPermission(Permission.EMPRESA_CADASTRO) ||
    hasPermission(Permission.EMPRESA_MASTER);

  const canEditEmpresa =
    hasPermission(Permission.EMPRESA_EDICAO) ||
    hasPermission(Permission.EMPRESA_MASTER);

  const {
    data: empresas = [],
    isLoading: loadingEmpresas,
    error,
  } = useEmpresas(statusFilter === "TODOS" ? undefined : statusFilter, {
    enabled: !!user && canListEmpresas,
  });

  const empresasFiltradas = empresas.filter((empresa) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      empresa.nomeFantasia.toLowerCase().includes(searchLower) ||
      empresa.identificador.toLowerCase().includes(searchLower)
    );
  });

  const handleViewDetails = (empresa: Empresa) => {
    setSelectedEmpresa(empresa);
    setShowDetailsDialog(true);
  };

  const handleEdit = (empresa: Empresa) => {
    console.log("✏️ Editando empresa:", empresa.nomeFantasia);
    setEditingEmpresa(empresa);
    setShowFormDialog(true);
  };

  const handleCloseForm = () => {
    setShowFormDialog(false);
    setEditingEmpresa(null);
  };

  const handleLogout = () => {
    console.log("🚪 Fazendo logout");
    localStorage.clear();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!canListEmpresas) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portal ST</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {user.nome}</p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Acesso Restrito
              </h2>
              <p className="text-gray-600 mb-4">
                Você não tem permissão para visualizar esta página.
              </p>
              <p className="text-sm text-gray-500">
                Permissões necessárias: EMPRESA_LISTA ou EMPRESA_MASTER
              </p>
              {canCreateEmpresa && (
                <Button
                  onClick={() => setShowFormDialog(true)}
                  className="mt-6"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Empresa
                </Button>
              )}
            </CardContent>
          </Card>
        </main>

        {showFormDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Nova Empresa</h2>
                  <Button variant="ghost" onClick={handleCloseForm}>
                    ✕
                  </Button>
                </div>
                <EmpresaForm onSuccess={handleCloseForm} />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Portal ST - Administração de Empresas
                </h1>
                <p className="text-sm text-gray-600">
                  Bem-vindo, <span className="font-semibold">{user.nome}</span>{" "}
                  ({user.tipo})
                  {user.permissoes && (
                    <span className="text-xs ml-2 text-blue-600">
                      Permissões: {user.permissoes.join(", ")}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {canCreateEmpresa && (
                <Button onClick={() => setShowFormDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Empresa
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {!loadingEmpresas && <EmpresaStats empresas={empresas} />}

          <Card>
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <EmpresaFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Lista de Empresas ({empresasFiltradas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEmpresas && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <p className="text-red-600">
                    Erro ao carregar empresas. Tente novamente.
                  </p>
                </div>
              )}

              {!loadingEmpresas && !error && (
                <EmpresaTable
                  empresas={empresasFiltradas}
                  onViewDetails={handleViewDetails}
                  onEdit={canEditEmpresa ? handleEdit : undefined}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Dialog de Detalhes */}
      <EmpresaDetailsDialog
        empresa={selectedEmpresa}
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
      />

      {/* Modal de Formulário (Criar/Editar) */}
      {showFormDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  {editingEmpresa ? "Editar Empresa" : "Nova Empresa"}
                </h2>
                <Button variant="ghost" onClick={handleCloseForm}>
                  ✕
                </Button>
              </div>
              <EmpresaForm
                onSuccess={handleCloseForm}
                empresa={editingEmpresa || undefined}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
