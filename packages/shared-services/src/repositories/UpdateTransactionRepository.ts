import { IUpdateTransactionRepository } from "../interfaces";
import { Transaction } from "@banking/shared-types";
import axios from "axios";

export class UpdateTransactionRepository implements IUpdateTransactionRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

  async update(id: string, data: Partial<Transaction>): Promise<void> {
    await axios.patch(`${this.baseUrl}/${id}`, data);
  }
}
