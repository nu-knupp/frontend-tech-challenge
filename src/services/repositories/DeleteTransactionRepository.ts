import { IDeleteTransactionRepository } from "@/services/interfaces/IDeleteTransactionRepository";
import { API_CONFIG } from "@/config/api";
import axios from "axios";

export class DeleteTransactionRepository implements IDeleteTransactionRepository {
  private readonly baseUrl = API_CONFIG.transactionsUrl;

  async delete(id: string): Promise<void> {
    axios.delete(this.baseUrl + `/${id}`)
  }
}