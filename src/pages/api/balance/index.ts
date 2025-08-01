import { GetBalanceRepository } from '@/services/repositories/GetBalanceRepository';
import { GetBalanceUseCase } from '@/services/usecases/GetBalanceUseCase';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method === 'GET') {
    const repository = new GetBalanceRepository();
    const useCase = new GetBalanceUseCase(repository);
    const transactions = await useCase.execute();
    return res.status(200).json(transactions);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
