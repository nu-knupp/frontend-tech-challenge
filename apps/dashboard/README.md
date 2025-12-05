# Dashboard App - Transaction Microfrontend

> **Next.js Microfrontend with Advanced Transaction Management and Analytics**

Specialized microfrontend handling transaction management, financial analytics, and data visualization with enterprise-grade architecture.

## 🏗️ Architecture Overview

```
apps/dashboard/
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx              # Dashboard home
│   │   ├── transactions/          # Transaction management
│   │   │   ├── page.tsx          # Transaction listing
│   │   │   ├── create/           # Create transaction
│   │   │   ├── edit/             # Edit transaction
│   │   │   └── [id]/             # Transaction details
│   │   ├── analytics/             # Financial analytics
│   │   │   ├── page.tsx          # Analytics overview
│   │   │   ├── trends/           # Spending trends
│   │   │   └── reports/          # Financial reports
│   │   ├── layout.tsx            # Layout for dashboard
│   │   └── api/                  # API endpoints
│   │       ├── transactions/     # Transaction CRUD
│   │       ├── balance/          # Balance calculations
│   │       └── analytics/        # Analytics data
│   ├── components/               # UI components
│   │   ├── transactions/         # Transaction components
│   │   ├── analytics/            # Analytics components
│   │   ├── charts/               # Data visualization
│   │   └── forms/                # Form components
│   ├── hooks/                    # Custom hooks
│   ├── lib/                      # Utilities and configurations
│   └── styles/                   # Styling
├── public/                       # Static assets
├── next.config.js               # Next.js configuration
├── package.json
└── README.md
```

## 🎯 Key Features

### **Transaction Management**
- **CRUD Operations**: Complete transaction lifecycle
- **Advanced Filtering**: Multi-criteria filtering system
- **Real-time Search**: Instant search across transactions
- **Bulk Operations**: Batch processing capabilities
- **File Attachments**: Receipt and document management

### **Financial Analytics**
- **Interactive Charts**: Dynamic data visualization
- **Spending Insights**: AI-powered spending analysis
- **Trend Analysis**: Financial trend identification
- **Category Breakdown**: Detailed category analytics
- **Budget Tracking**: Personalized budget management

### **Data Visualization**
```typescript
import {
  LineChart,
  BarChart,
  PieChart,
  AreaChart,
  ResponsiveContainer
} from 'recharts';

// Spending trends over time
const SpendingTrendsChart = () => {
  const { monthlyTrends } = useFinancialAnalytics();

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={monthlyTrends}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="income" stroke="#4CAF50" />
        <Line type="monotone" dataKey="expenses" stroke="#F44336" />
      </LineChart>
    </ResponsiveContainer>
  );
};
```

## 📦 Usage Examples

### **Transaction Management**
```typescript
import { useTransactionStore } from '@banking/shared-hooks';
import { TransactionQueryBuilder } from '@banking/shared-services';

function TransactionManager() {
  const {
    transactions,
    loading,
    fetchTransactions,
    createTransaction,
    deleteTransaction
  } = useTransactionStore();

  // Complex query with builder pattern
  const loadTransactions = async () => {
    const query = new TransactionQueryBuilder()
      .page(1)
      .limit(20)
      .sortBy('date', 'desc')
      .filterByType('debit')
      .filterByCategories(['Food', 'Transport'])
      .searchByText('restaurant')
      .build();

    await fetchTransactions(query);
  };

  return (
    <div>
      <TransactionList
        transactions={transactions}
        loading={loading}
        onDelete={deleteTransaction}
        onEdit={(id) => router.push(`/transactions/edit/${id}`)}
      />
    </div>
  );
}
```

