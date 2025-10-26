"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const LoginForm = dynamic(
  () =>
    import("@/components/auth/login-form").then((mod) => ({
      default: mod.LoginForm,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    ),
  }
);

export default function LoginPage() {
  return <LoginForm />;
}
