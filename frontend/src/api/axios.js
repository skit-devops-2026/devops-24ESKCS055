import axios from "axios";

/**
 * Pre-configured Axios client.
 * Injects JWT Bearer token into outgoing HTTP requests and supports CORS credentials.
 * Automatically checks VITE_API_URL or defaults to localhost backend.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  timeout: 4000,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;