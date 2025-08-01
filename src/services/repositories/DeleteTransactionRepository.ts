import { IDeleteTransactionRepository } from "../interfaces/IDeleteTransactionRepository";
import { API_BASE_URL } from "../../config/api";
import axios from "axios";

export class DeleteTransactionRepository implements IDeleteTransactionRepository {
  private readonly baseUrl = `${API_BASE_URL}/transactions`;

  async delete(id: string): Promise<void> {
    axios.delete(this.baseUrl + `/${id}`)
  }
}