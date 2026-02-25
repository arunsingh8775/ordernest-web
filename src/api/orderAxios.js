import axios from "axios";
import { getToken } from "../utils/auth";

const fallbackOrderBaseUrl = "https://ordernest-order-service.onrender.com";
const orderBaseUrl = (import.meta.env.VITE_ORDER_API_BASE_URL || fallbackOrderBaseUrl).replace(/\/+$/, "");

const orderApi = axios.create({
  baseURL: orderBaseUrl
});

orderApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default orderApi;
