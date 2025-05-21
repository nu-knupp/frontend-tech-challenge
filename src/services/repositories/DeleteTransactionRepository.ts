import { IDeleteTransactionRepository } from "@/services/interfaces/IDeleteTransactionRepository";
import axios from "axios";

export class DeleteTransactionRepository implements IDeleteTransactionRepository {
  private readonly baseUrl = 'http://localhost:3001/transactions'

  async delete(id: string): Promise<void> {
    axios.delete(this.baseUrl + `/${id}`)
  }
}