"use client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

export interface CartItemResponse {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    sku: string;
    image: string | null;
    stockStatus: string;
  } | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface CartResponse {
  id: string;
  items: CartItemResponse[];
  coupon: { code: string; discountType: string } | null;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}

function authHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function cartRequest(
  path: string,
  init: RequestInit,
  fallbackErrorMessage: string,
): Promise<CartResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...init.headers,
    },
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(body?.message ?? fallbackErrorMessage);
  }
  return res.json() as Promise<CartResponse>;
}

export async function getCart(): Promise<CartResponse> {
  const res = await fetch(`${API_BASE_URL}/cart`, {
    credentials: "include",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to load cart.");
  return res.json() as Promise<CartResponse>;
}

export function addToCart(
  productId: string,
  quantity: number,
): Promise<CartResponse> {
  return cartRequest(
    "/cart/items",
    { method: "POST", body: JSON.stringify({ productId, quantity }) },
    "Could not add this item to your bag.",
  );
}

export function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<CartResponse> {
  return cartRequest(
    `/cart/items/${itemId}`,
    { method: "PATCH", body: JSON.stringify({ quantity }) },
    "Could not update this item's quantity.",
  );
}

export function removeCartItem(itemId: string): Promise<CartResponse> {
  return cartRequest(
    `/cart/items/${itemId}`,
    { method: "DELETE" },
    "Could not remove this item.",
  );
}

export function applyCoupon(code: string): Promise<CartResponse> {
  return cartRequest(
    "/cart/coupon",
    { method: "POST", body: JSON.stringify({ code }) },
    "This code is invalid or has expired.",
  );
}

export function cartItemCount(cart: CartResponse): number {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
