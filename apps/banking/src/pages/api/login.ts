import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import bcrypt from "bcrypt";
import {
  signAuthToken,
  getSessionCookieName,
  getSessionMaxAge,
  shouldUseSecureCookies,
  getSessionSameSite,
} from "@banking/shared-utils";

const API_URL = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";
const USERS_URL = API_URL.replace("/transactions", "/users");

const COOKIE_MAX_AGE = 60 * 60 * 24; // 1 dia em segundos
const IS_PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Busca todos os usuários cadastrados no JSON Server
 */
async function getUsers() {
  try {
    const response = await fetch(USERS_URL, { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}

/**
 * Handler da rota de login
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, password } = req.body;

  // Verifica se email e senha foram enviados
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  try {
    const users = await getUsers();
    const user = users.find((u: any) => u.email === email);

    // Usuário não encontrado
    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    // Compara senha criptografada
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      // Adiciona um pequeno atraso para evitar brute-force
      await new Promise((resolve) => setTimeout(resolve, 500));
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const token = await signAuthToken({
      sub: user.email,
      email: user.email,
      name: user.firstName,
    });

    const sessionCookie = serialize(getSessionCookieName(), token, {
      path: "/",
      httpOnly: true,
      maxAge: getSessionMaxAge(),
      sameSite: getSessionSameSite(),
      secure: shouldUseSecureCookies(),
    });

    res.setHeader("Set-Cookie", sessionCookie);
    res.setHeader("Cache-Control", "no-store");

    // Retorna uma resposta limpa ao front
    return res.status(200).json({
      message: "Login realizado com sucesso",
      name: user.firstName,
    });
  } catch (error) {
    console.error("Erro interno no login:", error);
    return res.status(500).json({ error: "Erro interno do servidor. Tente novamente mais tarde." });
  }
}
