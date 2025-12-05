import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";

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

async function createUser(user: any) {
  const response = await fetch(USERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Failed to create user');
  }
  return await response.json();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { email, password, firstName, lastName } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios" });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: "A senha deve ter pelo menos 8 caracteres" });
  }

  try {
    const users = await getUsers();
    if (users.find((u: any) => u.email === email)) {
      return res.status(409).json({ error: "Usuário já cadastrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    };

    await createUser(newUser);

    return res.status(201).json({ message: "Cadastro realizado com sucesso" });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
}
