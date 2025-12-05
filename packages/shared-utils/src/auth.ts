import { SignJWT, jwtVerify } from "jose";

const DEFAULT_AUTH_SECRET =
  process.env.NODE_ENV === "production"
    ? undefined
    : "dev-only-3frnt-auth-secret-change-me";

const ISSUER = "3frnt-finance";
const AUDIENCE = "3frnt-users";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "session";
const SESSION_MAX_AGE =
  Number(process.env.SESSION_MAX_AGE ?? 60 * 60 * 8); // 8 horas
const DEFAULT_COOKIE_SAME_SITE = "strict" as const;

const textEncoder = new TextEncoder();

const getAuthSecret = () => {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    if (DEFAULT_AUTH_SECRET) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "[auth] AUTH_SECRET não definido. Usando chave fraca de desenvolvimento."
        );
      }
      return DEFAULT_AUTH_SECRET;
    }
    throw new Error(
      "AUTH_SECRET não definido. Configure uma chave segura para a aplicação."
    );
  }

  return secret;
};

const getSecretKey = () => textEncoder.encode(getAuthSecret());

export type AuthTokenPayload = {
  sub: string;
  email: string;
  name: string;
  iat?: number;
  exp?: number;
};

const normalizeExpiration = (expiresIn?: string | number) => {
  if (!expiresIn) {
    return `${SESSION_MAX_AGE}s`;
  }

  if (typeof expiresIn === "number") {
    return `${expiresIn}s`;
  }

  return expiresIn;
};

export const signAuthToken = async (
  payload: Pick<AuthTokenPayload, "sub" | "email" | "name">,
  options: { expiresIn?: string | number } = {}
): Promise<string> => {
  return new SignJWT({
    email: payload.email,
    name: payload.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(normalizeExpiration(options.expiresIn))
    .setSubject(payload.sub)
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .sign(getSecretKey());
};

export const verifyAuthToken = async (
  token: string
): Promise<AuthTokenPayload | null> => {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      issuer: ISSUER,
      audience: AUDIENCE,
    });

    return {
      sub: payload.sub ?? "",
      email: String(payload.email ?? ""),
      name: String(payload.name ?? ""),
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[auth] Token inválido ou expirado.", error);
    }
    return null;
  }
};

export const getSessionCookieName = () => SESSION_COOKIE_NAME;
export const getSessionMaxAge = () => SESSION_MAX_AGE;
export const getSessionSameSite = () => DEFAULT_COOKIE_SAME_SITE;

export const shouldUseSecureCookies = () =>
  process.env.SESSION_COOKIE_SECURE === "true" ||
  process.env.NODE_ENV === "production";

