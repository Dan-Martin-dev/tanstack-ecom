import { createServerOnlyFn } from "@tanstack/react-start";
import { desc, eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { order, orderItem } from "~/lib/db/schema/ecommerce.schema";

export type CreateOrderInput = {
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    productSku: string | null;
    productImage: string | null;
    unitPrice: number;
    quantity: number;
  }>;
  subtotal: number;
  shippingCost: number;
  discount?: number;
  total: number;
  paymentMethod: "mercadopago" | "cash_on_delivery" | "bank_transfer";
  shippingAddress: {
    fullName: string;
    phone: string;
    street: string;
    number: string;
    floor?: string;
    apartment?: string;
    city: string;
    province: string;
    postalCode: string;
    zone: "amba" | "interior" | "pickup";
    notes?: string;
  };
  customerNotes?: string;
};

/**
 * Generate a unique order number in format ORD-YYYY-NNNN
 */
async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `ORD-${year}-`;

  // Get the last order for this year
  const lastOrder = await db
    .select({ orderNumber: order.orderNumber })
    .from(order)
    .where(eq(order.orderNumber, prefix + "%"))
    .orderBy(desc(order.createdAt))
    .limit(1);

  let nextNumber = 1;
  if (lastOrder.length > 0) {
    const lastNumber = parseInt(lastOrder[0].orderNumber.split("-")[2]);
    nextNumber = lastNumber + 1;
  }

  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
}

export const createOrder = createServerOnlyFn(async (input: CreateOrderInput) => {
  try {
    const orderNumber = await generateOrderNumber();

    // Create order
    const [newOrder] = await db
      .insert(order)
      .values({
        orderNumber,
        userId: input.userId,
        status: "pending",
        subtotal: input.subtotal,
        shippingCost: input.shippingCost,
        discount: input.discount || 0,
        total: input.total,
        paymentMethod: input.paymentMethod,
        shippingFullName: input.shippingAddress.fullName,
        shippingPhone: input.shippingAddress.phone,
        shippingStreet: input.shippingAddress.street,
        shippingNumber: input.shippingAddress.number,
        shippingFloor: input.shippingAddress.floor || null,
        shippingApartment: input.shippingAddress.apartment || null,
        shippingCity: input.shippingAddress.city,
        shippingProvince: input.shippingAddress.province,
        shippingPostalCode: input.shippingAddress.postalCode,
        shippingZone: input.shippingAddress.zone,
        shippingNotes: input.shippingAddress.notes || null,
        customerNotes: input.customerNotes || null,
      })
      .returning();

    // Create order items
    if (input.items.length > 0) {
      await db.insert(orderItem).values(
        input.items.map((item) => ({
          orderId: newOrder.id,
          productId: item.productId,
          productName: item.productName,
          productSku: item.productSku,
          productImage: item.productImage,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
          total: item.unitPrice * item.quantity,
        })),
      );
    }

    return {
      success: true,
      order: newOrder,
    };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      error: "Failed to create order",
    };
  }
});

export const getOrderById = createServerOnlyFn(async (orderId: string) => {
  const [orderData] = await db.select().from(order).where(eq(order.id, orderId)).limit(1);

  if (!orderData) return null;

  const items = await db.select().from(orderItem).where(eq(orderItem.orderId, orderId));

  return {
    ...orderData,
    items,
  };
});

export const getUserOrders = createServerOnlyFn(async (userId: string) => {
  const orders = await db
    .select()
    .from(order)
    .where(eq(order.userId, userId))
    .orderBy(desc(order.createdAt));

  return orders;
});

export const updateOrderStatus = createServerOnlyFn(
  async (
    orderId: string,
    status:
      | "pending"
      | "paid"
      | "processing"
      | "shipped"
      | "delivered"
      | "cancelled"
      | "refunded",
  ) => {
    try {
      const [updatedOrder] = await db
        .update(order)
        .set({
          status,
          updatedAt: new Date(),
        })
        .where(eq(order.id, orderId))
        .returning();

      return {
        success: true,
        order: updatedOrder,
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      return {
        success: false,
        error: "Failed to update order status",
      };
    }
  },
);
