import { cookies } from "next/headers";
import { AuthProvider } from "@banking/shared-hooks";
import { ThemeRegistry } from "@banking/shared-components";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const session = (await cookieStore).get("session")?.value;
  const userName = (await cookieStore).get("userName")?.value;

  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider
          initialAuth={{
            isAuthenticated: !!session,
            userName: userName ?? "",
          }}
        >
          <ThemeRegistry>{children}</ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
