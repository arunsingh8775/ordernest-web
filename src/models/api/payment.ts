import type { Uuid } from "./common";

export interface ProcessPaymentRequest {
  orderId: Uuid;
}

export type ProcessPaymentResponse = void;
