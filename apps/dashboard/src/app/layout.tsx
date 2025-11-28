import { cookies } from "next/headers";
import { AuthProvider } from "@banking/shared-hooks";
import { ThemeRegistry } from "@banking/shared-components";
import {
  getSessionCookieName,
  verifyAuthToken,
} from "@banking/shared-utils";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies();
  const token = (await cookieStore).get(getSessionCookieName())?.value;
  const payload = token ? await verifyAuthToken(token) : null;

  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider
          initialAuth={{
            isAuthenticated: !!payload,
            userName: payload?.name ?? "",
          }}
        >
          <ThemeRegistry>{children}</ThemeRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
