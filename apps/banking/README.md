# Banking App - Shell Microfrontend

> **Next.js Multi-Zone Shell Application with Enterprise Authentication**

Main shell application providing authentication, routing, and core functionality for the banking microfrontend architecture.

## 🏗️ Architecture Overview

```
apps/banking/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx              # Home page with financial overview
│   │   ├── login/                # Authentication pages
│   │   ├── register/             # User registration
│   │   ├── layout.tsx            # Root layout
│   │   └── api/                  # API endpoints (BFF)
│   │       ├── login/            # Authentication API
│   │       ├── register/         # User registration API
│   │       ├── balance/          # Balance calculation API
│   │       └── auth/             # Session management API
│   ├── components/               # UI components
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilities and configurations
│   └── styles/                   # Styling
├── public/                       # Static assets
├── next.config.js               # Next.js configuration with rewrites
├── package.json
└── README.md
```

## 🎯 Key Features

### **Shell Application Responsibilities**
- **Authentication**: Login, logout, session management
- **Routing**: Main navigation and microfrontend routing
- **Layout**: Consistent UI shell and navigation
- **API Gateway**: Proxy requests to appropriate microfrontends
- **State Management**: Global state coordination

### **Multi-Zone Configuration**
```javascript
// next.config.js
module.exports = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      // Route transactions to dashboard microfrontend
      {
        source: '/transactions/:path*',
        destination: 'http://localhost:3002/transactions/:path*',
      },
      {
        source: '/analytics/:path*',
        destination: 'http://localhost:3002/analytics/:path*',
      },
      // Route specific APIs
      {
        source: '/api/transactions/:path*',
        destination: 'http://localhost:3002/api/transactions/:path*',
      },
      {
        source: '/api/balance/:path*',
        destination: 'http://localhost:3002/api/balance/:path*',
      },
    ];
  },
};
```

### **Authentication Flow**
```typescript
// Using enterprise state machine
import { useAuthStateMachine } from '@banking/shared-hooks';

function AuthProvider() {
  const {
    currentState,
    isAuthenticated,
    login,
    logout,
    isSessionValid
  } = useAuthStateMachine();

  const handleLogin = async (credentials: LoginCredentials) => {
    await login(credentials.userName, credentials.password);
  };

  // Session validation and auto-renewal
  useEffect(() => {
    const checkSession = () => {
      if (isAuthenticated && !isSessionValid()) {
        logout();
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated, isSessionValid, logout]);
}
```

## 📦 Usage Examples

### **Authentication Components**
```typescript
import { AuthStateMachine } from '@banking/shared-hooks';

function LoginPage() {
  const { login, error, currentState } = useAuthStateMachine();

  const handleSubmit = async (formData: FormData) => {
    const userName = formData.get('userName') as string;
    const password = formData.get('password') as string;

    try {
      await login(userName, password);
      // Redirect handled by state machine
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Login form implementation */}
    </form>
  );
}
```

### **Financial Overview Dashboard**
```typescript
import { useFinancialAnalytics } from '@banking/shared-hooks';

function HomePage() {
  const {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    topCategories,
    recentTransactions
  } = useFinancialAnalytics();

  return (
    <div>
      <FinancialSummary
        income={totalIncome}
        expenses={totalExpenses}
        balance={balance}
        savingsRate={savingsRate}
      />
      <CategoryBreakdown categories={topCategories} />
      <RecentTransactions transactions={recentTransactions} />
    </div>
  );
}
```

### **Navigation with Microfrontend Routing**
```typescript
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function Navigation() {
  const router = useRouter();

  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/transactions">Transactions</Link>
      <Link href="/analytics">Analytics</Link>

      {/* Programmatic navigation */}
      <button onClick={() => router.push('/transactions')}>
        View Transactions
      </button>
    </nav>
  );
}
```

### **API Endpoints (BFF)**
```typescript
// src/app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@banking/shared-services';

export async function GET(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.json({ error: 'No session' }, { status: 401 });
  }

  const authService = new AuthService();
  const isValid = await authService.validateSession(session.value);

  return NextResponse.json({ valid: isValid });
}

// src/app/api/balance/route.ts
export async function GET(request: NextRequest) {
  const session = request.cookies.get('session');

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const balanceService = new BalanceService();
  const balance = await balanceService.calculateBalance(session.value);

  return NextResponse.json({ balance });
}
```

## 🔧 Technical Specifications

