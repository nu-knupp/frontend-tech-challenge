import fs from "fs";
import path from "path";

const filePath = path.resolve(
  "db",
  "server.json"
);

fs.mkdirSync(path.dirname(filePath), { recursive: true });

if (!fs.existsSync(filePath)) {
  const initialContent = { transactions: [] };
  fs.writeFileSync(filePath, JSON.stringify(initialContent, null, 2));
  console.log("✅ server.json criado com sucesso em:", filePath);
} else {
  console.log("ℹ️  server.json já existe em:", filePath);
}
