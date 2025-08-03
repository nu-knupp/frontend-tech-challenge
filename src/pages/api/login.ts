import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { serialize } from "cookie";
import bcrypt from "bcrypt";

const DB_FILE = path.resolve(process.cwd(), "db", "db.json");

function readUsers() {
  if (!fs.existsSync(DB_FILE)) return [];
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const json = JSON.parse(data);
    return Array.isArray(json.users) ? json.users : [];
  } catch (e) {
    return [];
  }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

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

  // Set cookie with appropriate settings for Nginx proxy
  const isProd = process.env.NODE_ENV === 'production';
  const isNginxProxy = req.headers['x-forwarded-for'] || req.headers['x-real-ip'];
  const host = req.headers.host || 'localhost';
  
  const sessionCookie = serialize("session", email, {
    path: "/",
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 dia
    sameSite: isNginxProxy ? 'lax' : (isProd ? 'none' : 'lax'),
    secure: !isNginxProxy && isProd,
    domain: isNginxProxy && host.includes('localhost') ? 'localhost' : undefined,
  });
  res.setHeader("Set-Cookie", sessionCookie);

  return res.status(200).json({
    message: "Login realizado com sucesso",
    email: user.email,
    name: user.firstName,
  });
}
