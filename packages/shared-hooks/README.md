# @banking/shared-hooks

> **Advanced React Hooks with Enterprise Patterns**

Modern React hooks implementing state management, authentication, and middleware patterns with enterprise-grade architecture.

## 🏗️ Architecture Overview

```
@banking/shared-hooks/
├── src/
│   ├── useTransactionStore.ts     # Enhanced Zustand store
│   ├── useEnhancedTransactionStore.ts  # Store with middleware pipeline
│   ├── useAuthStateMachine.ts     # State machine for auth
│   ├── useFinancialAnalytics.ts   # Analytics hooks
│   ├── AuthContext.ts             # Authentication context
│   ├── state-machine/             # State machine implementation
│   │   ├── AuthStateMachine.ts
│   │   └── StateMachine.ts
│   ├── middleware/                # Middleware pipeline
│   │   ├── MiddlewarePipeline.ts
│   │   ├── IMiddleware.ts
│   │   └── transaction/
│   │       ├── LoggingMiddleware.ts
│   │       ├── CacheMiddleware.ts
│   │       ├── PersistenceMiddleware.ts
│   │       └── PerformanceMiddleware.ts
│   └── index.ts
└── package.json
```

## 🎯 Key Features

### **Enhanced State Management**
```typescript
import { createEnhancedTransactionStore } from '@banking/shared-hooks';

// Store with middleware pipeline
const useTransactionStore = createEnhancedTransactionStore();

// Use in components
const {
  transactions,
  balance,
  loading,
  fetchTransactions,
  createTransaction,
  getMiddlewareStats,
  clearCache
} = useTransactionStore();
```

### **State Machine Authentication**
```typescript
import { useAuthStateMachine } from '@banking/shared-hooks';

const {
  currentState,
  isAuthenticated,
  isGuest,
  isLocked,
  user,
  login,
  logout,
  enterGuestMode,
  isSessionValid,
  getPossibleTransitions
} = useAuthStateMachine();
```

### **Middleware Pipeline**
```typescript
// Available middlewares
- LoggingMiddleware:      Structured logging with sanitization
- CacheMiddleware:       Intelligent caching with TTL
- PersistenceMiddleware: LocalStorage persistence
- PerformanceMiddleware: Performance monitoring and analytics
```

### **Financial Analytics**
```typescript
import { useFinancialAnalytics } from '@banking/shared-hooks';

const {
  totalIncome,
  totalExpenses,
  balance,
  savingsRate,
  topCategories,
  monthlyTrends,
  spendingInsights
} = useFinancialAnalytics();
```

## 📦 Usage Examples

### **Transaction Management**
```typescript
import { useTransactionStore } from '@banking/shared-hooks';

function TransactionManager() {
  const {
    transactions,
    loading,
    fetchTransactions,
    createTransaction
  } = useTransactionStore();

  // Fetch with complex query
  const handleFetch = async () => {
    await fetchTransactions(1, 20, 'date', 'desc', 'debit');
  };

  // Create new transaction
  const handleCreate = async (data) => {
    await createTransaction(data);
  };

  return (
    <div>
      {/* Component implementation */}
    </div>
  );
}
```

### **Authentication Flow**
```typescript
import { useAuthStateMachine } from '@banking/shared-hooks';

function AuthManager() {
  const {
    currentState,
    isAuthenticated,
    login,
    logout,
    isSessionValid,
    error
  } = useAuthStateMachine();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials.userName, credentials.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout</button>
      ) : (
        <LoginForm onSubmit={handleLogin} />
      )}
    </div>
  );
}
```

### **Advanced Store Configuration**
```typescript
import {
  createEnhancedTransactionStore,
  LoggingMiddleware,
  CacheMiddleware,
  PersistenceMiddleware
} from '@banking/shared-hooks';

// Custom middleware configuration
const createStore = () => {
  const pipeline = new MiddlewarePipeline('CustomStore')
    .add(new LoggingMiddleware({
      enabled: process.env.NODE_ENV === 'development',
      logLevel: 'info'
    }))
    .add(new CacheMiddleware({
      defaultTTL: 10 * 60 * 1000, // 10 minutes
      maxSize: 100
    }))
    .add(new PersistenceMiddleware('custom', {
      storageKey: 'custom_app_state',
      enabled: true
    }));

  return createEnhancedTransactionStore(pipeline);
};
```

