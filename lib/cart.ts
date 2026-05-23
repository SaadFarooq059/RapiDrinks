export const CART_STORAGE_KEY = "rapid_drinks_cart_items";
export const CART_UPDATED_EVENT = "rapid-drinks-cart-updated";

export type CartItem = {
  id: string;
  name: string;
  categoryLabel: string;
  price: number;
  minOrder: number;
  quantity: number;
};

function sanitizeCartItems(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;
      const item = entry as Partial<CartItem>;
      if (!item.id || !item.name || !item.categoryLabel) return null;

      return {
        id: String(item.id),
        name: String(item.name),
        categoryLabel: String(item.categoryLabel),
        price: Number.isFinite(item.price) ? Number(item.price) : 0,
        minOrder:
          Number.isFinite(item.minOrder) && Number(item.minOrder) > 0
            ? Math.floor(Number(item.minOrder))
            : 1,
        quantity:
          Number.isFinite(item.quantity) && Number(item.quantity) > 0
            ? Math.floor(Number(item.quantity))
            : 1,
      };
    })
    .filter((item): item is CartItem => item !== null);
}

function emitCartUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function getCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return sanitizeCartItems(JSON.parse(raw));
  } catch {
    return [];
  }
}

export function setCartItems(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  emitCartUpdated();
}

export function addToCart(
  item: Omit<CartItem, "quantity"> & { quantity?: number }
): void {
  const existing = getCartItems();
  const quantityToAdd =
    Number.isFinite(item.quantity) && Number(item.quantity) > 0
      ? Math.floor(Number(item.quantity))
      : Math.max(1, Math.floor(item.minOrder || 1));

  const idx = existing.findIndex((entry) => entry.id === item.id);
  if (idx >= 0) {
    existing[idx] = {
      ...existing[idx],
      quantity: existing[idx].quantity + quantityToAdd,
    };
  } else {
    existing.push({
      ...item,
      quantity: quantityToAdd,
      minOrder: Math.max(1, Math.floor(item.minOrder || 1)),
      price: Number.isFinite(item.price) ? Number(item.price) : 0,
    });
  }

  setCartItems(existing);
}

export function updateCartItemQuantity(id: string, quantity: number): void {
  const existing = getCartItems();
  const next = existing
    .map((item) => (item.id === id ? { ...item, quantity: Math.floor(quantity) } : item))
    .filter((item) => item.quantity > 0);
  setCartItems(next);
}

export function removeFromCart(id: string): void {
  const existing = getCartItems();
  setCartItems(existing.filter((item) => item.id !== id));
}

export function clearCart(): void {
  setCartItems([]);
}

export function getCartCount(): number {
  return getCartItems().reduce((sum, item) => sum + item.quantity, 0);
}

export function getCartSubtotal(): number {
  return getCartItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
}
