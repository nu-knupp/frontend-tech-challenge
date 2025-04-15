import Head from "@/components/header";
import { StyledComponentsRegistry } from "@/lib/styled-components";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minha Aplicação",
  description: "Projeto de Transações Bancárias",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <Head />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
    </html>
  );
}
