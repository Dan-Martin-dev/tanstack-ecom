import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { createPaymentPreference } from "~/lib/checkout/mercadopago";
import { getOrderById } from "~/lib/server/orders";

export const Route = createFileRoute("/api/checkout/mercadopago")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { orderId: string };

          if (!body.orderId) {
            return json({ error: "Order ID is required" }, { status: 400 });
          }

          // Get order details
          const order = await getOrderById(body.orderId);

          if (!order) {
            return json({ error: "Order not found" }, { status: 404 });
          }

          // Create Mercado Pago payment preference
          const preferenceResult = await createPaymentPreference({
            orderId: order.id,
            orderNumber: order.orderNumber,
            items: order.items.map((item) => ({
              id: item.productId,
              title: item.productName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
            shippingCost: order.shippingCost,
            payer: {
              email: order.guestEmail || "customer@email.com",
              name: order.shippingFullName || undefined,
              phone: order.shippingPhone || undefined,
            },
          });

          if (!preferenceResult.success) {
            return json({ error: preferenceResult.error }, { status: 500 });
          }

          return json({
            preferenceId: preferenceResult.preferenceId,
            initPoint: preferenceResult.initPoint,
            sandboxInitPoint: preferenceResult.sandboxInitPoint,
          });
        } catch (error) {
          console.error("Mercado Pago checkout error:", error);
          return json({ error: "Internal server error" }, { status: 500 });
        }
      },
    },
  },
});
