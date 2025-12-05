# @banking/shared-types

> **Enterprise Type Definitions & Domain Layer**

Comprehensive TypeScript type definitions implementing Domain-Driven Design with Value Objects, Result patterns, and enterprise-grade type safety.

## 🏗️ Architecture Overview

```
@banking/shared-types/
├── src/
│   ├── index.ts                   # Main exports
│   ├── Result.ts                  # Result pattern for error handling
│   ├── domain/                    # Domain Layer
│   │   ├── index.ts              # Domain exports
│   │   ├── IValueObject.ts       # Base Value Object interface
│   │   └── value-objects/        # Domain Value Objects
│   │       ├── Money.ts          # Monetary values
│   │       ├── Email.ts          # Email addresses
│   │       └── DateRange.ts      # Date ranges
│   └── Transaction.ts             # Core domain types
└── package.json
```

## 🎯 Key Features

### **Domain-Driven Design**
```typescript
// Value Objects with rich business logic
const money = Money.create(1234.56, 'USD');
if (money.success) {
  money.data.add(otherMoney);      // Safe arithmetic
  money.data.format('pt-BR');      // Localized formatting
  money.data.convertTo('EUR');     // Currency conversion
}
```

### **Result Pattern**
```typescript
// Type-safe error handling without exceptions
const result = await createTransaction(data);
if (result.success) {
  console.log(result.data); // Success data
} else {
  console.log(result.error); // Error details
}
```

### **Enterprise Type Safety**
```typescript
// Comprehensive type definitions
interface TransactionQuery {
  pagination: PaginationOptions;
  sort?: SortOptions;
  filters?: FilterOptions;
  search?: SearchOptions;
}

interface PaginatedTransactionResult {
  transactions: Transaction[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## 📦 Core Types

### **Transaction Domain**
```typescript
interface Transaction {
  id: string;
  date: string;
  amount: number;
  observation?: string;
  type: TransactionType;
  file?: string | null;
  fileName?: string | null;
  categories: string[];
  userEmail?: string;
}

type TransactionType = 'credit' | 'debit';
```

### **Query Objects (Clean Architecture)**
```typescript
interface PaginationOptions {
  page: number;
  limit: number;
}

interface SortOptions {
  sortBy: 'date' | 'amount' | 'description';
  order: 'asc' | 'desc';
}

interface FilterOptions {
  type?: TransactionType;
  categories?: string[];
  includeUncategorized?: boolean;
  startDate?: string;
  endDate?: string;
}

interface SearchOptions {
  query?: string;
  fields?: string[];
}

interface TransactionQuery {
  pagination: PaginationOptions;
  sort?: SortOptions;
  filters?: FilterOptions;
  search?: SearchOptions;
}
```

### **User & Authentication**
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userName: string;
}
```

## 🎯 Value Objects

### **Money Value Object**
```typescript
import { Money } from '@banking/shared-types';

// Creation with validation
const money = Money.create(100.50, 'USD');

if (money.success) {
  const amount = money.data;

  // Arithmetic operations
  const sum = amount.add(otherMoney);
  const difference = amount.subtract(otherMoney);

  // Currency operations
  const converted = amount.convertTo('EUR');
  const formatted = amount.format('en-US');

  // Validations
  if (amount.isPositive()) {
    console.log('Positive amount');
  }

  // Business logic
  const isLargeAmount = amount.isGreaterThan(1000);
}
```

### **DateRange Value Object**
```typescript
import { DateRange } from '@banking/shared-types';

const dateRange = DateRange.create(
  new Date('2024-01-01'),
  new Date('2024-12-31')
);

if (dateRange.success) {
  const range = dateRange.data;

  // Date operations
  const contains = range.contains(new Date('2024-06-15'));
  const overlaps = range.overlaps(otherRange);
  const duration = range.durationInDays;

  // Extensions
  const extended = range.extend(7); // +7 days

  // Formatting
  const isoString = range.toISOString();
}
```

### **Email Value Object**
```typescript
import { Email } from '@banking/shared-types';

const email = Email.create('user@example.com');

if (email.success) {
  const emailAddress = email.data;

  // Validations
  const isValid = emailAddress.isValid();
  const isBusiness = emailAddress.isBusinessEmail();
  const isDisposable = emailAddress.isDisposable();

  // Operations
  const masked = emailAddress.mask(); // u***@example.com
  const domain = emailAddress.getDomain();

  // External integrations
  const gravatarUrl = emailAddress.getGravatarUrl(80);
}
```

## 🔧 Advanced Patterns

### **Result Pattern for Error Handling**
```typescript
import { Result, success, failure, tryAsync } from '@banking/shared-types';

// Custom result handling
async function createTransaction(data: CreateTransactionData): Promise<Result<Transaction>> {
  try {
    // Business logic
    const transaction = new Transaction(data);
    return success(transaction);
  } catch (error) {
    return failure(error instanceof Error ? error : new Error('Unknown error'));
  }
}

// Safe async operations
const safeResult = await tryAsync(() => api.getData());
if (safeResult.success) {
  console.log(safeResult.data);
} else {
  console.error(safeResult.error);
}

// Helper functions
const data = ResultFactory.getData(safeResult); // Throws if error
const error = ResultFactory.getError(safeResult); // Returns error or null
```

