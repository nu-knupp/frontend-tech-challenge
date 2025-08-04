import { IDeleteTransactionRepository } from "../interfaces";
import axios from "axios";

export class DeleteTransactionRepository implements IDeleteTransactionRepository {
  private readonly baseUrl = process.env.JSON_SERVER_URL || "http://localhost:3001/transactions";

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
