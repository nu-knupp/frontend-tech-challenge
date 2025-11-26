import { ICommandHandler } from '../ICommandHandler';
import { CreateTransactionCommand, UpdateTransactionCommand, DeleteTransactionCommand, BulkDeleteTransactionsCommand, ImportTransactionsCommand } from '../commands/TransactionCommands';
import { Transaction } from "@banking/shared-types";

/**
 * Handler for creating transactions
 */
export class CreateTransactionCommandHandler implements ICommandHandler<CreateTransactionCommand> {
  constructor(
    private createTransactionRepository: {
      createTransaction: (data: Omit<Transaction, 'id'>) => Promise<Transaction>;
    }
  ) {}

  canHandle(command: CreateTransactionCommand): boolean {
    return command instanceof CreateTransactionCommand;
  }

  async handle(command: CreateTransactionCommand): Promise<Transaction> {
    // Business validation
    this.validateTransactionData(command.data);

    try {
      const transaction = await this.createTransactionRepository.createTransaction(command.data);

      // Log successful creation
      console.log(`Transaction created successfully: ${transaction.id}`);

      return transaction;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw new Error(`Failed to create transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateTransactionData(data: Omit<Transaction, 'id'>): void {
    if (!data.amount || data.amount <= 0) {
      throw new Error('Transaction amount must be greater than 0');
    }

    if (!data.type || !['credit', 'debit'].includes(data.type)) {
      throw new Error('Transaction type must be either "credit" or "debit"');
    }

    if (!data.date) {
      throw new Error('Transaction date is required');
    }

    if (!data.userEmail) {
      throw new Error('User email is required');
    }

    if (data.categories && data.categories.length > 0) {
      // Validate category names
      const invalidCategories = data.categories.filter(cat => !cat.trim());
      if (invalidCategories.length > 0) {
        throw new Error('Categories cannot be empty strings');
      }
    }
  }
}

/**
 * Handler for updating transactions
 */
export class UpdateTransactionCommandHandler implements ICommandHandler<UpdateTransactionCommand> {
  constructor(
    private updateTransactionRepository: {
      updateTransaction: (id: string, data: Partial<Transaction>) => Promise<Transaction>;
    },
    private getTransactionRepository: {
      getTransactionById: (id: string) => Promise<Transaction | null>;
    }
  ) {}

  canHandle(command: UpdateTransactionCommand): boolean {
    return command instanceof UpdateTransactionCommand;
  }

  async handle(command: UpdateTransactionCommand): Promise<Transaction> {
    const { id, ...updateData } = command.data;

    // Check if transaction exists
    const existingTransaction = await this.getTransactionRepository.getTransactionById(id);
    if (!existingTransaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    // Business validation for updates
    this.validateUpdateData(updateData);

    try {
      const updatedTransaction = await this.updateTransactionRepository.updateTransaction(id, updateData);

      console.log(`Transaction updated successfully: ${id}`);

      return updatedTransaction;
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw new Error(`Failed to update transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateUpdateData(data: Partial<Transaction>): void {
    if (data.amount !== undefined && data.amount <= 0) {
      throw new Error('Transaction amount must be greater than 0');
    }

    if (data.type !== undefined && !['credit', 'debit'].includes(data.type)) {
      throw new Error('Transaction type must be either "credit" or "debit"');
    }

    if (data.categories && data.categories.length > 0) {
      const invalidCategories = data.categories.filter(cat => !cat.trim());
      if (invalidCategories.length > 0) {
        throw new Error('Categories cannot be empty strings');
      }
    }
  }
}

/**
 * Handler for deleting transactions
 */
export class DeleteTransactionCommandHandler implements ICommandHandler<DeleteTransactionCommand> {
  constructor(
    private deleteTransactionRepository: {
      deleteTransaction: (id: string) => Promise<void>;
    },
    private getTransactionRepository: {
      getTransactionById: (id: string) => Promise<Transaction | null>;
    }
  ) {}

  canHandle(command: DeleteTransactionCommand): boolean {
    return command instanceof DeleteTransactionCommand;
  }

  async handle(command: DeleteTransactionCommand): Promise<void> {
    const { id } = command.data;

    // Check if transaction exists
    const existingTransaction = await this.getTransactionRepository.getTransactionById(id);
    if (!existingTransaction) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    try {
      await this.deleteTransactionRepository.deleteTransaction(id);
      console.log(`Transaction deleted successfully: ${id}`);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw new Error(`Failed to delete transaction: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

/**
 * Handler for bulk deleting transactions
 */
export class BulkDeleteTransactionsCommandHandler implements ICommandHandler<BulkDeleteTransactionsCommand> {
  constructor(
    private deleteTransactionRepository: {
      deleteTransaction: (id: string) => Promise<void>;
    },
    private getTransactionRepository: {
      getTransactionById: (id: string) => Promise<Transaction | null>;
    }
  ) {}

  canHandle(command: BulkDeleteTransactionsCommand): boolean {
    return command instanceof BulkDeleteTransactionsCommand;
  }

  async handle(command: BulkDeleteTransactionsCommand): Promise<{
    successful: string[];
    failed: { id: string; error: string }[];
  }> {
    const { ids } = command.data;
    const results = {
      successful: [] as string[],
      failed: [] as { id: string; error: string }[]
    };

    // Validate all transactions exist first
    for (const id of ids) {
      const existingTransaction = await this.getTransactionRepository.getTransactionById(id);
      if (!existingTransaction) {
        results.failed.push({ id, error: 'Transaction not found' });
      }
    }

    // Process valid transactions
    const validIds = ids.filter(id => !results.failed.some(f => f.id === id));

    for (const id of validIds) {
      try {
        await this.deleteTransactionRepository.deleteTransaction(id);
        results.successful.push(id);
      } catch (error) {
        results.failed.push({
          id,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`Bulk delete completed: ${results.successful.length} successful, ${results.failed.length} failed`);

    return results;
  }
}

/**
 * Handler for importing transactions
 */
export class ImportTransactionsCommandHandler implements ICommandHandler<ImportTransactionsCommand> {
  constructor(
    private createTransactionRepository: {
      createTransaction: (data: Omit<Transaction, 'id'>) => Promise<Transaction>;
    }
  ) {}

  canHandle(command: ImportTransactionsCommand): boolean {
    return command instanceof ImportTransactionsCommand;
  }

  async handle(command: ImportTransactionsCommand): Promise<{
    imported: Transaction[];
    failed: { index: number; data: any; error: string }[];
  }> {
    const { transactions, fileName, fileType } = command.data;
    const results = {
      imported: [] as Transaction[],
      failed: [] as { index: number; data: any; error: string }[]
    };

    console.log(`Starting import of ${transactions.length} transactions from ${fileName}`);

    for (let i = 0; i < transactions.length; i++) {
      const transactionData = transactions[i];

      try {
        // Validate transaction data
        this.validateTransactionData(transactionData);

        // Create transaction
        const transaction = await this.createTransactionRepository.createTransaction({
          ...transactionData,
          // Add metadata about the import
          observation: transactionData.observation
            ? `Imported from ${fileName}: ${transactionData.observation}`
            : `Imported from ${fileName}`
        });

        results.imported.push(transaction);
      } catch (error) {
        results.failed.push({
          index: i + 1,
          data: transactionData,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log(`Import completed: ${results.imported.length} successful, ${results.failed.length} failed`);

    return results;
  }

  private validateTransactionData(data: Omit<Transaction, 'id'>): void {
    if (!data.amount || data.amount <= 0) {
      throw new Error('Transaction amount must be greater than 0');
    }

    if (!data.type || !['credit', 'debit'].includes(data.type)) {
      throw new Error('Transaction type must be either "credit" or "debit"');
    }

    if (!data.date) {
      throw new Error('Transaction date is required');
    }

    if (!data.userEmail) {
      throw new Error('User email is required');
    }
  }
}