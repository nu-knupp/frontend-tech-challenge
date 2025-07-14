import axios from "axios";
import { API_CONFIG } from "@/config/api";

const api = axios.create({
  baseURL: API_CONFIG.baseUrl,
});

export default api;