### **Advanced Filtering System**
```typescript
import { FilterState } from '../hooks/useTransactionFilters';

function TransactionFilters() {
  const {
    filters,
    updateFilter,
    clearFilters,
    applyFilters
  } = useTransactionFilters();

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2}>
          {/* Date Range Filter */}
          <Grid item xs={12} md={4}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => updateFilter('startDate', date)}
            />
          </Grid>

          {/* Category Filter */}
          <Grid item xs={12} md={4}>
            <Autocomplete
              multiple
              options={availableCategories}
              value={filters.categories}
              onChange={(_, value) => updateFilter('categories', value)}
              renderInput={(params) => (
                <TextField {...params} label="Categories" />
              )}
            />
          </Grid>

          {/* Type Filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={filters.type}
                onChange={(e) => updateFilter('type', e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="credit">Credit</MenuItem>
                <MenuItem value="debit">Debit</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
```

### **Analytics Dashboard**
```typescript
import { useFinancialAnalytics } from '@banking/shared-hooks';

function AnalyticsDashboard() {
  const {
    totalIncome,
    totalExpenses,
    balance,
    savingsRate,
    topCategories,
    monthlyTrends,
    spendingInsights
  } = useFinancialAnalytics();

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Total Income"
            value={totalIncome}
            type="income"
            icon={<TrendingUp />}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <SummaryCard
            title="Total Expenses"
            value={totalExpenses}
            type="expense"
            icon={<TrendingDown />}
          />
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Paper>
            <SpendingTrendsChart data={monthlyTrends} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper>
            <CategoryPieChart data={topCategories} />
          </Paper>
        </Grid>

        {/* Insights */}
        <Grid item xs={12}>
          <SpendingInsights insights={spendingInsights} />
        </Grid>
      </Grid>
    </Container>
  );
}
```

### **Transaction Forms with Validation**
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { transactionSchema } from '@banking/shared-types';

