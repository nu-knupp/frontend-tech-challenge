import axios from 'axios';
let baseURL = '';
if (typeof window !== 'undefined') {
  // No browser, use variável global ou padrão
  baseURL = (window as any).NEXT_PUBLIC_API_BASE_URL || '';
} else {
  // No Node/SSR, use process.env
  baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '';
}
export default axios.create({ baseURL });
