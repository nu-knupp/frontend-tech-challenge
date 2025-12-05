# @banking/shared-services

> **Business Logic & Clean Architecture Implementation**

Enterprise-grade business logic layer implementing Clean Architecture, CQRS, and Domain-Driven Design patterns.

## 🏗️ Architecture Overview

```
@banking/shared-services/
├── src/
│   ├── usecases/              # Application Layer
│   │   ├── ListTransactionsUseCase.ts
│   │   ├── CreateTransactionUseCase.ts
│   │   └── ...
│   ├── repositories/          # Infrastructure Layer
│   │   ├── ListTransactionsRepository.ts
│   │   └── ...
│   ├── cqrs/                  # CQRS Pattern
│   │   ├── Bus.ts
│   │   ├── commands/
│   │   ├── queries/
│   │   └── handlers/
│   ├── builders/              # Builder Pattern
│   │   └── TransactionQueryBuilder.ts
│   ├── features/              # Feature Modules
│   │   ├── transactions/
│   │   ├── auth/
│   │   └── analytics/
│   ├── di/                    # Dependency Injection
│   │   ├── ServiceContainer.ts
│   │   └── decorators.ts
│   └── interfaces/            # Contracts
│       ├── IListTransactionsRepository.ts
│       └── ...
└── package.json
```

## 🎯 Key Features

### **Clean Architecture Implementation**
- **Separation of Concerns**: Clear boundaries between layers
- **Dependency Inversion**: Abstractions over concretions
- **Single Responsibility**: Each class has one reason to change

### **CQRS Pattern**
```typescript
// Commands - Write operations
new CreateTransactionCommand(data)
new UpdateTransactionCommand(id, data)

// Queries - Read operations
new GetTransactionsQuery(query)
new GetBalanceQuery()

// Bus execution
await bus.dispatch(createCommand);
const result = await bus.query(balanceQuery);
```

### **Builder Pattern**
```typescript
const query = new TransactionQueryBuilder()
  .page(1)
  .limit(10)
  .sortBy('date', 'desc')
  .filterByType('credit')
  .filterByCategories(['Income'])
  .build();
```

### **Feature Modules**
Domain-driven organization by business capabilities:
- **TransactionFeatureModule**: CRUD and financial operations
- **AuthFeatureModule**: Authentication and security
- **AnalyticsFeatureModule**: Financial insights and reporting

### **Dependency Injection**
```typescript
// Service registration
container
  .register('IListTransactionsRepository', ListTransactionsRepository)
  .register('ITransactionService', TransactionService, { lifetime: 'singleton' });

// Resolution with decorators
@Injectable()
class TransactionService {
  constructor(
    @Inject('IListTransactionsRepository') private repo: IListTransactionsRepository
  ) {}
}
```

## 📦 Usage Examples

### **Transaction Management**
```typescript
import {
  ListTransactionsUseCase,
  CreateTransactionUseCase,
  TransactionQueryBuilder
} from '@banking/shared-services';

// Create use case with repository
const listUseCase = new ListTransactionsUseCase(
  new ListTransactionsRepository()
);

// Build complex query
const query = new TransactionQueryBuilder()
  .page(1)
  .limit(20)
  .sortBy('date', 'desc')
  .filterByType('debit')
  .filterByDateRange('2024-01-01', '2024-12-31')
  .build();

// Execute query
const result = await listUseCase.execute(query);
```

### **CQRS Command/Query**
```typescript
import { Bus, CreateTransactionCommand, GetTransactionsQuery } from '@banking/shared-services';

const bus = new Bus();

// Create transaction
const createCommand = new CreateTransactionCommand({
  amount: 100,
  type: 'debit',
  observation: 'Coffee shop'
});

await bus.dispatch(createCommand);

// Query transactions
const query = new GetTransactionsQuery(queryBuilder.build());
const result = await bus.query(query);
```

### **Feature Module Initialization**
```typescript
import {
  TransactionFeatureModule,
  ServiceRegistry
} from '@banking/shared-services';

const registry = new ServiceRegistry();

// Register feature modules
registry.register(new TransactionFeatureModule());
registry.register(new AuthFeatureModule());

// Initialize all modules
await registry.initializeAll();
```

## 🧠 Design Patterns Applied

### **Command Query Responsibility Segregation (CQRS)**
- Separation of read/write operations
- Optimized data models for different use cases
- Scalable architecture for complex systems

### **Builder Pattern**
- Fluent interface for complex object construction
- Step-by-step validation
- Readable and maintainable code

### **Repository Pattern**
- Abstraction of data access logic
- Testable implementations with mocks
- Consistent interface across data sources

### **Service Locator Pattern**
- Centralized dependency management
- Loose coupling between components
- Runtime dependency resolution

## 🔧 Technical Specifications

### **Type Safety**
- **Strict TypeScript**: 100% type coverage
- **Generic Constraints**: Type-safe generic implementations
- **Interface Segregation**: Focused, cohesive interfaces

### **Error Handling**
- **Result Pattern**: Type-safe error handling
- **Validation**: Comprehensive input validation
- **Graceful Degradation**: Fallback mechanisms

### **Performance**
- **Lazy Loading**: On-demand module initialization
- **Caching**: Strategic caching for frequently accessed data
- **Optimization**: Efficient algorithms and data structures

## 📚 Package Dependencies

```json
{
  "dependencies": {
    "@banking/shared-types": "workspace:*",
    "axios": "^1.9.0",
    "uuid": "^10.0.0",
    "zod": "^3.23.8",
    "reflect-metadata": "^0.2.2"
  }
}
```

## 🎯 Integration

This package integrates seamlessly with:
- **@banking/shared-hooks**: React hooks for state management
- **@banking/shared-types**: TypeScript type definitions
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

## 📖 Documentation

- **Architecture Details**: See `ARQUITETURA_IMPLEMENTADA.md`
- **API Reference**: See inline TypeScript documentation
- **Examples**: Check `/examples` directory for usage patterns

---

**Enterprise-ready business logic layer for modern financial applications** 🏦