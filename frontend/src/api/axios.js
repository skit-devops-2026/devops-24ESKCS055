import axios from "axios";

/**
 * Pre-configured Axios client.
 * Injects JWT Bearer token into outgoing HTTP requests and supports CORS credentials.
 */
const api = axios.create({
  baseURL: "http://localhost:3000/api",
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