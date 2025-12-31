import { createFileRoute } from "@tanstack/react-router";
import { json } from "@tanstack/react-start";
import {
  getPaymentDetails,
  verifyWebhookSignature,
  type MercadoPagoWebhookEvent,
} from "~/lib/checkout/mercadopago";
import { updateOrderStatus } from "~/lib/server/orders";

export const Route = createFileRoute("/api/webhooks/mercadopago")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Get headers for signature verification
          const signature = request.headers.get("x-signature");
          const xRequestId = request.headers.get("x-request-id");

          const body = (await request.json()) as MercadoPagoWebhookEvent;

          console.log("Mercado Pago webhook received:", {
            type: body.type,
            action: body.action,
            dataId: body.data.id,
          });

          // Verify signature if available
          if (signature && xRequestId) {
            const isValid = verifyWebhookSignature(signature, xRequestId, body.data.id);
            if (!isValid) {
              console.error("Invalid webhook signature");
              return json({ error: "Invalid signature" }, { status: 401 });
            }
          }

          // Only process payment events
          if (body.type !== "payment") {
            return json({ status: "ignored" });
          }

          // Get payment details from Mercado Pago
          const paymentResult = await getPaymentDetails(body.data.id);

          if (!paymentResult.success) {
            console.error("Failed to fetch payment details:", paymentResult.error);
            return json({ error: "Failed to fetch payment" }, { status: 500 });
          }

          const payment = paymentResult.payment;
          const orderId = payment.externalReference;

          if (!orderId) {
            console.error("No external reference (orderId) in payment");
            return json({ error: "Missing order reference" }, { status: 400 });
          }

          // Map Mercado Pago payment status to order status
          let orderStatus: "paid" | "cancelled" | "pending" = "pending";

          switch (payment.status) {
            case "approved":
              orderStatus = "paid";
              break;
            case "rejected":
            case "cancelled":
              orderStatus = "cancelled";
              break;
            case "pending":
            case "in_process":
            case "in_mediation":
            case "authorized":
              orderStatus = "pending";
              break;
            default:
              console.warn("Unknown payment status:", payment.status);
          }

          // Update order status in database
          const updateResult = await updateOrderStatus(orderId, orderStatus);

          if (!updateResult.success) {
            console.error("Failed to update order status:", updateResult.error);
            return json({ error: "Failed to update order" }, { status: 500 });
          }

          console.log("Order updated successfully:", {
            orderId,
            paymentId: payment.id,
            status: orderStatus,
          });

          return json({
            status: "success",
            orderId,
            paymentStatus: payment.status,
          });
        } catch (error) {
          console.error("Webhook processing error:", error);
          return json({ error: "Internal server error" }, { status: 500 });
        }
      },
    },
  },
});
