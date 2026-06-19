import { apiRequest } from "@/lib/api-client";

export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

/** POST /api/orders/checkout */
export type CheckoutResponse = {
  orderId: string;
  status: string;
  paymentStatus: PaymentStatus;
  checkoutUrl: string;
  total: number;
};

export type CheckoutSession = CheckoutResponse;

export type OrderItem = {
  sku: string;
  name: string;
  sizeLabel?: string;
  packType?: "single" | "crate";
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

/** GET /api/orders list item */
export type OrderListItem = {
  id: string;
  status: string;
  total: number;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
  paidAt: string | null;
};

/** GET /api/orders/:orderId */
export type Order = OrderListItem & {
  currency: string;
  items: OrderItem[];
  notes?: string;
  receiptUrl?: string | null;
};

type RawOrder = Record<string, unknown>;

function toNumber(value: unknown, fallback = 0): number {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function normalizePaymentStatus(value: unknown): PaymentStatus {
  const normalized = String(value ?? "").toLowerCase();
  if (
    normalized === "paid" ||
    normalized === "failed" ||
    normalized === "expired" ||
    normalized === "pending"
  ) {
    return normalized;
  }
  return "pending";
}

function normalizeOrderItem(raw: unknown): OrderItem {
  const item = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const quantity = toNumber(item.quantity, 1);
  const unitPrice = toNumber(item.unitPrice ?? item.price, 0);
  return {
    sku: String(item.sku ?? item.productId ?? ""),
    name: String(item.name ?? "Item"),
    sizeLabel: item.sizeLabel ? String(item.sizeLabel) : undefined,
    packType:
      item.packType === "crate" || item.packType === "single"
        ? item.packType
        : undefined,
    quantity,
    unitPrice,
    lineTotal: toNumber(item.lineTotal, unitPrice * quantity),
  };
}

function normalizeOrderListItem(raw: RawOrder): OrderListItem {
  return {
    id: String(raw.id ?? raw.orderId ?? ""),
    status: String(raw.status ?? "placed"),
    total: toNumber(raw.total ?? raw.totalAmount, 0),
    paymentMethod:
      typeof raw.paymentMethod === "string" ? raw.paymentMethod : undefined,
    paymentStatus: normalizePaymentStatus(raw.paymentStatus),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    paidAt:
      typeof raw.paidAt === "string"
        ? raw.paidAt
        : typeof raw.paid_at === "string"
        ? (raw.paid_at as string)
        : null,
  };
}

export function normalizeOrder(raw: RawOrder): Order {
  const base = normalizeOrderListItem(raw);
  const items = Array.isArray(raw.items) ? raw.items.map(normalizeOrderItem) : [];
  return {
    ...base,
    currency: String(raw.currency ?? "EUR").toUpperCase(),
    items,
    receiptUrl:
      typeof raw.receiptUrl === "string"
        ? raw.receiptUrl
        : typeof raw.receipt_url === "string"
        ? (raw.receipt_url as string)
        : null,
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
  };
}

export async function startCheckout(notes?: string): Promise<CheckoutSession> {
  const trimmed = notes?.trim();
  return apiRequest<CheckoutResponse>("/orders/checkout", {
    method: "POST",
    auth: true,
    body: trimmed ? { notes: trimmed } : {},
  });
}

export async function getOrders(): Promise<OrderListItem[]> {
  const response = await apiRequest<{ items: RawOrder[] }>("/orders", {
    auth: true,
  });
  return (response.items ?? []).map(normalizeOrderListItem);
}

export async function getOrder(orderId: string): Promise<Order> {
  const response = await apiRequest<RawOrder>(`/orders/${encodeURIComponent(orderId)}`, {
    auth: true,
  });
  return normalizeOrder(response);
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  } catch {
    return `${currency.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
