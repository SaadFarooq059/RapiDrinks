import { apiRequest } from "@/lib/api-client";

export const CART_UPDATED_EVENT = "rapid-drinks-cart-updated";

export type CartItem = {
  sku: string;
  name: string;
  sizeLabel: string;
  packType: "single" | "crate";
  price: number;
  minOrder: number;
  quantity: number;
  imageUrl?: string;
};

type CartResponseItem = {
  sku: string;
  name: string;
  sizeLabel: string;
  packType: "single" | "crate";
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  imageUrl?: string;
  minOrder?: number;
};

type CartApiResponse = {
  items: CartResponseItem[];
  totals: {
    subtotal: number;
    totalItems: number;
    totalQuantity: number;
  };
};

function emitCartUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

function mapCartItem(item: CartResponseItem): CartItem {
  return {
    sku: item.sku,
    name: item.name,
    sizeLabel: item.sizeLabel,
    packType: item.packType,
    price: item.unitPrice,
    minOrder: item.minOrder && item.minOrder > 0 ? item.minOrder : 1,
    quantity: item.quantity > 0 ? item.quantity : 1,
    imageUrl: item.imageUrl,
  };
}

export async function getCart(): Promise<CartApiResponse> {
  return apiRequest<CartApiResponse>("/cart", {
    auth: true,
  });
}

export async function getCartItems(): Promise<CartItem[]> {
  const response = await getCart();
  return response.items.map(mapCartItem);
}

export async function addToCart(
  item: { sku?: string; id?: string; quantity?: number; minOrder?: number }
): Promise<void> {
  const sku = item.sku || item.id;
  if (!sku) {
    throw new Error("Missing sku for cart item.");
  }
  const quantity =
    Number.isFinite(item.quantity) && Number(item.quantity) > 0
      ? Math.floor(Number(item.quantity))
      : Math.max(1, Math.floor(item.minOrder || 1));

  await apiRequest("/cart/items", {
    method: "POST",
    auth: true,
    body: {
      sku,
      quantity,
    },
  });
  emitCartUpdated();
}

export async function updateCartItemQuantity(sku: string, quantity: number): Promise<void> {
  await apiRequest(`/cart/items/${encodeURIComponent(sku)}`, {
    method: "PATCH",
    auth: true,
    body: {
      quantity: Math.max(1, Math.floor(quantity)),
    },
  });
  emitCartUpdated();
}

export async function removeFromCart(sku: string): Promise<void> {
  await apiRequest(`/cart/items/${encodeURIComponent(sku)}`, {
    method: "DELETE",
    auth: true,
  });
  emitCartUpdated();
}

export async function clearCart(): Promise<void> {
  await apiRequest("/cart", {
    method: "DELETE",
    auth: true,
  });
  emitCartUpdated();
}

export async function getCartCount(): Promise<number> {
  const response = await getCart();
  return response.totals.totalQuantity;
}

export async function getCartSubtotal(): Promise<number> {
  const response = await getCart();
  return response.totals.subtotal;
}
