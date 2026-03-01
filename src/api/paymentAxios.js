import axios from "axios";
import { getToken } from "../utils/auth";

const fallbackPaymentBaseUrl = "https://ordernest-payment-service.onrender.com";
const paymentBaseUrl = (import.meta.env.VITE_PAYMENT_API_BASE_URL || fallbackPaymentBaseUrl).replace(/\/+$/, "");

const paymentApi = axios.create({
  baseURL: paymentBaseUrl
});

paymentApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default paymentApi;
