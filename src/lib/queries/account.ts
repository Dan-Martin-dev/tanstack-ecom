import { queryOptions } from "@tanstack/react-query";

// Types based on schema
export interface Order {
  id: number;
  orderNumber: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "refunded";
  paymentMethod: "mercado_pago" | "transfer" | "cash_on_delivery";
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  shippingZone: "amba" | "interior" | "pickup";
  shippingAddress: string | null;
  trackingNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  productName: string;
  productImage: string | null;
  quantity: number;
  priceAtTime: number;
}

export interface Address {
  id: number;
  userId: string;
  name: string;
  fullName: string;
  phone: string;
  street: string;
  number: string;
  floor: string | null;
  apartment: string | null;
  city: string;
  province: string;
  postalCode: string;
  notes: string | null;
  isDefault: boolean;
}

export interface Review {
  id: number;
  productId: number;
  userId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  product: {
    name: string;
    slug: string;
    image: string;
  };
}

export interface WishlistItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    compareAtPrice: number | null;
    stock: number;
    image: string;
  };
  addedAt: Date;
}

// API functions
async function fetchUserOrders(): Promise<Order[]> {
  const response = await fetch("/api/account/orders");
  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }
  return response.json();
}

async function fetchOrderById(orderId: number): Promise<Order> {
  const response = await fetch(`/api/account/orders/${orderId}`);
  if (!response.ok) {
    throw new Error("Order not found");
  }
  return response.json();
}

async function fetchUserAddresses(): Promise<Address[]> {
  const response = await fetch("/api/account/addresses");
  if (!response.ok) {
    throw new Error("Failed to fetch addresses");
  }
  return response.json();
}

async function fetchUserReviews(): Promise<Review[]> {
  const response = await fetch("/api/account/reviews");
  if (!response.ok) {
    throw new Error("Failed to fetch reviews");
  }
  return response.json();
}

async function fetchUserWishlist(): Promise<WishlistItem[]> {
  const response = await fetch("/api/account/wishlist");
  if (!response.ok) {
    throw new Error("Failed to fetch wishlist");
  }
  return response.json();
}

// Query Options
export const userOrdersQueryOptions = () =>
  queryOptions({
    queryKey: ["user", "orders"],
    queryFn: fetchUserOrders,
  });

export const orderQueryOptions = (orderId: number) =>
  queryOptions({
    queryKey: ["user", "orders", orderId],
    queryFn: () => fetchOrderById(orderId),
  });

export const userAddressesQueryOptions = () =>
  queryOptions({
    queryKey: ["user", "addresses"],
    queryFn: fetchUserAddresses,
  });

export const userReviewsQueryOptions = () =>
  queryOptions({
    queryKey: ["user", "reviews"],
    queryFn: fetchUserReviews,
  });

export const userWishlistQueryOptions = () =>
  queryOptions({
    queryKey: ["user", "wishlist"],
    queryFn: fetchUserWishlist,
  });
