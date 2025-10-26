import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Portal ST - Cadastro de Empresas",
  description: "Sistema de cadastro e gerenciamento de empresas",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      {/* Evite qualquer código dinâmico aqui */}
      <body cz-shortcut-listen="true">
        {/* Envolva toda a aplicação com Providers */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
