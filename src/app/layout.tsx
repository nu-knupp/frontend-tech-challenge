import { ReactNode } from "react";
import ThemeRegistry from "../components/ThemeRegistry";

export const metadata = {
  title: "Banco Simples",
  description: "Gerenciamento de transações bancárias",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="pt-BR">
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
