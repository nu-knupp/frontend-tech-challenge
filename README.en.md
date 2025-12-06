# 🏦 Banking Tech Challenge - Microfrontends Architecture

![Node](https://img.shields.io/badge/Node-18.20.6-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![Next.js](https://img.shields.io/badge/Next.js-Multi--Zones-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MUI](https://img.shields.io/badge/MUI-v5-blue)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![NGINX](https://img.shields.io/badge/NGINX-Proxy-green)
![Microfrontends](https://img.shields.io/badge/Architecture-Microfrontends-green)
![Status](https://img.shields.io/badge/Status-Production--Ready-success)

> **Advanced financial management system built with microfrontends architecture, implementing all features requested in the FIAP Tech Challenge.**

**🌐 Production Application**: [http://54.233.181.19/](http://54.233.181.19/)

This application represents a complete evolution of the original project, applying advanced concepts of **Microfrontends**, **Multi-Zones**, **Containerization** and **Cloud-Native Development** to create a scalable and robust financial management solution.

---

## 🏗️ Microfrontends Architecture

### **Multi-Zone Architecture with Next.js**

The project implements a microfrontends architecture using **Next.js Multi-Zones**, dividing the application into two independent apps that can be developed, deployed and scaled separately, with **NGINX** as reverse proxy:

```
                    ┌─────────────────┐
                    │      NGINX      │
                    │ (Reverse Proxy) │
                    │   Port: 80/443  │
                    └─────────┬───────┘
                              │
              ┌───────────────┼───────────────┐
              │               │               │
              ▼               ▼               ▼
┌─────────────────┐    ┌─────────────────┐   ┌─────────────────┐
│   Banking App   │    │  Dashboard App  │   │   JSON Server   │
│   (Shell)       │    │  (Microfront)   │   │  (Mock API)     │
│   Port: 3000    │    │   Port: 3001    │   │   Port: 3002    │
└─────────┬───────┘    └─────────┬───────┘   └─────────────────┘
          │                      │
          └──────────┬───────────┘
                     │
         ┌─────────────────┐
         │  Shared Packages│
         │  (@banking/*)   │
         └─────────────────┘
```

### **NGINX (Reverse Proxy - Port 80/443)**
- **Responsibilities**: Intelligent routing, reverse proxy, SSL termination
- **Features**: Reverse proxy, Gzip compression, security headers
- **Routing**: Directs requests to the correct microfrontends based on URL

### **Banking App (Shell - Port 3000)**
- **Responsibilities**: Authentication, main pages, routing
- **Features**: Login/logout, registration, home page with financial summary
- **Proxy**: Routes `/transactions` and `/analytics` to Dashboard App

### **Dashboard App (Microfrontend - Port 3001)**
- **Responsibilities**: Transactions, analytics, financial charts
- **Features**: Transaction CRUD, advanced analysis, visualizations
- **Independence**: Can be developed and deployed separately

---

## ✅ Tech Challenge Requirements Implementation

### **1. Interface Structure and Design**

#### **✅ Updated Home Page**
- **Financial Charts**: Implementation of responsive chart visualizations
- **Detailed Analysis**: Real-time financial performance metrics
- **Responsive Dashboard**: Adaptive interface for different devices

#### **✅ Advanced Transaction Listing**
- **Advanced Filters**: By category, date, type and search term
- **Infinite Scroll**: Optimized loading for large data volumes
- **Pagination**: Efficient server-side pagination system
- **Real-time Search**: Instant search functionality

#### **✅ Add/Edit Transaction**
- **Advanced Validation**: Zod schemas + real-time validation
- **Automatic Suggestions**: Intelligent categorization based on observation
- **File Attachments**: Complete receipt and document upload system
- **Duplicate Detection**: Automatic duplicate transaction validation

### **2. Technologies and Concepts Implemented**

#### **✅ Docker & Containerization**
```dockerfile
# Multi-stage Dockerfile for optimized production
FROM node:18-alpine AS base
# Specific configurations for each microfrontend
# Build and runtime optimizations
```

#### **✅ Cloud-Native Development**
- **AWS EC2 Ready**: Configuration optimized for EC2 deployment
- **Environment Variables**: Flexible configuration for different environments
- **Security**: Cookie-based secure authentication
- **Performance**: SSR + bundle optimizations

#### **✅ Advanced React**
- **Microfrontends**: Multi-Zones architecture implemented
- **Zustand**: Optimized global state management
- **TypeScript**: Complete static typing (100% coverage)
- **SSR**: Server-Side Rendering for performance and SEO

#### **✅ Microfrontend Architecture**
- **Next.js Multi-Zones**: Communication between independent apps
- **Independent Routing**: Each app manages its own routes
- **Inter-App Communication**: Shared state via Zustand + Cookies
- **Independent Deploy**: Each microfrontend can be deployed separately on EC2

---

## 🚀 Implemented Features

### **📊 Analytics and Visualizations**
- **Interactive Charts**: Responsive charts with Recharts
- **Financial Metrics**: Savings rate, growth, largest transactions
- **Monthly Trends**: Temporal pattern analysis
- **Cash Flow**: Daily income and expense visualization

### **🔍 Advanced Filters and Search**
- **Category Filter**: Multiple selection with checkbox
- **Date Filter**: Date range with validation
- **Term Search**: Search in observations and categories
- **Type Filter**: Separation between credits and debits
- **Combined Filters**: Simultaneous application of multiple filters

### **📱 Responsive Interface**
- **Material-UI v5**: Complete and consistent design system
- **Mobile-First**: Experience optimized for mobile devices
- **Accessibility**: WCAG standards compliance
- **Dark Mode Ready**: Structure prepared for dark mode

### **🔒 Security and Authentication**
- **Cookie-based Auth**: Secure authentication system
- **User Isolation**: Data segregated by user
- **Validation**: Robust validation with Zod schemas
- **Error Handling**: Consistent error handling

---

## 🧰 Prerequisites

### **System**
- ✅ **Node.js 18.20.6** (`.nvmrc` file included)
- ✅ **pnpm** (recommended package manager)
- ✅ **Docker** (optional, for containerization)

### **Environment Setup**
```bash
# If you use NVM, apply the correct version
nvm use

# Install pnpm globally (if you don't have it)
npm install -g pnpm

# Clone the repository
git clone <repo-url>
cd frontend-tech-challenge
```

---

## 🏃‍♂️ How to Run

### **Development (Recommended)**
```bash
# Install all dependencies
pnpm install

# Start all microfrontends + json-server
pnpm run dev

# OR use the helper script
pnpm run dev:script
```

**Access URLs:**
- **Banking App (Shell)**: http://localhost:3000
- **Dashboard App**: http://localhost:3001
- **JSON Server API**: http://localhost:3001

### **Individual Execution**
```bash
# Banking app only
pnpm run dev:banking

# Dashboard app only
pnpm run dev:dashboard

# json-server only (mock database)
pnpm run dev:json
```

### **Production**
```bash
# Complete build
pnpm run build

# Individual build per app
pnpm run build:banking
pnpm run build:dashboard

# Start in production
pnpm run start
```

---

## 🐳 Docker & Containerization

### **Development with Docker**
```bash
# Start all services
docker-compose up

# Build and start
docker-compose up --build

# Detached mode
docker-compose up -d
```

#### Local environment with docker-compose

To run the **entire stack** (json-server, banking, dashboard and Nginx) locally with Docker:

1. Copy the example environment file:

   ```bash
   cp env.example .env
   ```

2. Build and start all services from the project root:

   ```bash
   docker compose up --build
   ```

   This will start:

   - `json-server` at `http://localhost:3001`
   - `banking` at `http://localhost:3000`
   - `dashboard` at `http://localhost:3002`
   - `nginx` reverse proxy at `http://localhost`

3. Access the application through Nginx (single entry point):

   - Main URL: `http://localhost`
   - Key routes:
     - `/` → Home (banking shell)
     - `/login` → Authentication
     - `/transactions` → Transactions dashboard (proxied to dashboard app)
     - `/analytics` → Analytics page (dashboard)

> **Notes:**
>
> - The Docker environment is configured to support both **HTTP and HTTPS**.
> - Because there is an automatic redirect from `http://` to `https://`, it is **mandatory** to generate the certificate (even if self-signed) for the `nginx` container to start correctly.
> - If you prefer to run **HTTP-only**, remove/comment the HTTPS server block in `nginx.conf` and the `443` port mapping in `docker-compose.yml`.
> - Healthchecks may take a few seconds during the first startup until all services are reported as `healthy`.
> - The authentication flow requires login before accessing `/transactions` and `/analytics`.

#### 🔐 HTTPS with self-signed certificate (optional)

If you want to test the environment locally over **HTTPS**, you can use a **self-signed certificate**:

1. Generate the certificate under `nginx/certs` at the project root:

   ```bash
   mkdir -p nginx/certs
   openssl req -x509 -nodes -days 365 \
     -newkey rsa:2048 \
     -keyout nginx/certs/selfsigned.key \
     -out nginx/certs/selfsigned.crt \
     -subj "/CN=localhost"
   ```

2. Start the stack with Docker Compose (already configured to mount the certs and expose port 443):

   ```bash
   docker compose up --build
   ```

3. Access the application via HTTPS:

   - `https://localhost/`

> ⚠️ **Warning:**
>
> - Because the certificate is self-signed, the browser will show a security warning. For local development, you can safely bypass it.
> - If the files `nginx/certs/selfsigned.crt` and `nginx/certs/selfsigned.key` do not exist, the `nginx` service will fail to start.
> - The self-signed certificates versioned in this repository exist **only** to facilitate academic evaluation and **must not be reused in any production environment**.
> - For production, always use a certificate issued by a trusted CA (e.g. Let's Encrypt) instead of a self-signed one.

### **Production with Docker**
```bash
# Build for production
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up
```

### **🐳 Automated Deploy Scripts**

The project includes automated scripts to facilitate production deployment:

#### **Build and Publish to Docker Hub**
```bash
# Script to build and publish all images
./scripts/build-and-push.sh <your_docker_hub_username>

# Example:
./scripts/build-and-push.sh johndoe
```

**What the script does:**
- ✅ **Image Build**: Builds images for banking, dashboard, nginx and json-server
- ✅ **Version Tagging**: Applies `latest` and version-specific tags
- ✅ **Push to Docker Hub**: Publishes all images to registry
- ✅ **Verification**: Confirms all images were published correctly

#### **Production Deploy**
```bash
# Script for automatic deploy downloading images from Docker Hub
./scripts/deploy-prod.sh <your_docker_hub_username>

# Example:
./scripts/deploy-prod.sh johndoe
```

**What the script does:**
- ✅ **Image Download**: Automatically downloads latest images from Docker Hub
- ✅ **Safe Stop**: Stops existing containers without data loss
- ✅ **Updated Deploy**: Starts new containers with updated images
- ✅ **Health Check**: Verifies all services are working
- ✅ **Logs**: Shows status and container logs

#### **Complete Deploy Flow:**
```bash
# 1. On development machine (build and push)
./scripts/build-and-push.sh myusername

# 2. On production machine (deploy)
./scripts/deploy-prod.sh myusername

# 3. Check status
docker-compose ps
```

### **Docker Structure**
```yaml
# docker-compose.yml
services:
  banking-app:     # Shell microfrontend
  dashboard-app:   # Dashboard microfrontend  
  json-server:     # Mock database
  nginx:          # Reverse proxy
```

---

## 📦 Package Structure (Monorepo)

### **Apps**
```
apps/
├── banking/          # Shell application (port 3000)
└── dashboard/        # Dashboard microfrontend (port 3001)
```

### **Shared Packages**
```
packages/
├── shared-components/  # Shared UI components
├── shared-hooks/      # Shared React hooks
├── shared-services/   # Business logic + repositories
├── shared-types/      # TypeScript types
├── shared-utils/      # Utility functions
├── shared-config/     # TypeScript configurations
└── eslint-config/     # ESLint shared configs
```

### **Workspace Configuration**
```json
// pnpm-workspace.yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | 🚀 Start all microfrontends |
| `pnpm build` | 🏗️ Production build of all apps |
| `pnpm typecheck` | 📝 TypeScript type checking |
| `pnpm lint` | 🔍 Linting of all projects |
| `pnpm clean` | 🧹 Clean node_modules and builds |
| `pnpm dev:banking` | 🏦 Banking app only |
| `pnpm dev:dashboard` | 📊 Dashboard app only |
| `pnpm dev:json` | 🗃️ json-server only |

---

## 🚀 AWS EC2 Deploy

### **🌐 Production Application**
**Application URL**: http://54.233.181.19/

### **Production Configuration**
```bash
# Build for production
pnpm run build

# Deploy via Docker on EC2
docker-compose -f docker-compose.prod.yml up -d

# Monitoring
docker-compose logs -f
```

### **AWS EC2 Setup**
- **EC2 Instance**: t3.medium or higher recommended
- **Security Groups**: Port configuration 80, 443, 3000, 3001
- **Nginx**: Reverse proxy for microfrontends

### **🔧 Nginx - Reverse Proxy**

Nginx is a fundamental component in the architecture, acting as:

#### **Nginx Features:**
- **Reverse Proxy**: Routes specific APIs to each app
- **SSL Termination**: Manages HTTPS certificates
- **Compression**: Gzip for better performance
- **Security Headers**: Automatic security headers

#### **Intelligent Routing:**
- **Main Route (/)**: Directed to Banking App (Shell)
- **Transaction Routes (/transactions, /analytics)**: Directed to Dashboard App
- **Authentication APIs**: Routed to Banking App
- **Data APIs**: Routed to Dashboard App
- **Static Assets**: Optimized cache with performance headers

#### **Implementation Benefits:**
- ✅ **Single Entry Point**: One URL (54.233.181.19) for the entire system
- ✅ **Cookie Sharing**: Shared authentication between microfrontends
- ✅ **CORS Handling**: Centralized configuration without cross-origin issues
- ✅ **Performance**: Gzip compression reduces transfer by ~70%
- ✅ **Security**: Automatic headers against XSS and clickjacking
- ✅ **Caching**: Static assets with 1-year cache
- ✅ **Intelligent Routing**: Directs requests based on URLs

#### **Production Routing:**
```bash
# EC2 routing examples:
http://54.233.181.19/              → Banking App (Shell)
http://54.233.181.19/login         → Banking App (Auth)
http://54.233.181.19/transactions  → Dashboard App (Microfrontend)
http://54.233.181.19/analytics     → Dashboard App (Microfrontend)
http://54.233.181.19/api/balance   → Dashboard App (API)
http://54.233.181.19/api/login     → Banking App (API)
```

### **Environment Variables**
```env
# .env.production
JSON_SERVER_URL=http://yourdomain.com:3001
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
```

---

## 🏗️ Architecture Details

### **Communication between Microfrontends**
- **Shared State**: Replicated Zustand store
- **Authentication**: Secure HTTP-only cookies
- **API Calls**: Axios with configured interceptors
- **Error Boundary**: Isolated error handling

### **Multi-Zone Routing**
```javascript
// Banking app (next.config.js)
async rewrites() {
  return [
    {
      source: '/transactions/:path*',
      destination: 'http://localhost:3001/transactions/:path*',
    },
    {
      source: '/analytics/:path*',
      destination: 'http://localhost:3001/analytics/:path*',
    },
  ];
}
```

### **Shared Package System**
- **@banking/shared-types**: TypeScript interfaces
- **@banking/shared-hooks**: React hooks (useTransactionStore, useAuth)
- **@banking/shared-components**: UI components (Layout, Forms, Charts)
- **@banking/shared-services**: Business logic (Repositories, Use Cases)

---

## 📊 Performance and Optimizations

### **Bundle Analysis**
- **Next.js Automatic Code Splitting**: Automatic lazy loading of pages
- **Tree Shaking**: Elimination of unused code by webpack
- **Shared Packages**: Efficient sharing via pnpm workspaces

### **Runtime Performance**
- **Memoization**: Optimized React.memo and useMemo
- **Virtual Scrolling**: For large transaction lists
- **Infinite Scroll**: Progressive data loading

### **SEO and Accessibility**
- **SSR**: Server-Side Rendering for SEO
- **Meta Tags**: Dynamic configuration
- **ARIA Labels**: Complete accessibility
- **Semantic HTML**: Correct semantic structure

---

## 📚 Advanced Features Implemented

### **🎯 Business Features**
- ✅ **Duplicate Detection**: Intelligent detection algorithm
- ✅ **Automatic Categorization**: Suggestions based on ML patterns
- ✅ **Advanced Validation**: Zod schemas + real-time validation
- ✅ **File Upload**: Complete attachment system
- ✅ **Financial Analysis**: Advanced metrics and insights

### **🔧 Technical Features**
- ✅ **Infinite Scroll**: Optimized pagination
- ✅ **Combined Filters**: Advanced filter system
- ✅ **Reactive State**: Real-time updates
- ✅ **Error Boundaries**: Graceful error recovery
- ✅ **Loading States**: Optimized UX for async operations

### **🎨 Advanced UX/UI**
- ✅ **Responsive Interfaces**: Mobile-first design
- ✅ **Micro-interactions**: Subtle animations and visual feedback
- ✅ **Design System**: Consistent and reusable components
- ✅ **Accessibility**: WCAG compliance
- ✅ **Interactive Charts**: Advanced data visualizations

---

## 🤝 Contributing

This project follows development best practices:

- **ESLint + Prettier**: Automatic code formatting
- **Husky**: Git hooks for quality
- **Conventional Commits**: Commit standards
- **TypeScript Strict**: Maximum type safety

---

## 📝 Additional Documentation

- 📖 [MICROFRONTENDS.md](./MICROFRONTENDS.md) - Quick guide and specific Multi-Zone configuration

---

## 🏆 Tech Challenge - Complete Checklist

### **✅ Mandatory Requirements**
- [x] **Microfrontends**: Multi-Zones architecture implemented
- [x] **Docker**: Complete containerization + docker-compose
- [x] **Cloud Deploy**: Configuration for AWS EC2
- [x] **Advanced React**: Hooks, Context, Performance optimization
- [x] **TypeScript**: Complete static typing
- [x] **Global State**: Zustand for state management
- [x] **SSR**: Server-Side Rendering implemented

### **✅ Advanced Features**
- [x] **Filters and Search**: Complete system implemented
- [x] **Pagination**: Infinite scroll + pagination
- [x] **Validation**: Advanced schemas + real-time validation
- [x] **Upload**: Complete attachment system
- [x] **Analytics**: Charts and financial metrics
- [x] **Responsiveness**: Mobile-first design

### **✅ Architecture and Quality**
- [x] **SOLID Principles**: Applied throughout the codebase
- [x] **Clean Architecture**: Separation of concerns
- [x] **Error Handling**: Robust error handling
- [x] **Performance**: Optimizations implemented
- [x] **Security**: Security practices applied

---

### 📽️ Video

To watch the video presentation of this project, access the link below:

[https://www.youtube.com/watch?v=Fa9JwRX2lW4](https://www.youtube.com/watch?v=Fa9JwRX2lW4)

---

## 🚀 How to run the project

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

Access [http://localhost:3000](http://localhost:3000) in your browser to view the application.

> This command runs simultaneously:

- 🟩 **Next.js** on `http://localhost:3000`
- 🟦 **json-server** (mock database) on `http://localhost:3001`
- 🔧 Script that automatically creates the `server.json` file if it doesn't exist

### ⚠️ Note

If the `server.json` file doesn't exist in the `src/pages/api/db/` folder, it will be automatically created with the following initial content:

```json
{
  "transactions": []
}
```

---

## 🗂️ Project Structure

```
├── src
│   ├── app                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page
│   │   ├── transactions
│   │   │   └── page.tsx       # Transactions page
│   │   └── ...
│   ├── pages                  # Next.js Pages Router
│   │   ├── api                # BFF - following SOLID principles
│   │   │   ├── balance
│   │   │   └── transactions
│   │   └── ...
│   ├── components
│   ├── hooks
│   ├── services
│   ├── types
│   └── utils
├── scripts
│   └── initServerJson.js      # Creates server.json automatically
├── .nvmrc                     # Node 18.20.6
├── package.json
```

---

## 🔗 BFF Endpoints

The following endpoints have been implemented:

- `GET /api/balance`  
  Returns the user's **total balance** based on all their transactions.

- `GET /api/transactions`  
  Lists all registered transactions.

- `POST /api/transactions`  
  Creates a new transaction.

- `PATCH /api/transactions/:id`  
  Edits an existing transaction (supports partial updates).

- `DELETE /api/transactions/:id`  
  Deletes a transaction.

### 🔐 Data validation

Field validation when creating or editing a transaction is done at **runtime** using **Zod**, ensuring data integrity.

### 🌎 Global state

**Zustand** was used for global state management in the frontend, through the custom hook `useTransactionStore`, which allows:

- Fetch transactions
- Calculate and get balance
- Add, edit or remove transactions reactively

---

## 🗃️ Architecture Principles

Application built applying **SOLID** principles in the BFF layer:

- 🔸 **S** — Single Responsibility
- 🔸 **O** — Open/Closed (open for extension, closed for modification)
- 🔸 **L** — Liskov Substitution
- 🔸 **I** — Interface Segregation
- 🔸 **D** — Dependency Inversion

The API layer (`/pages/api`) acts as a **BFF**, isolating business rules and abstracting access to the mock database (`json-server`).

---

## 🚧 Useful Scripts

| Script  | Description                                                                                |
| ------- | ------------------------------------------------------------------------------------------ |
| `dev`   | Runs **Next.js**, **json-server** and initialization script together via `concurrently`    |
| `build` | Creates production build                                                                   |
| `start` | Runs production build                                                                      |
| `lint`  | Runs linter (ESLint)                                                                       |

### **🐳 Deploy Scripts**
| Script  | Description                                                                                |
| ------- | ------------------------------------------------------------------------------------------ |
| `./scripts/build-and-push.sh` | 🏗️ Build and push Docker images to Docker Hub |
| `./scripts/deploy-prod.sh` | 🚀 Production deploy downloading images from Docker Hub |
| `./scripts/dev.sh` | 🛠️ Helper script for local development |
| `./scripts/stop.sh` | ⏹️ Stop all Docker containers |

> 🔥 The `prepare-server-json` script **doesn't need to be run manually**, as it's already part of the `dev` flow.

---

**Status**: ✅ **Production Ready** - Complete project ready for production with microfrontends architecture implemented for FIAP Tech Challenge.
