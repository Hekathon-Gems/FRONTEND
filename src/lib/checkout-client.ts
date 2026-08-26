"use client";

import type {
  CheckoutSessionResponse,
  OrderResponse,
  ShippingAddress,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

function authHeaders(): Record<string, string> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  const body = (await res.json().catch(() => null)) as {
    message?: string | string[];
  } | null;
  if (Array.isArray(body?.message)) return body.message[0] ?? fallback;
  return body?.message ?? fallback;
}

export async function createCheckoutSession(
  email?: string,
): Promise<CheckoutSessionResponse> {
  const res = await fetch(`${API_BASE_URL}/checkout/sessions`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(email ? { email } : {}),
  });
  if (!res.ok) {
    throw new Error(
      await parseErrorMessage(
        res,
        "Unable to start checkout. Please try again.",
      ),
    );
  }
  return res.json() as Promise<CheckoutSessionResponse>;
}

export async function updateCheckoutShipping(
  sessionId: string,
  address: ShippingAddress,
): Promise<OrderResponse> {
  const res = await fetch(
    `${API_BASE_URL}/checkout/sessions/${sessionId}/shipping`,
    {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(address),
    },
  );
  if (!res.ok) {
    throw new Error(
      await parseErrorMessage(
        res,
        "Please check your shipping details and try again.",
      ),
    );
  }
  return res.json() as Promise<OrderResponse>;
}

export async function placeCheckoutOrder(
  sessionId: string,
): Promise<OrderResponse> {
  const res = await fetch(
    `${API_BASE_URL}/checkout/sessions/${sessionId}/place`,
    {
      method: "POST",
      credentials: "include",
      headers: authHeaders(),
    },
  );
  if (!res.ok) {
    throw new Error(
      await parseErrorMessage(
        res,
        "We couldn't process your payment. Please check your card details and try again.",
      ),
    );
  }
  return res.json() as Promise<OrderResponse>;
}
