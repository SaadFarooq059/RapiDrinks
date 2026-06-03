import { apiRequest } from "@/lib/api-client";

export type PaymentStatus = "pending" | "paid" | "failed" | "expired";

export type CheckoutSession = {
  orderId: string;
  checkoutUrl: string;
  total: number;
  status: string;
  paymentStatus: PaymentStatus;
};

export type OrderItem = {
  sku: string;
  name: string;
  sizeLabel?: string;
  packType?: "single" | "crate";
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  items: OrderItem[];
  receiptUrl?: string | null;
  totalQuantity?: number;
  notes?: string;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
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

export function normalizeOrder(raw: RawOrder): Order {
  const items = Array.isArray(raw.items) ? raw.items.map(normalizeOrderItem) : [];
  return {
    id: String(raw.id ?? raw.orderId ?? ""),
    status: String(raw.status ?? "placed"),
    total: toNumber(raw.total ?? raw.totalAmount, 0),
    currency: String(raw.currency ?? "EUR").toUpperCase(),
    createdAt: String(raw.createdAt ?? raw.created_at ?? ""),
    items,
    receiptUrl:
      typeof raw.receiptUrl === "string"
        ? raw.receiptUrl
        : typeof raw.receipt_url === "string"
        ? (raw.receipt_url as string)
        : null,
    totalQuantity:
      raw.totalQuantity !== undefined
        ? toNumber(raw.totalQuantity)
        : items.reduce((sum, item) => sum + item.quantity, 0),
    notes: typeof raw.notes === "string" ? raw.notes : undefined,
    paymentMethod:
      typeof raw.paymentMethod === "string" ? raw.paymentMethod : undefined,
    paymentStatus: normalizePaymentStatus(raw.paymentStatus),
    paidAt:
      typeof raw.paidAt === "string"
        ? raw.paidAt
        : typeof raw.paid_at === "string"
        ? (raw.paid_at as string)
        : null,
  };
}

export async function startCheckout(notes?: string): Promise<CheckoutSession> {
  const trimmed = notes?.trim();
  return apiRequest<CheckoutSession>("/orders/checkout", {
    method: "POST",
    auth: true,
    body: trimmed ? { notes: trimmed } : {},
  });
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiRequest<{ items?: RawOrder[] } | RawOrder[]>("/orders", {
    auth: true,
  });
  const list = Array.isArray(response) ? response : response.items ?? [];
  return list.map(normalizeOrder);
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
