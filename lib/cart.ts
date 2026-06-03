import { apiRequest } from "@/lib/api-client";

export const CART_UPDATED_EVENT = "rapid-drinks-cart-updated";

export type CartItem = {
  id: string;
  name: string;
  categoryLabel: string;
  price: number;
  minOrder: number;
  quantity: number;
  imageUrl?: string;
};

type CartResponseItem = {
  productId: string;
  name: string;
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
    id: item.productId,
    name: item.name,
    categoryLabel: "Product",
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
  item: Omit<CartItem, "quantity"> & { quantity?: number }
): Promise<void> {
  const quantity =
    Number.isFinite(item.quantity) && Number(item.quantity) > 0
      ? Math.floor(Number(item.quantity))
      : Math.max(1, Math.floor(item.minOrder || 1));

  await apiRequest("/cart/items", {
    method: "POST",
    auth: true,
    body: {
      productId: item.id,
      quantity,
    },
  });
  emitCartUpdated();
}

export async function updateCartItemQuantity(id: string, quantity: number): Promise<void> {
  await apiRequest(`/cart/items/${encodeURIComponent(id)}`, {
    method: "PATCH",
    auth: true,
    body: {
      quantity: Math.max(1, Math.floor(quantity)),
    },
  });
  emitCartUpdated();
}

export async function removeFromCart(id: string): Promise<void> {
  await apiRequest(`/cart/items/${encodeURIComponent(id)}`, {
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