function TransactionForm({ transaction, onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction || {}
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            {...register('amount', { valueAsNumber: true })}
            label="Amount"
            type="number"
            error={!!errors.amount}
            helperText={errors.amount?.message}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth error={!!errors.type}>
            <InputLabel>Type</InputLabel>
            <Select
              {...register('type')}
              label="Type"
              defaultValue={watch('type') || ''}
            >
              <MenuItem value="credit">Credit</MenuItem>
              <MenuItem value="debit">Debit</MenuItem>
            </Select>
            <FormHelperText>{errors.type?.message}</FormHelperText>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            {...register('observation')}
            label="Description"
            multiline
            rows={2}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Button type="submit" variant="contained" fullWidth>
            {transaction ? 'Update' : 'Create'} Transaction
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
```

## 🔧 Technical Specifications

### **API Endpoints**
```typescript
// src/app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { CreateTransactionUseCase, ListTransactionsUseCase } from '@banking/shared-services';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Build query from URL params
  const query = new TransactionQueryBuilder()
    .page(parseInt(searchParams.get('page') || '1'))
    .limit(parseInt(searchParams.get('limit') || '10'))
    .sortBy(searchParams.get('sortBy') as any, searchParams.get('order') as any)
    .filterByType(searchParams.get('type') as any)
    .filterByCategories(searchParams.get('categories')?.split(','))
    .searchByText(searchParams.get('search'))
    .build();

  const useCase = new ListTransactionsUseCase(new ListTransactionsRepository());
  const result = await useCase.execute(query);

  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const useCase = new CreateTransactionUseCase(new CreateTransactionRepository());
  await useCase.execute(body);

  return NextResponse.json({ success: true });
}
```

### **Performance Optimizations**
```typescript
// Infinite scrolling with virtualization
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedTransactionList({ transactions }) {
  const parentRef = useRef();

  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${item.size}px`,
              transform: `translateY(${item.start}px)`,
            }}
          >
            <TransactionItem transaction={transactions[item.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### **Real-time Updates**
```typescript
import { useEffect } from 'react';
import { useTransactionStore } from '@banking/shared-hooks';

function RealtimeUpdates() {
  const { fetchTransactions } = useTransactionStore();

  useEffect(() => {
    // WebSocket connection for real-time updates
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      switch (message.type) {
        case 'TRANSACTION_CREATED':
        case 'TRANSACTION_UPDATED':
        case 'TRANSACTION_DELETED':
          fetchTransactions(); // Refresh data
          break;
      }
    };

    return () => ws.close();
  }, [fetchTransactions]);

  return null;
}
```

## 🚀 Development

### **Local Development**
```bash
# Install dependencies
pnpm install

# Start dashboard app (port 3002)
pnpm dev:dashboard

# Or run specific app
pnpm dev
```

### **Development with Microfrontends**
```bash
# Start all services (recommended)
pnpm dev

# This starts:
# - Banking app (shell) on http://localhost:3000
# - Dashboard app (microfrontend) on http://localhost:3002
# - JSON Server (mock DB) on http://localhost:3001
```

### **Environment Variables**
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_WS_URL=ws://localhost:3001
JSON_SERVER_URL=http://localhost:3001
```

## 📚 Integration

### **Shared Packages Usage**
```typescript
// Using shared types
import { Transaction, TransactionQuery } from '@banking/shared-types';

// Using shared hooks with middleware
import { useEnhancedTransactionStore } from '@banking/shared-hooks';

const useStore = () => {
  const store = useEnhancedTransactionStore();

  // Access middleware stats
  const stats = store.getMiddlewareStats();
  const performanceReport = store.getPerformanceReport();

  return { store, stats, performanceReport };
};
```

### **Component Library**
```typescript
import {
  TransactionCard,
  FilterPanel,
  AnalyticsChart,
  DataTable,
  SearchInput
} from '@banking/shared-components';
```

## 🧪 Testing & Quality

### **Type Safety**
```bash
# Type checking
pnpm typecheck:dashboard

# Linting
pnpm lint:dashboard
```

### **Build Verification**
```bash
# Build dashboard app
pnpm build:dashboard

# Build all apps
pnpm build
```

## 🚀 Deployment

### **Production Build**
```bash
# Build for production
pnpm build:dashboard

# Start production server
pnpm start:dashboard
```

### **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./

EXPOSE 3002
CMD ["pnpm", "start"]
```

## 📊 Analytics & Monitoring

### **Performance Metrics**
```typescript
// Performance tracking
const performanceMetrics = {
  pageLoad: performance.now(),
  apiResponseTime: 0,
  renderTime: 0,
  userInteractions: 0,
};

// Analytics tracking
const trackAnalytics = (event: string, properties?: any) => {
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    analytics.track(event, properties);
  }
};
```

### **Error Tracking**
```typescript
// Error boundary for components
class DashboardErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Dashboard Error:', error, errorInfo);

    // Report to error tracking service
    Sentry.captureException(error, {
      contexts: { react: { componentStack: errorInfo.componentStack } }
    });
  }
}
```

## 📖 Best Practices

### **Data Fetching**
```typescript
// ✅ Good: Use optimized queries
const query = new TransactionQueryBuilder()
  .page(1)
  .limit(20)
  .cache(true) // Enable caching
  .build();

// ✅ Good: Handle loading and error states
const { transactions, loading, error } = useTransactionStore();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### **Performance**
```typescript
// ✅ Good: Use React.memo for expensive components
const TransactionCard = React.memo(({ transaction }) => {
  return <Card>{/* Content */}</Card>;
});

// ✅ Good: Use useMemo for expensive calculations
const totalAmount = useMemo(
  () => transactions.reduce((sum, t) => sum + t.amount, 0),
  [transactions]
);
```

## 📖 Documentation

- **Enterprise Architecture**: `ARQUITETURA_IMPLEMENTADA.md`
- **Component Library**: Component documentation
- **API Reference**: Inline JSDoc comments
- **Deployment Guide**: Docker and production setup

---

**Advanced transaction management microfrontend for enterprise banking** 📊💰