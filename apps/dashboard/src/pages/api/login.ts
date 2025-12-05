import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { serialize } from "cookie";
import bcrypt from "bcrypt";
import { config } from "@/lib/config";
import {
  signAuthToken,
  getSessionCookieName,
  getSessionMaxAge,
  shouldUseSecureCookies,
  getSessionSameSite,
} from "@banking/shared-utils";

const USERS_FILE = config.usersFile;

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha obrigatórios" });
  }

  const users = readUsers();
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
}
