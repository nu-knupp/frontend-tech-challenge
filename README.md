# 🚀 Frontend Tech Challenge

![Node](https://img.shields.io/badge/Node-18.20.6-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Next.js](https://img.shields.io/badge/Next.js-Pages%20Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MUI](https://img.shields.io/badge/MUI-v5-blue)
![Status](https://img.shields.io/badge/Status-Development-yellow)
![License](https://img.shields.io/badge/License-Private-red)

Este é um projeto desenvolvido com [Next.js](https://nextjs.org), criado utilizando [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

A aplicação consiste em um frontend construído com **Next.js**, que também atua como um **Backend For Frontend (BFF)**. Na construção do BFF foram aplicados os princípios de **SOLID** e utilizado o **json-server** para simular um banco de dados local.

---

## 🧰 Requisitos

- ✅ **Node.js versão 18.20.6**  
  Este projeto possui um arquivo `.nvmrc` na raiz que define a versão correta do Node.  
  Se você utiliza o **NVM (Node Version Manager)**, basta rodar:

```bash
nvm use
```

> Isso aplicará automaticamente a versão correta (**18.20.6**) no seu ambiente.

- ✅ Gerenciador de pacotes: você pode utilizar **npm**, **yarn**, **pnpm** ou **bun**.

- ✅ **Editor recomendado:**  
  👉 [Visual Studio Code](https://code.visualstudio.com/)  
  Recomendado por oferecer integração com ESLint, Prettier, TypeScript, além de facilitar o desenvolvimento no ecossistema Node + React.

---

## 🏗️ Tecnologias Utilizadas

- **Next.js** — Framework React para Web
- **TypeScript** — Tipagem estática para JavaScript
- **Zustand** — Gerenciamento de estado global
- **MUI (Material UI)** — Biblioteca de componentes UI
- **Zod** — Validação de schemas em tempo de execução
- **json-server** — Mock de API RESTful (simula banco de dados)
- **Axios** — Cliente HTTP
- **Date-fns** — Manipulação de datas
- **UUID** — Geração de IDs únicos
- **Tailwind CSS** — Estilização utilitária (opcional, configurado)
- **ESLint** — Linter de código
- **Concurrently** — Execução de múltiplos scripts simultaneamente

---

## 🛠️ Funcionalidades

- ✅ Simulação de backend RESTful com `json-server`
- ✅ BFF construído com Next.js (`/api`) seguindo os princípios de **SOLID**
- ✅ Controle de estado global no frontend com Zustand através do hook `useTransactionStore`
- ✅ Interface responsiva e moderna utilizando Material UI
- ✅ Validação robusta dos dados em tempo de execução utilizando Zod
- ✅ Manipulação de datas e formatação de valores
- ✅ Criação, listagem, edição e exclusão de transações
- ✅ Cálculo de saldo do usuário com base nas transações
- ✅ Performance (Cálculos memoizados, Componentes otimizados, Lazy loading)
- ✅ Acessibilidade (Contraste adequado, Tooltips, Navegação por teclado)
- ✅ Gráficos (Tendência Mensal, Análise por Tipo, Fluxo de Caixa)
- ✅ Métricas Financeiras (Taxa de poupança, Crescimento de receitas/despesas, Maiores transações, Dia mais ativo, Média de gastos diários)
- ✅ Indicadores Visuais (Cards com gradientes, Chips de status, Barras de progresso, Ícones contextuais)

---

### 📽️ Vídeo

Para assistir ao vídeo de apresentação deste projeto, acesse o link abaixo:

[https://www.youtube.com/watch?v=Fa9JwRX2lW4](https://www.youtube.com/watch?v=Fa9JwRX2lW4)
---

## 🚀 Como executar o projeto

Execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador para visualizar a aplicação.

> Este comando executa simultaneamente:

- 🟩 **Next.js** no `http://localhost:3000`
- 🟦 **json-server** (mock do banco) no `http://localhost:3001`
- 🔧 Script que cria automaticamente o arquivo `server.json` se ele não existir

### ⚠️ Observação

Se o arquivo `server.json` não existir na pasta `src/pages/api/db/`, ele será criado automaticamente com o seguinte conteúdo inicial:

```json
{
  "transactions": []
}
```

---

## 🗂️ Estrutura do Projeto

```
├── src
│   ├── app                    # Páginas Next.js App Router
│   │   ├── page.tsx           # Página Home
│   │   ├── transactions
│   │   │   └── page.tsx       # Página Transactions
│   │   └── ...
│   ├── pages                  # Next.js Pages Router
│   │   ├── api                # BFF - seguindo princípios de SOLID
│   │   │   ├── balance
│   │   │   └── transactions
│   │   └── ...
│   ├── components
│   ├── hooks
│   ├── services
│   ├── types
│   └── utils
├── scripts
│   └── initServerJson.js      # Cria server.json automaticamente
├── .nvmrc                     # Node 18.20.6
├── package.json
```

---

## 🔗 Endpoints do BFF

Foram implementados os seguintes endpoints:

- `GET /api/balance`  
  Retorna o **saldo total** do usuário com base em todas as suas transações.

- `GET /api/transactions`  
  Lista todas as transações registradas.

- `POST /api/transactions`  
  Cria uma nova transação.

- `PATCH /api/transactions/:id`  
  Edita uma transação existente (suporte a atualização parcial).

- `DELETE /api/transactions/:id`  
  Deleta uma transação.

### 🔐 Validação de dados

A validação dos campos no momento da criação ou edição de uma transação é feita em **tempo de execução** utilizando o **Zod**, garantindo a integridade dos dados.

### 🌎 Estado global

Foi utilizado **Zustand** para o gerenciamento de estado global no frontend, através do hook personalizado `useTransactionStore`, que permite:

- Buscar as transações
- Calcular e obter o saldo
- Adicionar, editar ou remover transações de forma reativa

---

## 🗃️ Princípios de Arquitetura

Aplicação construída aplicando os princípios de **SOLID** na camada de BFF:

- 🔸 **S** — Single Responsibility (responsabilidade única)
- 🔸 **O** — Open/Closed (aberto para extensão, fechado para modificação)
- 🔸 **L** — Liskov Substitution (substituição de subclasses)
- 🔸 **I** — Interface Segregation (segregação de interfaces)
- 🔸 **D** — Dependency Inversion (inversão de dependências)

A camada de API (`/pages/api`) atua como um **BFF**, isolando as regras de negócio e abstraindo o acesso ao mock de banco de dados (`json-server`).

---

## 🚧 Scripts úteis

| Script  | Descrição                                                                                  |
| ------- | ------------------------------------------------------------------------------------------ |
| `dev`   | Executa **Next.js**, **json-server** e o script de inicialização juntos via `concurrently` |
| `build` | Cria o build de produção                                                                   |
| `start` | Executa o build de produção                                                                |
| `lint`  | Executa o linter (ESLint)                                                                  |

> 🔥 O script `prepare-server-json` **não precisa ser executado manualmente**, pois já faz parte do fluxo do `dev`.

---

## 🚀 Deploy na Vercel

A forma mais simples de fazer o deploy da sua aplicação Next.js é utilizando a plataforma da [Vercel](https://vercel.com/new), criadora do Next.js.

Confira a documentação sobre [deploy de aplicações Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

---

## 📝 Licença

Este projeto é privado e não possui uma licença pública definida.
