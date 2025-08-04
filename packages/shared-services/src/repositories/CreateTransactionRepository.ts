import { ICreateTransactionRepository } from "../interfaces";
import { Transaction } from "@banking/shared-types";
import axios from "axios";

export class CreateTransactionRepository implements ICreateTransactionRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

  async save(transaction: Transaction): Promise<void> {
    await axios.post(this.baseUrl, transaction);
  }
}
