import type { Uuid } from "./common";

export interface ProductResponse {
  id: Uuid;
  name: string;
  price: number;
  currency: string;
  availableQuantity: number;
  description: string;
}

export type ListProductsResponse = ProductResponse[];

export type GetProductByIdResponse = ProductResponse;

export interface UpdateProductStockRequest {
  availableQuantity: number;
}

export type UpdateProductStockResponse = ProductResponse;
