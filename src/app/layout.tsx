
"use client";
import { AuthProvider } from "@/context/AuthContext";
import ThemeRegistry from "../components/ThemeRegistry";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // O estado inicial será sempre não autenticado, o contexto sincroniza com localStorage
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
