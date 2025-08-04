import { GetBalanceRepository, GetBalanceUseCase } from '@banking/shared-services';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Verificar autenticação
  const session = req.cookies.session;
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    const repository = new GetBalanceRepository();
    
    // Buscar todas as transações
    const result = await repository.listTransactions();
    if (!result) {
      return res.status(500).json({ error: 'Erro ao buscar transações' });
    }
    
    const userTransactions = result.filter(
      (transaction: any) => transaction.userEmail === session
    );
    
    // Calcular balance apenas das transações do usuário
    const userBalance = userTransactions.reduce((acc: number, transaction: any) => {
      return transaction.type === 'credit' 
        ? acc + transaction.amount 
        : acc - transaction.amount;
    }, 0);
    
    return res.status(200).json(userBalance);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
