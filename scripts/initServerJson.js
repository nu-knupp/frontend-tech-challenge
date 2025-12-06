import fs from "fs";
import path from "path";

const serverFilePath = path.resolve("db", "server.json");
const usersFilePath = path.resolve("db", "users.json");

fs.mkdirSync(path.dirname(serverFilePath), { recursive: true });

// Estrutura padrão para server.json
const defaultServerData = {
  balance: [{ value: 0 }], // json-server precisa de array ou objeto
  transactions: []
};

// Estrutura padrão para users.json
const defaultUsersData = [];

// Lê ou cria server.json
let serverData = defaultServerData;
if (fs.existsSync(serverFilePath)) {
  try {
    const fileContent = fs.readFileSync(serverFilePath, "utf-8");
    const parsedData = JSON.parse(fileContent);
    // Garante que as propriedades obrigatórias existem
    serverData = {
      balance: Array.isArray(parsedData.balance) ? parsedData.balance : [{ value: parsedData.balance || 0 }],
      transactions: parsedData.transactions || [],
      ...parsedData // Preserva outras propriedades existentes
    };
    console.log("ℹ️  server.json carregado de:", serverFilePath);
  } catch (error) {
    console.log("⚠️  Erro ao ler server.json, usando dados padrão");
    serverData = defaultServerData;
  }
} else {
  fs.writeFileSync(serverFilePath, JSON.stringify(serverData, null, 2));
  console.log("✅ server.json criado em:", serverFilePath);
}

// Lê ou cria u
let usersData = defaultUsersData;
if (fs.existsSync(usersFilePath)) {
  try {
    const fileContent = fs.readFileSync(usersFilePath, "utf-8");
    usersData = JSON.parse(fileContent);
    if (!Array.isArray(usersData)) {
      usersData = defaultUsersData;
    }
    console.log("ℹ️  users.json carregado de:", usersFilePath);
  } catch (error) {
    console.log("⚠️  Erro ao ler users.json, usando dados padrão");
    usersData = defaultUsersData;
  }
} else {
  fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));
  console.log("✅ users.json criado em:", usersFilePath);
}

// Combina ambos em server.json para o JSON Server, preservando usuários existentes
const existingUsers = Array.isArray(serverData.users) ? serverData.users : [];
const extraUsers = Array.isArray(usersData) ? usersData : [];

// Evita duplicar usuários (usa email ou id como chave)
const seen = new Set();
const mergedUsers = [...existingUsers, ...extraUsers].filter((user) => {
  const key = user.email || user.id;
  if (!key) return true;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

const combinedData = {
  ...serverData,
  users: mergedUsers
};

fs.writeFileSync(serverFilePath, JSON.stringify(combinedData, null, 2));
console.log("✅ Dados combinados salvos em server.json");
console.log("📊 Estrutura final:", {
  balance: combinedData.balance.length ? combinedData.balance[0].value : 0,
  transactions: combinedData.transactions.length + " transações",
  users: combinedData.users.length + " usuários"
});
