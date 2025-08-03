import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import bcrypt from "bcrypt";
import { Transaction } from "@/types/Transaction";

const DB_FILE = path.resolve(process.cwd(), "db", "db.json");


function readUsers() {
  if (!fs.existsSync(DB_FILE)) {
    // Cria o diretório se não existir
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      // Garante permissão de escrita no diretório
      try { fs.chmodSync(dir, 0o777); } catch (e) {}
    }
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [], transactions: [] }, null, 2), 'utf-8');
    // Garante permissão de escrita no arquivo
    try { fs.chmodSync(DB_FILE, 0o666); } catch (e) {}
    return [];
  }
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    const json = JSON.parse(data);
    return Array.isArray(json.users) ? json.users : [];
  } catch (e) {
    return [];
  }
}

type User = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};

type DB = {
  users: User[];
  transactions: Transaction[];
};

function writeUsers(users: User[]) {
  let db: DB = { users: [], transactions: [] };
  if (fs.existsSync(DB_FILE)) {
    try {
      db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    } catch (e) {
      // ignora erro
    }
  }
  db.users = users;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (e) {
    // Tenta ajustar permissão se necessário
    try {
      fs.chmodSync(DB_FILE, 0o666);
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    } catch (err) {
      throw err;
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
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
