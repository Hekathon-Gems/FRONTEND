"use client";

import { apiRequest, getAccessToken, setAccessToken } from "./api-client";
import { useAuthStore } from "@/store/auth-store";
import type { PublicUser } from "./types";

export interface AuthResponse {
  accessToken: string;
  user: PublicUser;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>(
    "/auth/login",
    { method: "POST", body: JSON.stringify({ email, password }) },
    "That email and password don't match. Please try again.",
  );
  setAccessToken(res.accessToken);
  return res;
}

export async function register(values: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await apiRequest<AuthResponse>(
    "/auth/register",
    { method: "POST", body: JSON.stringify(values) },
    "An account already exists with this email. Try signing in instead.",
  );
  setAccessToken(res.accessToken);
  return res;
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiRequest(
    "/auth/reset-password",
    { method: "POST", body: JSON.stringify({ token, newPassword }) },
    "This reset link is invalid or has expired.",
  );
}

export function getMe(): Promise<PublicUser> {
  return apiRequest("/users/me");
}

export function updateProfile(values: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  marketingEmails?: boolean;
}): Promise<PublicUser> {
  return apiRequest("/users/me", {
    method: "PATCH",
    body: JSON.stringify(values),
  });
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  return apiRequest(
    "/users/me/password",
    { method: "PATCH", body: JSON.stringify({ currentPassword, newPassword }) },
    "Your current password is incorrect.",
  );
}

export function uploadPhoto(file: File): Promise<{ profileImageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);
  return apiRequest(
    "/users/me/photo",
    { method: "POST", body: formData },
    "Could not upload this photo. Please try again.",
  );
}

export function logout(): void {
  setAccessToken(null);
  useAuthStore.getState().setUnauthenticated();
}

let initPromise: Promise<void> | null = null;

// Resolves the current auth session exactly once per page load: reads the
// stored access token (if any) and validates it against GET /users/me,
// populating the auth store either way. Safe to call from multiple
// components mounting concurrently (e.g. every guarded account page) —
// they all share the same in-flight request.
export function initAuth(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const token = getAccessToken();
      if (!token) {
        useAuthStore.getState().setUnauthenticated();
        return;
      }
      try {
        const user = await getMe();
        useAuthStore.getState().setAuthenticated(user);
      } catch {
        setAccessToken(null);
        useAuthStore.getState().setUnauthenticated();
      }
    })();
  }
  return initPromise;
}
