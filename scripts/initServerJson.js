import fs from "fs";
import path from "path";


const serverFilePath = path.resolve("db", "server.json");
const usersFilePath = path.resolve("db", "users.json");

fs.mkdirSync(path.dirname(serverFilePath), { recursive: true });

if (!fs.existsSync(serverFilePath)) {
  const initialContent = { transactions: [] };
  fs.writeFileSync(serverFilePath, JSON.stringify(initialContent, null, 2));
  try {
    fs.chmodSync(serverFilePath, 0o666);
  } catch (e) {
    console.warn('Não foi possível definir permissão 666 para server.json:', e.message);
  }
  console.log("✅ server.json criado com sucesso em:", serverFilePath);
} else {
  console.log("ℹ️  server.json já existe em:", serverFilePath);
}

if (!fs.existsSync(usersFilePath)) {
  const initialUsers = [];
  fs.writeFileSync(usersFilePath, JSON.stringify(initialUsers, null, 2));
  try {
    fs.chmodSync(usersFilePath, 0o666);
  } catch (e) {
    console.warn('Não foi possível definir permissão 666 para users.json:', e.message);
  }
  console.log("✅ users.json criado com sucesso em:", usersFilePath);
} else {
  console.log("ℹ️  users.json já existe em:", usersFilePath);
}
