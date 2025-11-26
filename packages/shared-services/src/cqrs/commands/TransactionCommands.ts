import { ICommand } from '../ICommand';
import { Transaction } from "@banking/shared-types";

/**
 * Command to create a new transaction
 */
export class CreateTransactionCommand implements ICommand<Omit<Transaction, 'id'>> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly data: Omit<Transaction, 'id'>;

  constructor(data: Omit<Transaction, 'id'>, metadata?: Record<string, any>) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.data = data;
    this.metadata = {
      ...metadata,
      userId: data.userEmail, // Track which user created the transaction
    };
  }
}

/**
 * Command to update an existing transaction
 */
export class UpdateTransactionCommand implements ICommand<Partial<Transaction> & { id: string }> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly data: Partial<Transaction> & { id: string };

  constructor(data: Partial<Transaction> & { id: string }, metadata?: Record<string, any>) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.data = data;
    this.metadata = {
      ...metadata,
      updatedFields: Object.keys(data),
    };
  }
}

/**
 * Command to delete a transaction
 */
export class DeleteTransactionCommand implements ICommand<{ id: string }> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly data: { id: string };

  constructor(transactionId: string, metadata?: Record<string, any>) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.data = { id: transactionId };
    this.metadata = metadata;
  }
}

/**
 * Command to bulk delete multiple transactions
 */
export class BulkDeleteTransactionsCommand implements ICommand<{ ids: string[] }> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly data: { ids: string[] };

  constructor(ids: string[], metadata?: Record<string, any>) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.data = { ids };
    this.metadata = {
      ...metadata,
      count: ids.length,
    };
  }
}

/**
 * Command to import transactions from a file
 */
export class ImportTransactionsCommand implements ICommand<{
  transactions: Omit<Transaction, 'id'>[];
  fileName: string;
  fileType: string;
}> {
  public readonly id: string;
  public readonly timestamp: Date;
  public readonly metadata?: Record<string, any>;
  public readonly data: {
    transactions: Omit<Transaction, 'id'>[];
    fileName: string;
    fileType: string;
  };

  constructor(
    transactions: Omit<Transaction, 'id'>[],
    fileName: string,
    fileType: string,
    metadata?: Record<string, any>
  ) {
    this.id = crypto.randomUUID();
    this.timestamp = new Date();
    this.data = { transactions, fileName, fileType };
    this.metadata = {
      ...metadata,
      importCount: transactions.length,
      fileName,
      fileType,
    };
  }
}