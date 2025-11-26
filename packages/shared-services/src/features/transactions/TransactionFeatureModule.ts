import { IFeatureModule } from '../IFeatureModule';
import { ListTransactionsUseCase } from '../../usecases/ListTransactionsUseCase';
import { CreateTransactionUseCase } from '../../usecases/CreateTransactionUseCase';
import { UpdateTransactionUseCase } from '../../usecases/UpdateTransactionUseCase';
import { DeleteTransactionUseCase } from '../../usecases/DeleteTransactionUseCase';
import { GetBalanceUseCase } from '../../usecases/GetBalanceUseCase';
import {
  ListTransactionsRepository,
  CreateTransactionRepository,
  UpdateTransactionRepository,
  DeleteTransactionRepository,
  GetBalanceRepository
} from '../../repositories';
import { Transaction, TransactionQuery, PaginatedTransactionResult } from '@banking/shared-types';

/**
 * Transaction Feature Module
 * Manages all transaction-related functionality including CRUD operations,
 * querying, caching, and business rules
 */
export class TransactionFeatureModule implements IFeatureModule {
  public readonly name = 'transactions';
  public readonly version = '1.0.0';
  public readonly description = 'Manages financial transactions, balances, and related operations';
  public readonly dependencies: string[] = [];

  private initialized = false;
  private initializationTime?: Date;

  // Use Cases
  private listTransactionsUseCase?: ListTransactionsUseCase;
  private createTransactionUseCase?: CreateTransactionUseCase;
  private updateTransactionUseCase?: UpdateTransactionUseCase;
  private deleteTransactionUseCase?: DeleteTransactionUseCase;
  private getBalanceUseCase?: GetBalanceUseCase;

  // Repositories
  private listTransactionsRepository?: ListTransactionsRepository;
  private createTransactionRepository?: CreateTransactionRepository;
  private updateTransactionRepository?: UpdateTransactionRepository;
  private deleteTransactionRepository?: DeleteTransactionRepository;
  private getBalanceRepository?: GetBalanceRepository;

  /**
   * Initialize the transaction feature module
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    console.log('Initializing Transaction Feature Module...');

    try {
      // Initialize repositories
      await this.initializeRepositories();

      // Initialize use cases
      await this.initializeUseCases();

      // Setup event listeners and side effects
      await this.setupEventListeners();

      this.initialized = true;
      this.initializationTime = new Date();

      console.log('Transaction Feature Module initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Transaction Feature Module:', error);
      throw error;
    }
  }

  /**
   * Clean up the transaction feature module
   */
  async dispose(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    console.log('Disposing Transaction Feature Module...');

    try {
      // Cleanup event listeners
      await this.cleanupEventListeners();

      // Reset use cases
      this.listTransactionsUseCase = undefined;
      this.createTransactionUseCase = undefined;
      this.updateTransactionUseCase = undefined;
      this.deleteTransactionUseCase = undefined;
      this.getBalanceUseCase = undefined;

      // Reset repositories
      this.listTransactionsRepository = undefined;
      this.createTransactionRepository = undefined;
      this.updateTransactionRepository = undefined;
      this.deleteTransactionRepository = undefined;
      this.getBalanceRepository = undefined;

      this.initialized = false;
      this.initializationTime = undefined;

      console.log('Transaction Feature Module disposed successfully');
    } catch (error) {
      console.error('Failed to dispose Transaction Feature Module:', error);
      throw error;
    }
  }

  /**
   * Check if the feature module is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get feature module metadata
   */
  getMetadata() {
    return {
      name: this.name,
      version: this.version,
      description: this.description,
      dependencies: this.dependencies,
      initialized: this.initialized,
      initializationTime: this.initializationTime
    };
  }

  /**
   * Get transactions with pagination and filtering
   */
  async getTransactions(query: TransactionQuery): Promise<PaginatedTransactionResult> {
    if (!this.listTransactionsUseCase) {
      throw new Error('Transaction feature module not initialized');
    }

    return this.listTransactionsUseCase.execute(query);
  }

