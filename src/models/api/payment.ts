import type { Uuid } from "./common";

export interface CreatePaymentOrderRequest {
  orderId: Uuid;
}

export interface CreatePaymentOrderResponse {
  internalOrderId: Uuid;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
}

export interface VerifyPaymentRequest {
  orderId: Uuid;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface VerifyPaymentResponse {
  orderId: Uuid;
  paymentId: string;
  verified: boolean;
  message: string;
}
