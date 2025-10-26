"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCreateEmpresa } from "@/hooks/use-empresas";
import { useUploadFile } from "@/hooks/use-upload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertModal } from "@/components/ui/alert-modal";
import { Loader2, Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

// Schemas de validação
const baseSchema = z.object({
  tipoPessoa: z.enum(["JURIDICA", "FISICA", "ESTRANGEIRA"]),
  nomeFantasia: z.string().min(3, "Mínimo de 3 caracteres"),
  perfil: z
    .enum([
      "DESPACHANTE",
      "BENEFICIARIO",
      "CONSIGNATARIO",
      "ARMADOR",
      "AGENTE_CARGA",
      "TRANSPORTADORA",
    ])
    .refine((val) => !!val, {
      message: "Selecione um perfil válido.",
    }),
  faturamentoDireto: z.boolean().optional(),
});

const juridicaSchema = baseSchema.extend({
  razaoSocial: z.string().min(3, "Mínimo de 3 caracteres"),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve ter 14 dígitos"),
});

const fisicaSchema = baseSchema.extend({
  nome: z.string().min(3, "Mínimo de 3 caracteres"),
  cpf: z.string().regex(/^\d{11}$/, "CPF deve ter 11 dígitos"),
});

const estrangeiraSchema = baseSchema.extend({
  razaoSocial: z.string().min(3, "Mínimo de 3 caracteres"),
  identificadorEstrangeiro: z.string().min(3, "Mínimo de 3 caracteres"),
});

// Tipos de modais
type ModalState = {
  isOpen: boolean;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
} | null;

export function EmpresaForm({ onSuccess }: { onSuccess?: () => void }) {
  const [tipoPessoa, setTipoPessoa] = useState<
    "JURIDICA" | "FISICA" | "ESTRANGEIRA"
  >("JURIDICA");
  const [documentoFile, setDocumentoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  const createEmpresa = useCreateEmpresa();
  const uploadFile = useUploadFile();

  const getSchema = () => {
    if (tipoPessoa === "JURIDICA") return juridicaSchema;
    if (tipoPessoa === "FISICA") return fisicaSchema;
    return estrangeiraSchema;
  };

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setError,
  } = useForm<any>({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      tipoPessoa: "JURIDICA",
      faturamentoDireto: false,
    },
  });

  const watchTipoPessoa = watch("tipoPessoa");

  // Validar arquivo
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      setDocumentoFile(null);
      return;
    }

    // [M08] Validar tipo de arquivo
    const validTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];
    if (!validTypes.includes(file.type)) {
      setModal({
        isOpen: true,
        title: "Arquivo inválido",
        message: "São válidos somente arquivos do tipo: pdf, png, jpg ou jpeg.",
        type: "error",
      });
      setDocumentoFile(null);
      return;
    }

    // [M07] Validar tamanho (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setModal({
        isOpen: true,
        title: "Arquivo inválido",
        message: "Tamanho de arquivo não suportado.",
        type: "error",
      });
      setDocumentoFile(null);
      return;
    }

    // [M06] Verificar arquivo duplicado (simulação)
    // Em produção, você verificaria se o arquivo já foi anexado

    setDocumentoFile(file);
  };

  const handleRemoveFile = () => {
    setDocumentoFile(null);
    const fileInput = document.getElementById(
      "documentoObrigatorio"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data: any) => {
    console.log("📝 Validando formulário...");

    // [M02] Validar se tem documento
    if (!documentoFile) {
      setModal({
        isOpen: true,
        title: "Aviso",
        message: "É necessário enviar os arquivos obrigatórios para prosseguir",
        type: "warning",
      });
      return;
    }

    // [M03] Validar perfil (já validado pelo Zod, mas podemos adicionar validação de backend)
    if (!data.perfil) {
      setModal({
        isOpen: true,
        title: "Atenção",
        message: "Ocorreu um erro ao encontrar o perfil",
        type: "error",
      });
      return;
    }

    try {
      setIsUploading(true);

      // Upload do arquivo
      console.log("📤 Fazendo upload...");
      const uploadResult = await uploadFile.mutateAsync(documentoFile);

      // Criar empresa
      const dadosCompletos = {
        ...data,
        documentoObrigatorio: uploadResult.filename,
      };

      await createEmpresa.mutateAsync(dadosCompletos);

      // [M01] Sucesso
      setModal({
        isOpen: true,
        title: "Sucesso",
        message: "Empresa cadastrada com sucesso.",
        type: "success",
      });

      // Limpar formulário
      reset();
      setDocumentoFile(null);
    } catch (error: any) {
      console.error("❌ Erro:", error);

      // Tratar erros específicos
      if (error.response?.data?.message?.includes("CNPJ")) {
        // [M04] CNPJ inválido
        setModal({
          isOpen: true,
          title: "Atenção",
          message: "CNPJ fornecido inválido",
          type: "error",
        });
      } else if (error.response?.data?.message?.includes("CPF")) {
        // [M05] CPF inválido
        setModal({
          isOpen: true,
          title: "Atenção",
          message: "CPF inválido",
          type: "error",
        });
      } else {
        setModal({
          isOpen: true,
          title: "Erro",
          message: error.response?.data?.message || "Erro ao cadastrar empresa",
          type: "error",
        });
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleModalClose = () => {
    setModal(null);

    // Se foi sucesso, chamar onSuccess
    if (modal?.type === "success") {
      onSuccess?.();
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Tipo de Pessoa */}
            <div className="space-y-2">
              <Label>Tipo de Pessoa *</Label>
              <Controller
                name="tipoPessoa"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setTipoPessoa(value as any);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="JURIDICA">Pessoa Jurídica</SelectItem>
                      <SelectItem value="FISICA">Pessoa Física</SelectItem>
                      <SelectItem value="ESTRANGEIRA">
                        Pessoa Estrangeira
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Campos específicos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchTipoPessoa === "JURIDICA" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input id="razaoSocial" {...register("razaoSocial")} />
                    {errors.razaoSocial && (
                      <p className="text-sm text-red-500">
                        {errors.razaoSocial.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      placeholder="00000000000000"
                      maxLength={14}
                      {...register("cnpj")}
                    />
                    {errors.cnpj && (
                      <p className="text-sm text-red-500">
                        {errors.cnpj.message as string}
                      </p>
                    )}
                  </div>
                </>
              )}

              {watchTipoPessoa === "FISICA" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome *</Label>
                    <Input id="nome" {...register("nome")} />
                    {errors.nome && (
                      <p className="text-sm text-red-500">
                        {errors.nome.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      placeholder="00000000000"
                      maxLength={11}
                      {...register("cpf")}
                    />
                    {errors.cpf && (
                      <p className="text-sm text-red-500">
                        {errors.cpf.message as string}
                      </p>
                    )}
                  </div>
                </>
              )}

              {watchTipoPessoa === "ESTRANGEIRA" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="razaoSocial">Razão Social *</Label>
                    <Input id="razaoSocial" {...register("razaoSocial")} />
                    {errors.razaoSocial && (
                      <p className="text-sm text-red-500">
                        {errors.razaoSocial.message as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="identificadorEstrangeiro">
                      Identificador Estrangeiro *
                    </Label>
                    <Input
                      id="identificadorEstrangeiro"
                      {...register("identificadorEstrangeiro")}
                    />
                    {errors.identificadorEstrangeiro && (
                      <p className="text-sm text-red-500">
                        {errors.identificadorEstrangeiro.message as string}
                      </p>
                    )}
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="nomeFantasia">Nome Fantasia *</Label>
                <Input id="nomeFantasia" {...register("nomeFantasia")} />
                {errors.nomeFantasia && (
                  <p className="text-sm text-red-500">
                    {errors.nomeFantasia.message as string}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Perfil *</Label>
                <Controller
                  name="perfil"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DESPACHANTE">Despachante</SelectItem>
                        <SelectItem value="BENEFICIARIO">
                          Beneficiário
                        </SelectItem>
                        <SelectItem value="CONSIGNATARIO">
                          Consignatário
                        </SelectItem>
                        <SelectItem value="ARMADOR">Armador</SelectItem>
                        <SelectItem value="AGENTE_CARGA">
                          Agente de Carga
                        </SelectItem>
                        <SelectItem value="TRANSPORTADORA">
                          Transportadora
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.perfil && (
                  <p className="text-sm text-red-500">
                    {errors.perfil.message as string}
                  </p>
                )}
              </div>
            </div>

            {/* Upload de Documento */}
            <div className="space-y-2">
              <Label htmlFor="documentoObrigatorio">
                Documento Comprobatório *
              </Label>

              {!documentoFile ? (
                <label
                  htmlFor="documentoObrigatorio"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors border-gray-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">
                      <span className="font-semibold">
                        Clique para fazer upload
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PDF, PNG, JPG ou JPEG (máx. 5MB)
                    </p>
                  </div>
                  <input
                    id="documentoObrigatorio"
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {documentoFile.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(documentoFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Faturamento Direto */}
            <div className="flex items-center space-x-2">
              <Controller
                name="faturamentoDireto"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="faturamentoDireto"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="faturamentoDireto" className="cursor-pointer">
                Faturamento Direto
              </Label>
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={createEmpresa.isPending || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando arquivo...
                  </>
                ) : createEmpresa.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  "Salvar"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  setDocumentoFile(null);
                }}
                disabled={createEmpresa.isPending || isUploading}
              >
                Limpar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Modal Genérico */}
      {modal && (
        <AlertModal
          isOpen={modal.isOpen}
          onClose={handleModalClose}
          title={modal.title}
          message={modal.message}
          type={modal.type}
        />
      )}
    </>
  );
}
