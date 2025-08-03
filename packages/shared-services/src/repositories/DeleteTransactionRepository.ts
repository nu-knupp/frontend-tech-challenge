import { IDeleteTransactionRepository } from "../interfaces";
import axios from "axios";

export class DeleteTransactionRepository implements IDeleteTransactionRepository {
  private readonly baseUrl = "http://localhost:3001/transactions";

  async delete(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}
