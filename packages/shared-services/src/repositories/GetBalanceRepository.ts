import { IGetBalanceRepository } from "../interfaces/IGetBalanceRepository";
import { Transaction } from "@banking/shared-types";
import axios from "axios";

export class GetBalanceRepository implements IGetBalanceRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

  async listTransactions(): Promise<Transaction[] | null> {
    const response = await axios.get<Transaction[]>(this.baseUrl);
    return response.data;
  }
}