### **Next.js Configuration**
- **App Router**: Modern Next.js routing system
- **Server Components**: SSR for performance and SEO
- **API Routes**: Backend-for-Frontend (BFF) pattern
- **Middleware**: Request interception and authentication

### **Authentication Integration**
- **State Machine**: Enterprise authentication flow
- **Session Management**: Secure HTTP-only cookies
- **Auto-renewal**: Automatic session extension
- **Security**: CSRF protection and secure headers

### **Microfrontend Communication**
- **Proxy Routing**: Seamless routing to dashboard app
- **Cookie Sharing**: Authentication state across microfrontends
- **API Gateway**: Centralized API request handling
- **Error Boundaries**: Isolated error handling

### **Performance Optimizations**
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Optimized dependencies
- **Caching**: Strategic caching strategies

## 🚀 Development

### **Local Development**
```bash
# Install dependencies
pnpm install

# Start banking app (port 3000)
pnpm dev

# Or run specific app
pnpm dev:banking
```

### **Environment Variables**
```env
# .env.local
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
JSON_SERVER_URL=http://localhost:3001
DASHBOARD_URL=http://localhost:3002
```

### **Development Workflow**
```bash
# Start all services
pnpm dev

# This will start:
# - Banking app (shell) on http://localhost:3000
# - Dashboard app (microfrontend) on http://localhost:3002
# - JSON Server (mock DB) on http://localhost:3001
```

## 📚 Integration

### **Shared Packages**
```typescript
// Using shared types
import { Transaction, User } from '@banking/shared-types';

// Using shared hooks
import { useAuthStateMachine, useTransactionStore } from '@banking/shared-hooks';

// Using shared services
import { AuthService, BalanceService } from '@banking/shared-services';

// Using shared components
import { Layout, Button, Card } from '@banking/shared-components';
```

### **Microfrontend Communication**
```typescript
// Navigation to microfrontend
<Link href="/transactions">
  Go to Transactions (Dashboard App)
</Link>

// API calls proxied to microfrontend
const response = await fetch('/api/transactions');
// This routes to: http://localhost:3002/api/transactions
```

## 🧪 Testing

### **Type Checking**
```bash
# Type checking for banking app
pnpm typecheck:banking

# Type checking for all packages
pnpm typecheck
```

### **Build Verification**
```bash
# Build banking app
pnpm build:banking

# Build all apps
pnpm build
```

## 🚀 Deployment

### **Production Build**
```bash
# Build for production
pnpm build:banking

# Start production server
pnpm start:banking
```

### **Docker Deployment**
```bash
# Build Docker image
docker build -t banking-app .

# Run with Docker
docker run -p 3000:3000 banking-app
```

### **Environment Configuration**
```env
# Production environment
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
JSON_SERVER_URL=https://api.yourdomain.com
DASHBOARD_URL=https://dashboard.yourdomain.com
```

## 📊 Monitoring & Analytics

### **Error Tracking**
```typescript
// Error boundary implementation
class AppErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Shell App Error:', error, errorInfo);
    // Report to monitoring service
  }
}
```

### **Performance Monitoring**
```typescript
// Performance tracking
import { performance } from 'perf_hooks';

const startTime = performance.now();
// ... operation
const endTime = performance.now();
console.log(`Operation took ${endTime - startTime} milliseconds`);
```

## 📖 Best Practices

### **Authentication**
```typescript
// ✅ Good: Use state machine for auth flow
const { login, logout, isAuthenticated } = useAuthStateMachine();

// ✅ Good: Protect routes with middleware
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuthStateMachine();
  return isAuthenticated ? children : <Login />;
}
```

### **API Handling**
```typescript
// ✅ Good: Use shared services
const authService = new AuthService();
const result = await authService.login(credentials);

// ✅ Good: Handle errors gracefully
try {
  const data = await apiCall();
  setData(data);
} catch (error) {
  setError(error.message);
}
```

### **Performance**
```typescript
// ✅ Good: Use dynamic imports for large components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>
});

// ✅ Good: Memoize expensive calculations
const expensiveValue = useMemo(() => calculateExpensiveValue(data), [data]);
```

## 📖 Documentation

- **Enterprise Architecture**: `ARQUITETURA_IMPLEMENTADA.md`
- **Microfrontend Guide**: `MICROFRONTENDS.md`
- **API Documentation**: Inline JSDoc comments
- **Deployment Guide**: Docker and production setup

---

**Shell application for enterprise banking microfrontend architecture** 🏦🐚