  /**
   * Create a new transaction
   */
  async createTransaction(data: Omit<Transaction, 'id'>): Promise<Transaction> {
    if (!this.createTransactionUseCase) {
      throw new Error('Transaction feature module not initialized');
    }

    return this.createTransactionUseCase.execute(data);
  }

  /**
   * Update an existing transaction
   */
  async updateTransaction(
    id: string,
    data: Partial<Transaction>
  ): Promise<Transaction> {
    if (!this.updateTransactionUseCase) {
      throw new Error('Transaction feature module not initialized');
    }

    return this.updateTransactionUseCase.execute(id, data);
  }

  /**
   * Delete a transaction
   */
  async deleteTransaction(id: string): Promise<void> {
    if (!this.deleteTransactionUseCase) {
      throw new Error('Transaction feature module not initialized');
    }

    return this.deleteTransactionUseCase.execute(id);
  }

  /**
   * Get current balance
   */
  async getBalance(userEmail?: string): Promise<string> {
    if (!this.getBalanceUseCase) {
      throw new Error('Transaction feature module not initialized');
    }

    const balance = await this.getBalanceUseCase.execute(userEmail);
    return balance.toString();
  }

  /**
   * Get transaction statistics
   */
  async getTransactionStatistics(params: {
    userEmail?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    totalTransactions: number;
    totalAmount: number;
    averageAmount: number;
    creditCount: number;
    debitCount: number;
  }> {
    // This would typically use a dedicated use case or query
    const query: TransactionQuery = {
      pagination: { page: 1, limit: 10000 }, // Get all transactions
      search: {
        startDate: params.startDate,
        endDate: params.endDate
      }
    };

    const result = await this.getTransactions(query);

    // Filter by user if specified
    const transactions = params.userEmail
      ? result.transactions.filter(t => t.userEmail === params.userEmail)
      : result.transactions;

    const creditTransactions = transactions.filter(t => t.type === 'credit');
    const debitTransactions = transactions.filter(t => t.type === 'debit');

    const creditTotal = creditTransactions.reduce((sum, t) => sum + t.amount, 0);
    const debitTotal = debitTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalAmount = creditTotal - debitTotal;

    return {
      totalTransactions: transactions.length,
      totalAmount,
      averageAmount: transactions.length > 0 ? Math.abs(totalAmount) / transactions.length : 0,
      creditCount: creditTransactions.length,
      debitCount: debitTransactions.length
    };
  }

  /**
   * Initialize repositories
   */
  private async initializeRepositories(): Promise<void> {
    // Initialize repository instances
    this.listTransactionsRepository = new ListTransactionsRepository();
    this.createTransactionRepository = new CreateTransactionRepository();
    this.updateTransactionRepository = new UpdateTransactionRepository();
    this.deleteTransactionRepository = new DeleteTransactionRepository();
    this.getBalanceRepository = new GetBalanceRepository();
  }

  /**
   * Initialize use cases
   */
  private async initializeUseCases(): Promise<void> {
    if (!this.listTransactionsRepository || !this.createTransactionRepository ||
        !this.updateTransactionRepository || !this.deleteTransactionRepository ||
        !this.getBalanceRepository) {
      throw new Error('Repositories must be initialized before use cases');
    }

    // Initialize use case instances
    this.listTransactionsUseCase = new ListTransactionsUseCase(this.listTransactionsRepository);
    this.createTransactionUseCase = new CreateTransactionUseCase(this.createTransactionRepository);
    this.updateTransactionUseCase = new UpdateTransactionUseCase(this.updateTransactionRepository);
    this.deleteTransactionUseCase = new DeleteTransactionUseCase(this.deleteTransactionRepository);
    this.getBalanceUseCase = new GetBalanceUseCase(this.getBalanceRepository);
  }

  /**
   * Setup event listeners and side effects
   */
  private async setupEventListeners(): Promise<void> {
    // Setup listeners for transaction events
    // This could integrate with an event bus or similar system

    // Example: Invalidate cache when transactions are modified
    // Example: Send analytics events
    // Example: Update user's financial summary
  }

  /**
   * Cleanup event listeners
   */
  private async cleanupEventListeners(): Promise<void> {
    // Cleanup any event listeners or subscriptions
  }
}