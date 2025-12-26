import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useCart, useCartStore } from "~/lib/cart/cart-store";
import type { CreateOrderInput } from "~/lib/server/orders";
import { checkoutSchema, type CheckoutInput } from "~/lib/validations";

export const Route = createFileRoute("/(shop)/checkout")({
  component: CheckoutPage,
});

type ShippingZone = "amba" | "interior" | "pickup";

const SHIPPING_ZONES = {
  amba: {
    name: "AMBA",
    description: "Buenos Aires y alrededores",
    delivery: "1-3 días hábiles",
  },
  interior: {
    name: "Interior",
    description: "Resto del país",
    delivery: "5-10 días hábiles",
  },
  pickup: {
    name: "Retiro en local",
    description: "San Telmo, CABA",
    delivery: "Mismo día",
  },
} as const;

const PROVINCES = [
  "Buenos Aires",
  "CABA",
  "Catamarca",
  "Chaco",
  "Chubut",
  "Córdoba",
  "Corrientes",
  "Entre Ríos",
  "Formosa",
  "Jujuy",
  "La Pampa",
  "La Rioja",
  "Mendoza",
  "Misiones",
  "Neuquén",
  "Río Negro",
  "Salta",
  "San Juan",
  "San Luis",
  "Santa Cruz",
  "Santa Fe",
  "Santiago del Estero",
  "Tierra del Fuego",
  "Tucumán",
];

function calculateShipping(zone: ShippingZone, subtotal: number): number {
  // Prices in centavos (ARS)
  if (zone === "pickup") return 0;

  // Free shipping over $50,000 for AMBA
  if (zone === "amba" && subtotal >= 5000000) return 0;

  // Base shipping costs
  if (zone === "amba") return 350000; // $3,500
  return 550000; // $5,500 for interior
}

function formatPrice(priceInCentavos: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(priceInCentavos / 100);
}

function CheckoutPage() {
  const navigate = useNavigate();
  const { state, subtotal } = useCart();
  const clearCart = useCartStore((s) => s.clearCart);
  const [shippingZone, setShippingZone] = useState<ShippingZone>("amba");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingCost = calculateShipping(shippingZone, subtotal);
  const total = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSubmitting(true);
    setErrors({});

    const formData = new FormData(e.currentTarget);

    const data: CheckoutInput = {
      email: formData.get("email") as string,
      shippingAddress: {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        street: formData.get("street") as string,
        apartment: (formData.get("apartment") as string) || undefined,
        city: formData.get("city") as string,
        province: formData.get("province") as string,
        postalCode: formData.get("postalCode") as string,
        phone: formData.get("phone") as string,
        country: "Argentina",
      },
      sameAsBilling: true,
      paymentMethod: "mercadopago" as const,
    };

    const result = checkoutSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        fieldErrors[path] = issue.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      return;
    }

    // Create order in database
    try {
      const orderData: CreateOrderInput = {
        guestEmail: result.data.email,
        items: state.items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          productSku: null,
          productImage: item.image,
          unitPrice: item.price,
          quantity: item.quantity,
        })),
        subtotal,
        shippingCost,
        total,
        paymentMethod: result.data.paymentMethod,
        shippingAddress: {
          fullName: `${result.data.shippingAddress.firstName} ${result.data.shippingAddress.lastName}`,
          phone: result.data.shippingAddress.phone,
          street: result.data.shippingAddress.street,
          number: "", // Street number is in the street field
          floor: result.data.shippingAddress.apartment?.split(" ")[0],
          apartment: result.data.shippingAddress.apartment,
          city: result.data.shippingAddress.city,
          province: result.data.shippingAddress.province,
          postalCode: result.data.shippingAddress.postalCode,
          zone: shippingZone,
        },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const orderResult = (await response.json()) as
        | { success: true; order: { id: string; orderNumber: string } }
        | { success: false; error: string };

      if (!orderResult.success) {
        toast.error("Error al crear el pedido. Por favor intentá de nuevo.");
        setIsSubmitting(false);
        return;
      }

      // Clear cart and redirect to confirmation
      clearCart();
      toast.success("¡Pedido creado exitosamente!");
      await navigate({
        to: "/order-confirmation",
        search: { orderId: orderResult.order.id },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Error al procesar el pedido. Por favor intentá de nuevo.");
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="mb-4 text-2xl font-bold">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-8">
          Agregá productos para continuar con la compra
        </p>
        <Button onClick={() => navigate({ to: "/products" })}>Ver productos</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Finalizar compra</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-8 lg:col-span-2">
          {/* Contact Information */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Información de contacto</h2>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="text-destructive mt-1 text-sm">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Dirección de envío</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">Nombre *</Label>
                <Input id="firstName" name="firstName" required />
                {errors["shippingAddress.firstName"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["shippingAddress.firstName"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Apellido *</Label>
                <Input id="lastName" name="lastName" required />
                {errors["shippingAddress.lastName"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["shippingAddress.lastName"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  placeholder="+54 11 1234-5678"
                />
                {errors["shippingAddress.phone"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["shippingAddress.phone"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="postalCode">Código Postal *</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  required
                  placeholder="1234"
                  maxLength={4}
                />
                {errors["shippingAddress.postalCode"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["shippingAddress.postalCode"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="street">Calle *</Label>
                <Input id="street" name="street" required />
                {errors["shippingAddress.street"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["shippingAddress.street"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="apartment">Piso/Depto</Label>
                <Input id="apartment" name="apartment" placeholder="Opcional" />
              </div>
              <div>
                <Label htmlFor="city">Ciudad *</Label>
                <Input id="city" name="city" required />
                {errors["shippingAddress.city"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["shippingAddress.city"]}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="province">Provincia *</Label>
                <select
                  id="province"
                  name="province"
                  required
                  className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Seleccionar...</option>
                  {PROVINCES.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
                {errors["shippingAddress.province"] && (
                  <p className="text-destructive mt-1 text-sm">
                    {errors["shippingAddress.province"]}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Zone */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Método de envío</h2>
            <div className="space-y-3">
              {(Object.keys(SHIPPING_ZONES) as ShippingZone[]).map((zone) => {
                const info = SHIPPING_ZONES[zone];
                const cost = calculateShipping(zone, subtotal);
                return (
                  <label
                    key={zone}
                    className={`border-input hover:border-primary flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors ${
                      shippingZone === zone ? "border-primary bg-muted/50" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="shippingZone"
                      value={zone}
                      checked={shippingZone === zone}
                      onChange={(e) => setShippingZone(e.target.value as ShippingZone)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{info.name}</p>
                        <p className="font-bold">
                          {cost === 0 ? "Gratis" : formatPrice(cost)}
                        </p>
                      </div>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                      <p className="text-muted-foreground text-sm">
                        Entrega: {info.delivery}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Método de pago</h2>
            <div className="space-y-3">
              <label className="border-primary bg-muted/50 flex cursor-pointer items-start gap-3 rounded-lg border p-4">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="mercadopago"
                  defaultChecked
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium">Mercado Pago</p>
                  <p className="text-muted-foreground text-sm">
                    Tarjetas de crédito/débito, efectivo, transferencia
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Hasta 12 cuotas sin interés
                  </p>
                </div>
              </label>
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Procesando..." : "Continuar al pago"}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card sticky top-4 rounded-lg border p-6">
            <h2 className="mb-4 text-xl font-semibold">Resumen del pedido</h2>
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-muted-foreground text-sm">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>{shippingCost === 0 ? "Gratis" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
