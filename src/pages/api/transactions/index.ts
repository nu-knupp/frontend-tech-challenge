import { CreateTransactionRepository } from '@/services/repositories/CreateTransactionRepository';
import { ListTransactionsRepository } from '@/services/repositories/ListTransactionsRepository';
import { TransactionSchema } from '@/services/schema/TransactionSchema';
import { CreateTransactionUseCase } from '@/services/usecases/CreateTransactionUseCase';
import { ListTransactionsUseCase } from '@/services/usecases/ListTransactionsUseCase';
import { NextApiRequest, NextApiResponse } from 'next';
import { Transaction } from '@/types/Transaction';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { page = "1", limit = "10", sort = "desc", type } = req.query;

    const pageNumber = parseInt(page as string, 10);
    const limitNumber = parseInt(limit as string, 10);
    const sortOrder = sort === 'asc' || sort === 'desc' ? sort : 'desc';
    const transactionType = type === 'credit' || type === 'debit' ? type : undefined;

    const repository = new ListTransactionsRepository();
    const useCase = new ListTransactionsUseCase(repository);
    const result = await useCase.execute(pageNumber, limitNumber, 'date', sortOrder, transactionType);

    return res.status(200).json(result);
  }

  if (req.method === 'POST') {
    const parseResult = TransactionSchema.omit({ id: true }).safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ message: 'Dados inválidos', error: parseResult.error });
    }

    const repository = new CreateTransactionRepository();
    const useCase = new CreateTransactionUseCase(repository);
    await useCase.execute(parseResult.data);
    return res.status(201).json({ message: 'Transação criada' });
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
