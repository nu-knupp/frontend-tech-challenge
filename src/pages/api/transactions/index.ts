import { CreateTransactionRepository } from '@/services/repositories/CreateTransactionRepository';
import { ListTransactionsRepository } from '@/services/repositories/ListTransactionsRepository';
import { UpdateTransactionRepository } from '@/services/repositories/UpdateTransactionRepository';
import { TransactionSchema } from '@/services/schema/TransactionSchema';
import { CreateTransactionUseCase } from '@/services/usecases/CreateTransactionUseCase';
import { ListTransactionsUseCase } from '@/services/usecases/ListTransactionsUseCase';
import { UpdateTransactionUseCase } from '@/services/usecases/UpdateTransactionUseCase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const repository = new ListTransactionsRepository();
    const useCase = new ListTransactionsUseCase(repository);
    const transactions = await useCase.execute();
    return res.status(200).json(transactions);
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
