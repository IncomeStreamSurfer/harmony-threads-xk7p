export type CartItem = {
  product_id: string;
  qty: number;
  variant_sku?: string;
  name?: string;
  price?: number;
  image?: string;
};

const CART_KEY = "ht_cart";

export function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart:updated"));
}

export function addToCart(item: CartItem): void {
  const cart = getCart();
  const existing = cart.find(i => i.product_id === item.product_id && i.variant_sku === item.variant_sku);
  if (existing) {
    existing.qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
}

export function removeFromCart(product_id: string, variant_sku?: string): void {
  const cart = getCart().filter(i => !(i.product_id === product_id && i.variant_sku === variant_sku));
  saveCart(cart);
}

export function cartCount(): number {
  return getCart().reduce((sum, i) => sum + i.qty, 0);
}

export async function startCheckout(items: CartItem[], email?: string): Promise<void> {
  const res = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items, customer_email: email }),
  });
  const { url, error } = await res.json();
  if (error || !url) throw new Error(error ?? "Checkout failed");
  window.location.href = url;
}
