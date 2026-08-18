export type OrderStatus =
  | "PENDING"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type ShippingMethodId =
  | "PRAGUE_DELIVERY"
  | "PACKETA_PICKUP"
  | "PACKETA_ADDRESS";

export type PaymentMethodId = "STRIPE_CARD" | "COD";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "COD_PENDING"
  | "COD_COLLECTED";

export interface OrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  email: string;
  firstName: string;
  lastName: string;
  totalPrice: number; // in haléře
  paymentMethod: PaymentMethodId;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethodId;
  createdAt: Date;
  items: OrderItemSummary[];
}

export interface OrderItemSummary {
  productSlug: string;
  productName: string;
  quantity: number;
  unitPrice: number; // in haléře
  totalPrice: number; // in haléře
}

/** Mapped labels for order statuses in Czech */
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "Čeká na platbu",
  AWAITING_PAYMENT: "Čeká na platbu při převzetí",
  PAID: "Zaplaceno",
  PROCESSING: "Připravuje se",
  SHIPPED: "Odesláno",
  DELIVERED: "Doručeno",
  CANCELLED: "Zrušeno",
  REFUNDED: "Vráceno",
};

/** Mapped colors for order status badges */
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  AWAITING_PAYMENT: "bg-orange-100 text-orange-800",
  PAID: "bg-green-100 text-green-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-gray-100 text-gray-800",
};
