// src/styles/styles.ts

import styled from "styled-components";

// Exemplo de estilo para a tela de transações
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f4f4f4;
  min-height: 100vh;
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 20px;
`;

export const TransactionList = styled.ul`
  list-style-type: none;
  padding: 0;
  width: 100%;
  max-width: 600px;
`;

export const TransactionItem = styled.li`
  background-color: #fff;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
`;

interface AmountProps {
  isNegative: boolean;
}

export const Amount = styled.span<AmountProps>`
  font-weight: bold;
  color: ${(props) => (props.isNegative ? "red" : "green")};
`;

export const Date = styled.span`
  color: #777;
  font-size: 0.9rem;
`;
