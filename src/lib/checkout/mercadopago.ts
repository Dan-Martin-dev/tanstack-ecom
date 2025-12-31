import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import crypto from "node:crypto";

// Initialize Mercado Pago client
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error("MERCADO_PAGO_ACCESS_TOKEN is not set in environment variables");
}

const client = new MercadoPagoConfig({
  accessToken,
  options: {
    timeout: 5000,
  },
});

const preferenceClient = new Preference(client);
const paymentClient = new Payment(client);

export interface CreatePreferenceInput {
  orderId: string;
  orderNumber: string;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unitPrice: number; // In centavos
  }>;
  shippingCost: number; // In centavos
  payer: {
    email: string;
    name?: string;
    phone?: string;
  };
}

/**
 * Create a Mercado Pago payment preference
 * Returns the preference ID and init_point URL for redirect
 */
export async function createPaymentPreference(input: CreatePreferenceInput) {
  try {
    const preference = await preferenceClient.create({
      body: {
        items: input.items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unitPrice / 100, // Convert centavos to pesos
          currency_id: "ARS",
        })),
        shipments: {
          cost: input.shippingCost / 100, // Convert centavos to pesos
          mode: "not_specified",
        },
        payer: {
          email: input.payer.email,
          name: input.payer.name,
          phone: input.payer.phone
            ? {
                number: input.payer.phone,
              }
            : undefined,
        },
        back_urls: {
          success: `${process.env.VITE_BASE_URL}/order-confirmation?orderId=${input.orderId}`,
          failure: `${process.env.VITE_BASE_URL}/checkout?error=payment_failed`,
          pending: `${process.env.VITE_BASE_URL}/order-confirmation?orderId=${input.orderId}`,
        },
        auto_return: "approved",
        external_reference: input.orderId,
        notification_url: `${process.env.VITE_BASE_URL}/api/webhooks/mercadopago`,
        statement_descriptor: "Tu Tienda",
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 12, // Up to 12 installments
        },
      },
    });

    return {
      success: true as const,
      preferenceId: preference.id!,
      initPoint: preference.init_point!,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  } catch (error) {
    console.error("Mercado Pago preference creation error:", error);
    return {
      success: false as const,
      error: "Failed to create payment preference",
    };
  }
}

/**
 * Get payment details from Mercado Pago
 */
export async function getPaymentDetails(paymentId: string) {
  try {
    const payment = await paymentClient.get({ id: paymentId });
    return {
      success: true as const,
      payment: {
        id: payment.id,
        status: payment.status,
        statusDetail: payment.status_detail,
        transactionAmount: payment.transaction_amount,
        externalReference: payment.external_reference,
        paymentMethod: payment.payment_method_id,
        paymentType: payment.payment_type_id,
        dateCreated: payment.date_created,
        dateApproved: payment.date_approved,
      },
    };
  } catch (error) {
    console.error("Mercado Pago payment fetch error:", error);
    return {
      success: false as const,
      error: "Failed to fetch payment details",
    };
  }
}

/**
 * Verify Mercado Pago webhook signature (x-signature header)
 * This helps ensure the webhook request is actually from Mercado Pago
 */
export function verifyWebhookSignature(
  signature: string,
  xRequestId: string,
  dataId: string,
): boolean {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;

  if (!secret) {
    console.warn("MERCADO_PAGO_WEBHOOK_SECRET not set, skipping signature verification");
    return true; // Allow in development without secret
  }

  // Mercado Pago signature verification
  // Format: ts={timestamp},v1={signature}
  try {
    const parts = signature.split(",");
    const ts = parts.find((p) => p.startsWith("ts="))?.split("=")[1];
    const hash = parts.find((p) => p.startsWith("v1="))?.split("=")[1];

    if (!ts || !hash) return false;

    const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(manifest);
    const expectedHash = hmac.digest("hex");

    return hash === expectedHash;
  } catch (error) {
    console.error("Webhook signature verification error:", error);
    return false;
  }
}

export type MercadoPagoWebhookEvent = {
  action: string;
  api_version: string;
  data: {
    id: string;
  };
  date_created: string;
  id: number;
  live_mode: boolean;
  type: "payment" | "merchant_order" | "subscription";
  user_id: string;
};
