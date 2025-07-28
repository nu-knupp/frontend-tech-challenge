import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";

const USERS_FILE = path.resolve(process.cwd(), "db", "users.json");

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE, "utf-8");
  return JSON.parse(data);
}

function writeUsers(users: any[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  const users = readUsers();
  if (users.find((u: any) => u.email === email)) {
    return res.status(409).json({ error: "Usuário já cadastrado" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    email,
    password: hashedPassword,
    firstName,
    lastName,
  });

  writeUsers(users);

  return res.status(201).json({ message: "Cadastro realizado com sucesso" });
}
