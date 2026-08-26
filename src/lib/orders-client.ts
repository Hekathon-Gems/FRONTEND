"use client";

import { apiRequest } from "./api-client";
import type { OrderListResponse, OrderResponse } from "./types";

export function getMyOrders(
  page = 1,
  status?: string,
): Promise<OrderListResponse> {
  const params = new URLSearchParams({ page: String(page) });
  if (status) params.set("status", status);
  return apiRequest(`/orders?${params.toString()}`);
}

export function getOrderByNumber(orderNumber: string): Promise<OrderResponse> {
  return apiRequest(`/orders/${encodeURIComponent(orderNumber)}`);
}
