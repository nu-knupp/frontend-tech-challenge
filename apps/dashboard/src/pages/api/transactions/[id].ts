import {
	DeleteTransactionRepository,
	ListTransactionsRepository,
	UpdateTransactionRepository,
	UpdateTransactionSchema,
	DeleteTransactionUseCase,
	UpdateTransactionUseCase,
} from "@banking/shared-services";
import { Transaction } from "@banking/shared-types";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSessionCookieName, verifyAuthToken } from "@banking/shared-utils";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	const { id } = req.query;

	// Verificar autenticação
	const token = req.cookies[getSessionCookieName()];
	if (!token) {
		return res.status(401).json({ error: "Não autorizado" });
	}
	const session = await verifyAuthToken(token);
	if (!session) {
		return res.status(401).json({ error: "Sessão inválida" });
	}

	if (req.method === "GET") {
		const repository = new ListTransactionsRepository();
		const { transactions } = await repository.listTransactions();
		const result = transactions.find((tx: Transaction) => tx.id === id);

		if (!result) {
			return res.status(404).json({ error: "Transação não encontrada" });
		}

		// Verificar se a transação pertence ao usuário logado
		if (result.userEmail && result.userEmail !== session.email) {
			return res.status(403).json({ error: "Acesso negado" });
		}

		return res.status(200).json(result);
	}

	if (req.method === "PATCH") {
		// Primeiro verificar se a transação existe e pertence ao usuário
		const listRepository = new ListTransactionsRepository();
		const { transactions } = await listRepository.listTransactions();
		const existingTransaction = transactions.find(
			(tx: Transaction) => tx.id === id,
		);

		if (!existingTransaction) {
			return res.status(404).json({ error: "Transação não encontrada" });
		}

		if (
			existingTransaction.userEmail &&
			existingTransaction.userEmail !== session.email
		) {
			return res.status(403).json({ error: "Acesso negado" });
		}

		console.log("Received PATCH data:", JSON.stringify(req.body, null, 2));

		const parseResult = UpdateTransactionSchema.safeParse(req.body);

		if (!parseResult.success) {
			console.log(
				"Validation errors:",
				JSON.stringify(parseResult.error.flatten(), null, 2),
			);
			return res.status(400).json({ errors: parseResult.error.flatten() });
		}

		const repository = new UpdateTransactionRepository();
		const useCase = new UpdateTransactionUseCase(repository);
		await useCase.execute(id as string, parseResult.data);
		return res.status(201).json({ message: "Transação atualizada" });
	}

	if (req.method === "DELETE") {
		// Primeiro verificar se a transação existe e pertence ao usuário
		const listRepository = new ListTransactionsRepository();
		const { transactions } = await listRepository.listTransactions();
		const existingTransaction = transactions.find(
			(tx: Transaction) => tx.id === id,
		);

		if (!existingTransaction) {
			return res.status(404).json({ error: "Transação não encontrada" });
		}

		if (
			existingTransaction.userEmail &&
			existingTransaction.userEmail !== session.email
		) {
			return res.status(403).json({ error: "Acesso negado" });
		}

		const repository = new DeleteTransactionRepository();
		const useCase = new DeleteTransactionUseCase(repository);
		await useCase.execute(id as string);
		return res.status(201).json({ message: "Transação excluída" });
	}

	res.setHeader("Allow", ["GET", "PATCH", "DELETE"]);
	res.status(405).end(`Method ${req.method} Not Allowed`);
}
