# 🚀 Frontend Tech Challenge

![Node](https://img.shields.io/badge/Node-18.20.6-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Next.js](https://img.shields.io/badge/Next.js-Pages%20Router-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MUI](https://img.shields.io/badge/MUI-v5-blue)
![Status](https://img.shields.io/badge/Status-Development-yellow)
![License](https://img.shields.io/badge/License-Private-red)

This project was developed with [Next.js](https://nextjs.org), bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

The application consists of a frontend built with **Next.js (Pages Router)**, which also acts as a **Backend For Frontend (BFF)**. The BFF follows **SOLID** principles and uses **json-server** to simulate a local database.

---

## 🧰 Requirements

- ✅ **Node.js version 18.20.6**  
  This project has a `.nvmrc` file at the root that specifies the correct Node version.  
  If you use **NVM (Node Version Manager)**, just run:

```bash
nvm use
```

> This will automatically apply the correct version (**18.20.6**) to your environment.

- ✅ Package manager: You can use **npm**, **yarn**, **pnpm**, or **bun**.

- ✅ **Recommended editor:**  
  👉 [Visual Studio Code](https://code.visualstudio.com/)  
  Recommended for its integration with ESLint, Prettier, TypeScript, and for enhancing the development experience with Node + React.

---

## 🏗️ Technologies Used

- **Next.js (Pages Router)** — React framework for web
- **TypeScript** — Static typing for JavaScript
- **Zustand** — Global state management
- **MUI (Material UI)** — UI component library
- **Zod** — Runtime schema validation
- **json-server** — Mock RESTful API (database simulation)
- **Axios** — HTTP client
- **Date-fns** — Date manipulation
- **UUID** — Unique ID generation
- **Tailwind CSS** — Utility-first CSS (optional, configured)
- **ESLint** — Code linter
- **Concurrently** — Run multiple scripts simultaneously

---

## 🔥 Features

- ✅ RESTful backend simulation with `json-server`
- ✅ BFF built with Next.js (`/api`) following **SOLID** principles
- ✅ Global state management on frontend with Zustand using `useTransactionStore`
- ✅ Modern and responsive UI with Material UI
- ✅ Robust runtime validation using Zod
- ✅ Date handling and currency formatting
- ✅ Create, list, edit, and delete transactions
- ✅ Calculate user balance based on transactions

---

## 🚀 Running the project

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to see the application.

> This command runs simultaneously:

- 🟩 **Next.js** at `http://localhost:3000`
- 🟦 **json-server** (mock database) at `http://localhost:3001`
- 🔧 Script that automatically creates the `server.json` file if it does not exist

### ⚠️ Note

If the `server.json` file does not exist in the `src/pages/api/db/` folder, it will be automatically created with the following initial content:

```json
{
  "transactions": []
}
```

---

## 🗂️ Project Structure

```
├── src
│   ├── pages
│   │   ├── api (BFF - following SOLID principles)
│   │   └── ...
│   ├── components
│   ├── hooks
│   ├── services
│   ├── types
│   └── utils
├── scripts
│   └── initServerJson.js (Automatically creates server.json)
├── .nvmrc (Node 18.20.6)
├── package.json
```

---

## 🔗 BFF Endpoints

The following endpoints are implemented:

- `GET /api/balance`  
  Returns the **user's total balance** based on all their transactions.

- `GET /api/transactions`  
  Lists all registered transactions.

- `POST /api/transactions`  
  Creates a new transaction.

- `PATCH /api/transactions/:id`  
  Edits an existing transaction (supports partial updates).

- `DELETE /api/transactions/:id`  
  Deletes a transaction.

### 🔐 Data Validation

Data validation when creating or editing a transaction is performed **at runtime** using **Zod**, ensuring data integrity.

### 🧠 Global State

**Zustand** is used for global state management on the frontend, through the custom hook `useTransactionStore`, which allows:

- Fetching transactions
- Calculating and retrieving the balance
- Adding, editing, or deleting transactions reactively

---

## 🧠 Architecture Principles

The application is built applying **SOLID** principles in the BFF layer:

- 🔸 **S** — Single Responsibility
- 🔸 **O** — Open/Closed
- 🔸 **L** — Liskov Substitution
- 🔸 **I** — Interface Segregation
- 🔸 **D** — Dependency Inversion

The API layer (`/pages/api`) acts as a **BFF**, isolating business logic and abstracting access to the mock database (`json-server`).

---

## 🚧 Useful Scripts

| Script  | Description                                                                        |
| ------- | ---------------------------------------------------------------------------------- |
| `dev`   | Runs **Next.js**, **json-server**, and the init script together via `concurrently` |
| `build` | Builds the production app                                                          |
| `start` | Runs the production build                                                          |
| `lint`  | Runs the linter (ESLint)                                                           |

> 🔥 The `prepare-server-json` script **does not need to be run manually**, it is already part of the `dev` flow.

---

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is by using the [Vercel Platform](https://vercel.com/new), the creators of Next.js.

Check the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📝 License

This project is private and does not have a public license.
