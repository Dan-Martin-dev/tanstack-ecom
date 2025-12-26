import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { getOrderById } from "~/lib/server/orders";

const orderConfirmationSearch = z.object({
  orderId: z.string(),
});

export const Route = createFileRoute("/(shop)/order-confirmation")({
  validateSearch: orderConfirmationSearch,
  loaderDeps: ({ search }) => ({ orderId: search.orderId }),
  loader: async ({ deps }) => {
    const order = await getOrderById(deps.orderId);
    return { order };
  },
  component: OrderConfirmationPage,
});

function formatPrice(priceInCentavos: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(priceInCentavos / 100);
}

function OrderConfirmationPage() {
  const { order } = Route.useLoaderData();

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Pedido no encontrado</h1>
        <p className="text-muted-foreground mb-8">
          No pudimos encontrar el pedido. Si realizaste una compra, revisá tu email.
        </p>
        <Link to="/">
          <Button>Volver al inicio</Button>
        </Link>
      </div>
    );
  }

  const statusMessages = {
    pending: {
      title: "¡Gracias por tu pedido!",
      description: "Tu pedido fue recibido y está pendiente de pago.",
      icon: "⏳",
      color: "text-yellow-600",
    },
    paid: {
      title: "¡Pago confirmado!",
      description: "Tu pago fue procesado exitosamente.",
      icon: "✅",
      color: "text-green-600",
    },
    processing: {
      title: "Preparando tu pedido",
      description: "Estamos preparando tu pedido para el envío.",
      icon: "📦",
      color: "text-blue-600",
    },
    shipped: {
      title: "¡En camino!",
      description: "Tu pedido fue despachado.",
      icon: "🚚",
      color: "text-blue-600",
    },
    delivered: {
      title: "Entregado",
      description: "Tu pedido fue entregado.",
      icon: "🎉",
      color: "text-green-600",
    },
    cancelled: {
      title: "Pedido cancelado",
      description: "Este pedido fue cancelado.",
      icon: "❌",
      color: "text-red-600",
    },
    refunded: {
      title: "Pedido reembolsado",
      description: "El monto fue reembolsado.",
      icon: "💰",
      color: "text-gray-600",
    },
  };

  const statusInfo = statusMessages[order.status] || statusMessages.pending;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 text-6xl">{statusInfo.icon}</div>
          <h1 className={`mb-2 text-3xl font-bold ${statusInfo.color}`}>
            {statusInfo.title}
          </h1>
          <p className="text-muted-foreground">{statusInfo.description}</p>
        </div>

        {/* Order Info */}
        <div className="bg-card mb-6 rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pedido #{order.orderNumber}</h2>
            <span
              className={`rounded-full px-3 py-1 text-sm font-medium ${
                order.status === "paid" || order.status === "delivered"
                  ? "bg-green-100 text-green-800"
                  : order.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {order.status === "pending"
                ? "Pendiente"
                : order.status === "paid"
                  ? "Pagado"
                  : order.status === "processing"
                    ? "Procesando"
                    : order.status === "shipped"
                      ? "Enviado"
                      : order.status === "delivered"
                        ? "Entregado"
                        : order.status === "cancelled"
                          ? "Cancelado"
                          : "Reembolsado"}
            </span>
          </div>

          <div className="text-muted-foreground text-sm">
            <p>
              Fecha:{" "}
              {new Date(order.createdAt).toLocaleDateString("es-AR", {
                day: "numeric",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-card mb-6 rounded-lg border p-6">
          <h3 className="mb-4 font-semibold">Productos</h3>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium">{item.productName}</p>
                  <p className="text-muted-foreground text-sm">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="font-medium">{formatPrice(item.total)}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t pt-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>
                {order.shippingCost === 0 ? "Gratis" : formatPrice(order.shippingCost)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-card mb-6 rounded-lg border p-6">
          <h3 className="mb-4 font-semibold">Dirección de envío</h3>
          <div className="text-muted-foreground space-y-1">
            <p className="text-foreground font-medium">{order.shippingFullName}</p>
            <p>
              {order.shippingStreet} {order.shippingNumber}
              {order.shippingFloor && `, Piso ${order.shippingFloor}`}
              {order.shippingApartment && ` ${order.shippingApartment}`}
            </p>
            <p>
              {order.shippingCity}, {order.shippingProvince}
            </p>
            <p>CP {order.shippingPostalCode}</p>
            <p>{order.shippingPhone}</p>
          </div>
          <div className="mt-3">
            <span
              className={`rounded px-2 py-1 text-xs ${
                order.shippingZone === "pickup"
                  ? "bg-green-100 text-green-800"
                  : order.shippingZone === "amba"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-purple-100 text-purple-800"
              }`}
            >
              {order.shippingZone === "pickup"
                ? "Retiro en local"
                : order.shippingZone === "amba"
                  ? "AMBA"
                  : "Interior"}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card mb-6 rounded-lg border p-6">
          <h3 className="mb-4 font-semibold">Método de pago</h3>
          <p className="text-muted-foreground">
            {order.paymentMethod === "mercadopago"
              ? "Mercado Pago"
              : order.paymentMethod === "bank_transfer"
                ? "Transferencia bancaria"
                : "Pago contra entrega"}
          </p>
          {order.status === "pending" && order.paymentMethod === "mercadopago" && (
            <div className="mt-4">
              <Button className="w-full" size="lg">
                Ir a pagar con Mercado Pago
              </Button>
              <p className="text-muted-foreground mt-2 text-center text-xs">
                Serás redirigido a Mercado Pago para completar el pago
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-muted/50 rounded-lg border p-6">
          <h3 className="mb-4 font-semibold">Próximos pasos</h3>
          <ul className="text-muted-foreground space-y-2 text-sm">
            {order.status === "pending" && (
              <>
                <li>✉️ Te enviamos un email con los detalles del pedido</li>
                <li>💳 Completá el pago para confirmar tu compra</li>
                <li>📦 Una vez confirmado, prepararemos tu pedido</li>
              </>
            )}
            {order.status === "paid" && (
              <>
                <li>✅ Tu pago fue confirmado</li>
                <li>📦 Estamos preparando tu pedido</li>
                <li>🚚 Te notificaremos cuando sea despachado</li>
              </>
            )}
            {order.status === "shipped" && (
              <>
                <li>🚚 Tu pedido está en camino</li>
                {order.trackingNumber && (
                  <li>
                    📍 Número de seguimiento:{" "}
                    <span className="font-mono">{order.trackingNumber}</span>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link to="/products">
            <Button variant="outline">Seguir comprando</Button>
          </Link>
          <Link to="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
