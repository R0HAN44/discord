
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.API_BASE_URL || "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const parsedToken = JSON.parse(token);
        if (parsedToken) {
          config.headers.Authorization = `Bearer ${parsedToken}`;
        }
      } catch (error) {
        console.error("Failed to parse authToken:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    Promise.reject(error)
  }
);

export default axiosInstance;
