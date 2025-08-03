import { 
  DeleteTransactionRepository,
  ListTransactionsRepository,
  UpdateTransactionRepository,
  UpdateTransactionSchema,
  DeleteTransactionUseCase,
  ListTransactionsUseCase,
  UpdateTransactionUseCase
} from '@banking/shared-services';
import { Transaction } from '@banking/shared-types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  // Verificar autenticação
  const session = req.cookies.session;
  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'GET') {
    const repository = new ListTransactionsRepository();
    const useCase = new ListTransactionsUseCase(repository);
    const result = (await useCase.execute(1, 9999)).transactions.find((tx: Transaction) => tx.id === id);

    if (!result) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Verificar se a transação pertence ao usuário logado
    if (result.userEmail && result.userEmail !== session) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    return res.status(200).json(result);
  }

  if (req.method === 'PATCH') {
    // Primeiro verificar se a transação existe e pertence ao usuário
    const listRepository = new ListTransactionsRepository();
    const listUseCase = new ListTransactionsUseCase(listRepository);
    const existingTransaction = (await listUseCase.execute(1, 9999)).transactions.find((tx: Transaction) => tx.id === id);
    
    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    if (existingTransaction.userEmail && existingTransaction.userEmail !== session) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    console.log('Received PATCH data:', JSON.stringify(req.body, null, 2));
    
    const parseResult = UpdateTransactionSchema.safeParse(req.body);

    if (!parseResult.success) {
      console.log('Validation errors:', JSON.stringify(parseResult.error.flatten(), null, 2));
      return res.status(400).json({ errors: parseResult.error.flatten() });
    }
    
    const repository = new UpdateTransactionRepository();
    const useCase = new UpdateTransactionUseCase(repository);
    await useCase.execute(id as string, parseResult.data);
    return res.status(201).json({ message: 'Transação atualizada' });
  }

  if (req.method === 'DELETE') {
    // Primeiro verificar se a transação existe e pertence ao usuário
    const listRepository = new ListTransactionsRepository();
    const listUseCase = new ListTransactionsUseCase(listRepository);
    const existingTransaction = (await listUseCase.execute(1, 9999)).transactions.find((tx: Transaction) => tx.id === id);
    
    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }
    
    if (existingTransaction.userEmail && existingTransaction.userEmail !== session) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const repository = new DeleteTransactionRepository();
    const useCase = new DeleteTransactionUseCase(repository);
    await useCase.execute(id as string);
    return res.status(201).json({ message: 'Transação excluída' });
  }

  res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
