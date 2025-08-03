import {
  CreateTransactionRepository,
  ListTransactionsRepository,
  TransactionSchema,
  CreateTransactionUseCase,
  ListTransactionsUseCase,
} from '@banking/shared-services';
import { Transaction } from '@banking/shared-types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar autenticação
  const session = req.cookies.session;
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    const { page = "1", limit = "10", sort = "desc", type } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const sortOrder = sort === 'asc' || sort === 'desc' ? sort : 'desc';
    const transactionType = type === 'credit' || type === 'debit' ? type : undefined;

    const repository = new ListTransactionsRepository();
    const useCase = new ListTransactionsUseCase(repository);
    const result = await useCase.execute(pageNumber, limitNumber, 'date', sortOrder, transactionType);

    // Filtrar transações por usuário (usando email como identificador)
    const userTransactions = result.transactions.filter(
      (transaction: any) => transaction.userEmail === session
    );

    return res.status(200).json({
      ...result,
      transactions: userTransactions,
      total: userTransactions.length,
      totalPages: Math.ceil(userTransactions.length / limitNumber)
    });
  }

  if (req.method === 'POST') {
    const parseResult = TransactionSchema.omit({ id: true }).safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Dados inválidos', error: parseResult.error });
    }

    // Adicionar email do usuário à transação
    const transactionWithUser = {
      ...parseResult.data,
      userEmail: session
    };

    const repository = new CreateTransactionRepository();
    const useCase = new CreateTransactionUseCase(repository);
    await useCase.execute(transactionWithUser);
    return res.status(201).json({ message: 'Transação criada' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
