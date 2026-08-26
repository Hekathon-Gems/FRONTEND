"use client";

import { apiRequest } from "./api-client";
import type { WishlistItemResponse } from "./types";

export function getWishlist(): Promise<WishlistItemResponse[]> {
  return apiRequest("/wishlist");
}

export function addToWishlist(
  productId: string,
): Promise<WishlistItemResponse> {
  return apiRequest("/wishlist", {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function removeFromWishlist(productId: string): Promise<void> {
  return apiRequest(`/wishlist/${productId}`, { method: "DELETE" });
}

export function moveWishlistToCart(): Promise<{
  movedCount: number;
  skippedCount: number;
}> {
  return apiRequest("/wishlist/move-to-cart", { method: "POST" });
}
