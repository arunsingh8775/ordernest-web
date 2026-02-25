import axios from "axios";
import { getToken } from "../utils/auth";

const fallbackInventoryBaseUrl = "https://ordernest-inventory-service.onrender.com";
const inventoryBaseUrl = (import.meta.env.VITE_INVENTORY_API_BASE_URL || fallbackInventoryBaseUrl).replace(/\/+$/, "");

const inventoryApi = axios.create({
  baseURL: inventoryBaseUrl
});

inventoryApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default inventoryApi;