## 🧠 Advanced Patterns

### **Middleware Pipeline Architecture**
```typescript
interface IMiddleware<T, S> {
  name: string;
  execute(config: T): S;
  shouldExecute(context: IMiddlewareContext): boolean;
  updateConfig(config: Partial<IMiddlewareConfig>): void;
}

// Custom middleware example
class CustomAnalyticsMiddleware implements IMiddleware {
  name = 'CustomAnalytics';

  execute(config: TransactionState): TransactionState {
    // Analytics logic
    return config;
  }

  shouldExecute(context): boolean {
    return context.action !== 'analytics';
  }
}
```

### **State Machine Implementation**
```typescript
// States: Unauthenticated → Authenticating → Authenticated → Locked
// Events: LOGIN_REQUEST → LOGIN_SUCCESS/LOGIN_FAILURE → SESSION_TIMEOUT

const stateMachine = useAuthStateMachine();

// Check possible transitions
const possibleTransitions = stateMachine.getPossibleTransitions();

// Execute transition with validation
if (stateMachine.canTransition('LOGIN_REQUEST')) {
  await stateMachine.transition('LOGIN_REQUEST', credentials);
}
```

### **Performance Monitoring**
```typescript
// Built-in performance tracking
const {
  getPerformanceReport,
  getMiddlewareStats
} = useTransactionStore();

// Generate performance report
const report = getPerformanceReport();
console.log('Average execution time:', report.averageExecutionTime);
console.log('Slow operations:', report.slowActions);

// Middleware statistics
const stats = getMiddlewareStats();
console.log('Cache hit rate:', stats.cache.hitRate);
console.log('Persistence quota usage:', stats.persistence.quotaUsed);
```

## 🔧 Technical Specifications

### **State Management**
- **Zustand**: Lightweight, fast state management
- **Middleware Pipeline**: Extensible architecture
- **Persistence**: LocalStorage with SSR safety
- **Caching**: Intelligent cache with TTL
- **Logging**: Structured logging with sanitization

### **Type Safety**
- **Strict TypeScript**: Complete type coverage
- **Generic Hooks**: Type-safe generic implementations
- **Interface Contracts**: Well-defined interfaces
- **Error Boundaries**: Type-safe error handling

### **Performance**
- **Optimizations**: Memoization and selective updates
- **Lazy Loading**: On-demand state initialization
- **Memory Management**: Efficient memory usage
- **Bundle Size**: Tree-shakeable exports

### **Security**
- **Session Management**: Secure session handling
- **Data Sanitization**: Automatic PII sanitization
- **Input Validation**: Comprehensive validation
- **XSS Prevention**: Built-in XSS protection

## 📚 Package Dependencies

```json
{
  "dependencies": {
    "@banking/shared-types": "workspace:*",
    "@banking/shared-utils": "workspace:*",
    "zustand": "^5.0.4",
    "axios": "^1.9.0"
  }
}
```

## 🎯 Integration

Seamlessly integrates with:
- **@banking/shared-services**: Business logic layer
- **@banking/shared-types**: Type definitions
- **@banking/shared-components**: UI components
- **@banking/shared-utils**: Utility functions

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Type checking
pnpm typecheck

# Build
pnpm build
```

## 📖 Best Practices

### **State Management**
```typescript
// ✅ Good: Selective state subscription
const transactions = useTransactionStore(state => state.transactions);

// ❌ Avoid: Subscribing to entire store when not needed
const store = useTransactionStore();
```

### **Middleware Configuration**
```typescript
// ✅ Good: Environment-specific middleware
const middleware = process.env.NODE_ENV === 'development'
  ? [new LoggingMiddleware(), new CacheMiddleware()]
  : [new CacheMiddleware(), new PersistenceMiddleware()];
```

### **Error Handling**
```typescript
// ✅ Good: Graceful error handling
try {
  await login(credentials);
} catch (error) {
  // Handle specific error types
  if (error instanceof SessionExpiredError) {
    redirectToLogin();
  } else {
    showGenericError();
  }
}
```

## 📖 Documentation

- **Architecture Details**: See `ARQUITETURA_IMPLEMENTADA.md`
- **API Reference**: Inline TypeScript documentation
- **Examples**: Component integration examples
- **Migration Guide**: Upgrading from previous versions

---

**Enterprise-grade React hooks for modern financial applications** ⚛️🏦