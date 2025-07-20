import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { serialize } from "cookie";

const USERS_FILE = path.resolve(process.cwd(), "db", "users.json");

function readUsers() {
    if (!fs.existsSync(USERS_FILE)) return [];
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "Email e senha obrigatórios" });
    }

    const users = readUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({ error: "Email ou senha inválidos" });
    }

    // Cria cookie de sessão simples
    const sessionCookie = serialize("session", email, {
        path: "/",
        httpOnly: true,
        maxAge: 60 * 60 * 24, // 1 dia
    });
    res.setHeader("Set-Cookie", sessionCookie);

    return res.status(200).json({ message: "Login realizado com sucesso", email });
}
