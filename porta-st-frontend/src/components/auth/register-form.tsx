"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// Schema de validação
const registerSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  tipo: z.enum(["INTERNO", "EXTERNO"], { message: "Selecione o tipo" }),
  perfil: z.enum(
    [
      "DESPACHANTE",
      "BENEFICIARIO",
      "CONSIGNATARIO",
      "ARMADOR",
      "AGENTE_CARGA",
      "TRANSPORTADORA",
      "NOVO_USUARIO",
      "ADMIN",
    ],
    { message: "Selecione o perfil" }
  ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success(
        "Registro realizado com sucesso! Faça login para continuar."
      );
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erro ao registrar");
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
          <CardDescription>
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="João Silva"
                {...register("nome")}
                disabled={registerMutation.isPending}
              />
              {errors.nome && (
                <p className="text-sm text-red-500">{errors.nome.message}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                {...register("email")}
                disabled={registerMutation.isPending}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                placeholder="••••••"
                {...register("senha")}
                disabled={registerMutation.isPending}
              />
              {errors.senha && (
                <p className="text-sm text-red-500">{errors.senha.message}</p>
              )}
            </div>

            {/* Tipo de Usuário */}
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo de Usuário</Label>
              <Select
                onValueChange={(value) => setValue("tipo", value as any)}
                disabled={registerMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXTERNO">Externo</SelectItem>
                  <SelectItem value="INTERNO">Interno</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipo && (
                <p className="text-sm text-red-500">{errors.tipo.message}</p>
              )}
            </div>

            {/* Perfil */}
            <div className="space-y-2">
              <Label htmlFor="perfil">Perfil</Label>
              <Select
                onValueChange={(value) => setValue("perfil", value as any)}
                disabled={registerMutation.isPending}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DESPACHANTE">Despachante</SelectItem>
                  <SelectItem value="BENEFICIARIO">Beneficiário</SelectItem>
                  <SelectItem value="CONSIGNATARIO">Consignatário</SelectItem>
                  <SelectItem value="ARMADOR">Armador</SelectItem>
                  <SelectItem value="AGENTE_CARGA">Agente de Carga</SelectItem>
                  <SelectItem value="TRANSPORTADORA">Transportadora</SelectItem>
                  <SelectItem value="NOVO_USUARIO">Novo Usuário</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
              {errors.perfil && (
                <p className="text-sm text-red-500">{errors.perfil.message}</p>
              )}
            </div>

            {/* Botão Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando...
                </>
              ) : (
                "Criar Conta"
              )}
            </Button>

            {/* Link para Login */}
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-blue-600 hover:underline">
                Faça login
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