### **Base Value Object Implementation**
```typescript
import { BaseValueObject } from '@banking/shared-types';

// Custom Value Object
class CustomId extends BaseValueObject<string> {
  constructor(value: string) {
    super(value, (val) => {
      if (!val.match(/^[A-Z]{2}\d{6}$/)) {
        return ['Invalid ID format'];
      }
      return [];
    });
  }

  isValid(): boolean {
    return this._value.match(/^[A-Z]{2}\d{6}$/) !== null;
  }

  getPrefix(): string {
    return this._value.substring(0, 2);
  }
}
```

## 📦 Usage Examples

### **Transaction Queries**
```typescript
import { TransactionQuery, TransactionQueryBuilder } from '@banking/shared-types';

// Direct query construction
const query: TransactionQuery = {
  pagination: { page: 1, limit: 20 },
  sort: { sortBy: 'date', order: 'desc' },
  filters: {
    type: 'debit',
    categories: ['Food', 'Transport'],
    startDate: '2024-01-01',
    endDate: '2024-12-31'
  },
  search: {
    query: 'restaurant',
    fields: ['description', 'categories']
  }
};

// Using Builder Pattern (from shared-services)
const builtQuery = new TransactionQueryBuilder()
  .page(1)
  .limit(20)
  .sortBy('date', 'desc')
  .filterByType('debit')
  .filterByCategories(['Food', 'Transport'])
  .searchByText('restaurant')
  .build();
```

### **API Response Types**
```typescript
import { PaginatedTransactionResult } from '@banking/shared-types';

async function fetchTransactions(query: TransactionQuery): Promise<PaginatedTransactionResult> {
  const response = await api.post('/transactions/search', query);

  return {
    transactions: response.data.transactions,
    total: response.data.total,
    page: query.pagination.page,
    totalPages: Math.ceil(response.data.total / query.pagination.limit),
    hasNextPage: query.pagination.page < Math.ceil(response.data.total / query.pagination.limit),
    hasPreviousPage: query.pagination.page > 1
  };
}
```

### **Form Validation Types**
```typescript
import { Transaction, TransactionFormInput } from '@banking/shared-types';

// Form input type (partial, no id)
const formData: TransactionFormInput = {
  type: 'debit',
  date: '2024-01-15',
  amount: 25.50,
  observation: 'Lunch'
};

// Complete transaction (with system-generated id)
const transaction: Transaction = {
  id: generateId(),
  ...formData,
  categories: ['Food'],
  userEmail: getCurrentUser().email
};
```

## 🧠 Technical Specifications

### **Type Safety**
- **Strict Mode**: 100% TypeScript strict mode compliance
- **Generic Constraints**: Type-safe generic implementations
- **Discriminated Unions**: Compile-time type narrowing
- **Template Literal Types**: String literal type safety

### **Domain Modeling**
- **Value Objects**: Immutable objects with business logic
- **Entity Equality**: Proper equality implementations
- **Validation Rules**: Business rule validation
- **Rich Behavior**: Methods that model business operations

### **Error Handling**
- **Result Type**: Type-safe error handling
- **Exception Prevention**: No exceptions for business logic
- **Error Composition**: Composable error handling
- **Validation Results**: Detailed validation feedback

## 📚 Package Dependencies

```json
{
  "dependencies": {
    "zod": "^3.23.8"
  }
}
```

## 🎯 Integration

Essential for all packages in the monorepo:
- **@banking/shared-services**: Business logic uses these types
- **@banking/shared-hooks**: React hooks typed with these definitions
- **@banking/shared-components**: UI components with proper typing
- **apps/banking**: Shell application types
- **apps/dashboard**: Microfrontend types

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

### **Type Safety**
```typescript
// ✅ Good: Use discriminated unions
type Result<T, E> =
  | { success: true; data: T }
  | { success: false; error: E };

// ✅ Good: Use branded types for primitives
type UserId = string & { readonly brand: unique symbol };

// ❌ Avoid: Loose any types
function processData(data: any): any { /* ... */ }
```

### **Value Objects**
```typescript
// ✅ Good: Immutable operations
const newMoney = money.add(otherMoney);

// ❌ Avoid: Direct mutation
money._value += otherMoney._value;
```

### **Error Handling**
```typescript
// ✅ Good: Result pattern
const result = await operation();
if (result.success) {
  // Handle success
} else {
  // Handle error
}

// ❌ Avoid: Try/catch for business logic
try {
  await operation();
} catch (error) {
  // This should use Result pattern instead
}
```

## 📖 Documentation

- **Architecture Details**: See `ARQUITETURA_IMPLEMENTADA.md`
- **API Reference**: Inline TypeScript documentation
- **Design Patterns**: Domain-Driven Design patterns
- **Migration Guide**: Upgrading from loose types

---

**Enterprise-grade type definitions for modern financial applications** 🏷️🏦