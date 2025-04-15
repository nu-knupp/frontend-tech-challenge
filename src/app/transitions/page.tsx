"use client";
import * as S from "./styles";

type Transaction = {
  id: number;
  amount: number;
  date: string;
};

export default function Transactions() {
  const transactions: Transaction[] = [
    { id: 1, amount: 250.0, date: "2025-04-01" },
    { id: 2, amount: -75.5, date: "2025-04-03" },
    { id: 3, amount: 300.0, date: "2025-04-05" },
  ];

  return (
    <S.Container>
      <S.Title>Transações Bancárias</S.Title>
      <S.TransactionList>
        {transactions.map((transaction) => (
          <S.TransactionItem key={transaction.id}>
            <div>
              <S.Amount isNegative={transaction.amount < 0}>
                ${transaction.amount}
              </S.Amount>
            </div>
            <S.Date>{transaction.date}</S.Date>
          </S.TransactionItem>
        ))}
      </S.TransactionList>
    </S.Container>
  );
}
