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
const USERS_URL = API_URL.replace('/transactions', '/users');

async function getUsers() {
  try {
    const response = await fetch(USERS_URL, { cache: "no-store" });
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  try {
    const users = await getUsers();
    const user = users.find((u: any) => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
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

    return res.status(200).json({
      message: "Login realizado com sucesso",
      email: user.email,
      name: user.firstName,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
