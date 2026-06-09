import { isProductionMode } from "./common";
import { getMpClient } from "./mercadoPago";

import { Payment } from "mercadopago";

export interface CreatePaymentInput {
  transactionAmount: number;
  description: string;
  payerEmail: string;
  payerFirstName: string;
  payerLastName: string;
  externalReference: string;
}

export interface CreatePaymentOutput {
  id: string;
  status: string;
  qrCode: string;
  qrCodeBase64: string;
  transactionAmount: number;
}

export interface PaymentStatusOutput {
  id: string;
  status: string;
}

export interface IPixService {
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput>;
  getPayment(paymentId: string): Promise<PaymentStatusOutput>;
}

class EmulatorPixService implements IPixService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.PIX_EMULATOR_URL || "http://localhost:3001";
  }

  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const body = {
      transaction_amount: input.transactionAmount,
      description: input.description,
      payment_method_id: "pix",
      payer: {
        email: input.payerEmail,
        first_name: input.payerFirstName,
        last_name: input.payerLastName,
      },
      external_reference: input.externalReference,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/webhook`,
    };

    const res = await fetch(`${this.baseUrl}/v1/payments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Emulator create payment failed: ${err}`);
    }

    const data = await res.json();
    return {
      id: data.id,
      status: data.status,
      qrCode: data.point_of_interaction?.transaction_data?.qr_code || "",
      qrCodeBase64:
        data.point_of_interaction?.transaction_data?.qr_code_base64 || "",
      transactionAmount: data.transaction_amount,
    };
  }

  async getPayment(paymentId: string): Promise<PaymentStatusOutput> {
    const res = await fetch(`${this.baseUrl}/v1/payments/${paymentId}`);

    if (!res.ok) {
      throw new Error(`Emulator get payment failed: ${res.statusText}`);
    }

    const data = await res.json();
    return { id: data.id, status: data.status };
  }
}

class MercadoPagoPixService implements IPixService {
  async createPayment(input: CreatePaymentInput): Promise<CreatePaymentOutput> {
    const payment = new Payment(getMpClient());
    const response = await payment.create({
      body: {
        transaction_amount: input.transactionAmount,
        description: input.description,
        payment_method_id: "pix",
        payer: {
          email: input.payerEmail,
          first_name: input.payerFirstName,
          last_name: input.payerLastName,
        },
        external_reference: input.externalReference,
      },
    });

    return {
      id: String(response.id),
      status: response.status || "pending",
      qrCode:
        response.point_of_interaction?.transaction_data?.qr_code || "",
      qrCodeBase64:
        response.point_of_interaction?.transaction_data?.qr_code_base64 ||
        "",
      transactionAmount: response.transaction_amount || 0,
    };
  }

  async getPayment(paymentId: string): Promise<PaymentStatusOutput> {
    const payment = new Payment(getMpClient());
    const result = await payment.get({ id: paymentId });
    return { id: paymentId, status: result.status || "unknown" };
  }
}

export function createPixService(): IPixService {
  return isProductionMode()
    ? new MercadoPagoPixService()
    : new EmulatorPixService();
}
