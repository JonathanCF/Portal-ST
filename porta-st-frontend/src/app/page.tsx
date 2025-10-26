"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    console.log("🏠 Home - Verificando autenticação...");

    // Pequeno delay
    const timer = setTimeout(() => {
      const token = localStorage.getItem("token");

      console.log("🔍 Token encontrado?", !!token);

      if (token) {
        console.log("✅ Autenticado - Indo para dashboard");
        router.push("/dashboard");
      } else {
        console.log("❌ Não autenticado - Indo para login");
        router.push("/login");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}
