"use client";

import { apiRequest } from "./api-client";
import type { Address } from "./types";

export interface AddressInput {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  label?: string;
}

export function getAddresses(): Promise<Address[]> {
  return apiRequest("/users/me/addresses");
}

export function createAddress(input: AddressInput): Promise<Address> {
  return apiRequest("/users/me/addresses", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateAddress(
  id: string,
  input: Partial<AddressInput>,
): Promise<Address> {
  return apiRequest(`/users/me/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteAddress(id: string): Promise<void> {
  return apiRequest(`/users/me/addresses/${id}`, { method: "DELETE" });
}

export function setDefaultAddress(id: string): Promise<Address> {
  return apiRequest(`/users/me/addresses/${id}/default`, { method: "POST" });
}
