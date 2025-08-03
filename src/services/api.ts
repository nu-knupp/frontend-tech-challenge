import axios from "axios";
const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || "/api";
const api = axios.create({
  baseURL,
});
export default api;
