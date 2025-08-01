import { DeleteTransactionRepository } from '@/services/repositories/DeleteTransactionRepository';
import { ListTransactionsRepository } from '@/services/repositories/ListTransactionsRepository';
import { UpdateTransactionRepository } from '@/services/repositories/UpdateTransactionRepository';
import { UpdateTransactionSchema } from '@/services/schema/TransactionSchema';
import { DeleteTransactionUseCase } from '@/services/usecases/DeleteTransactionUseCase';
import { ListTransactionsUseCase } from '@/services/usecases/ListTransactionsUseCase';
import { UpdateTransactionUseCase } from '@/services/usecases/UpdateTransactionUseCase';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  const { id } = req.query;

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const repository = new ListTransactionsRepository();
    const useCase = new ListTransactionsUseCase(repository);
    const result = (await useCase.execute(1, 9999)).transactions.find((tx) => tx.id === id);

    if (!result) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    return res.status(200).json(result);
  }

  if (req.method === 'PATCH') {
    const parseResult = UpdateTransactionSchema.safeParse(req.body);

    if (!parseResult.success) {
      return res.status(400).json({ errors: parseResult.error.flatten() });
    }

    const repository = new UpdateTransactionRepository();
    const useCase = new UpdateTransactionUseCase(repository);
    await useCase.execute(id as string, parseResult.data);
    return res.status(201).json({ message: 'Transação atualizada' });
  }

  if (req.method === 'DELETE') {
    const repository = new DeleteTransactionRepository();
    const useCase = new DeleteTransactionUseCase(repository);
    await useCase.execute(id as string);
    return res.status(201).json({ message: 'Transação excluída' });
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
