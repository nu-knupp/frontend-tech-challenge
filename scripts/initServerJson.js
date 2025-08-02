import fs from "fs";
import path from "path";

const dbFilePath = path.resolve("db", "db.json");
const usersFilePath = path.resolve("db", "users.json");
const serverFilePath = path.resolve("db", "server.json");

fs.mkdirSync(path.dirname(dbFilePath), { recursive: true });

// Ler dados existentes se disponíveis
let existingUsers = [];
let existingTransactions = [];

if (fs.existsSync(usersFilePath)) {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    existingUsers = JSON.parse(usersData);
    console.log("ℹ️  Dados de users.json carregados");
  } catch (e) {
    console.warn('Erro ao ler users.json:', e.message);
  }
}

if (fs.existsSync(serverFilePath)) {
  try {
    const serverData = fs.readFileSync(serverFilePath, 'utf8');
    const parsed = JSON.parse(serverData);
    existingTransactions = parsed.transactions || [];
    console.log("ℹ️  Dados de server.json carregados");
  } catch (e) {
    console.warn('Erro ao ler server.json:', e.message);
  }
}

// Criar arquivo db.json unificado
const dbContent = {
  users: existingUsers,
  transactions: existingTransactions
};

fs.writeFileSync(dbFilePath, JSON.stringify(dbContent, null, 2));
try {
  fs.chmodSync(dbFilePath, 0o666);
} catch (e) {
  console.warn('Não foi possível definir permissão 666 para db.json:', e.message);
}
console.log("✅ db.json criado com sucesso em:", dbFilePath);
