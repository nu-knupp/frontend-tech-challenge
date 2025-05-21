import { GetBalanceRepository } from '@/services/repositories/GetBalanceRepository';
import { GetBalanceUseCase } from '@/services/usecases/GetBalanceUseCase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const repository = new GetBalanceRepository();
    const useCase = new GetBalanceUseCase(repository);
    const transactions = await useCase.execute();
    return res.status(200).json(transactions);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
