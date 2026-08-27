"use client";

import { apiRequest, API_BASE_URL, getAccessToken } from "./api-client";
import type {
  AdminBlogCategory,
  AdminBlogPost,
  AdminCategory,
  AdminCollection,
  AdminContactSubmission,
  AdminCoupon,
  AdminCustomerDetail,
  AdminCustomerListResponse,
  AdminGemType,
  AdminNewsletterSubscriber,
  AdminOrderDetail,
  AdminOrderListResponse,
  AdminProduct,
  AdminProductListResponse,
  AdminSettings,
  AdminShape,
  BlogPostInput,
  CouponInput,
  DashboardKpis,
  ManualOrderInput,
  ProductInput,
} from "./admin-types";
import type { PublicUser } from "./types";

// ---------------------------------------------------------------- Dashboard
export function getDashboardKpis(): Promise<DashboardKpis> {
  return apiRequest("/admin/dashboard");
}

// ---------------------------------------------------------------- Products
export function getAdminProducts(params: {
  category?: string;
  gemType?: string;
  stockStatus?: string;
  active?: string;
  q?: string;
  page?: string;
}): Promise<AdminProductListResponse> {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (value) qs.set(key, value);
  qs.set("limit", "20");
  return apiRequest(`/admin/products?${qs.toString()}`);
}

export function getAdminProduct(
  id: string,
): Promise<
  AdminProduct & { collectionIds: string[]; relatedProductIds: string[] }
> {
  return apiRequest(`/admin/products/${id}`);
}

export function createProduct(input: ProductInput): Promise<AdminProduct> {
  return apiRequest("/admin/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateProduct(
  id: string,
  input: Partial<ProductInput>,
): Promise<AdminProduct> {
  return apiRequest(`/admin/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function deleteProduct(id: string): Promise<void> {
  return apiRequest(`/admin/products/${id}`, { method: "DELETE" });
}

export function bulkActivateProducts(ids: string[]): Promise<void> {
  return apiRequest("/admin/products/bulk/activate", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export function bulkDeactivateProducts(ids: string[]): Promise<void> {
  return apiRequest("/admin/products/bulk/deactivate", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export function uploadProductImage(
  productId: string,
  file: File,
  altText: string,
): Promise<unknown> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("altText", altText);
  return apiRequest(`/admin/products/${productId}/images`, {
    method: "POST",
    body: formData,
  });
}

export function reorderProductImages(
  productId: string,
  imageIds: string[],
): Promise<void> {
  return apiRequest(`/admin/products/${productId}/images/reorder`, {
    method: "PATCH",
    body: JSON.stringify({ imageIds }),
  });
}

export function removeProductImage(
  productId: string,
  imageId: string,
): Promise<void> {
  return apiRequest(`/admin/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------- Taxonomy
export function getAdminCategories(): Promise<AdminCategory[]> {
  return apiRequest("/admin/categories");
}
export function createCategory(input: {
  name: string;
  slug?: string;
  description?: string;
  sortOrder?: number;
}) {
  return apiRequest<AdminCategory>("/admin/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateCategory(
  id: string,
  input: {
    name: string;
    slug?: string;
    description?: string;
    sortOrder?: number;
  },
) {
  return apiRequest<AdminCategory>(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export function deleteCategory(id: string): Promise<void> {
  return apiRequest(`/admin/categories/${id}`, { method: "DELETE" });
}

export function getAdminGemTypes(): Promise<AdminGemType[]> {
  return apiRequest("/admin/gem-types");
}
export function createGemType(input: {
  name: string;
  slug?: string;
  aboutText?: string;
  careText?: string;
}) {
  return apiRequest<AdminGemType>("/admin/gem-types", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateGemType(
  id: string,
  input: { name: string; slug?: string; aboutText?: string; careText?: string },
) {
  return apiRequest<AdminGemType>(`/admin/gem-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export function deleteGemType(id: string): Promise<void> {
  return apiRequest(`/admin/gem-types/${id}`, { method: "DELETE" });
}

export function getAdminShapes(): Promise<AdminShape[]> {
  return apiRequest("/admin/shapes");
}
export function createShape(input: { name: string; slug?: string }) {
  return apiRequest<AdminShape>("/admin/shapes", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateShape(
  id: string,
  input: { name: string; slug?: string },
) {
  return apiRequest<AdminShape>(`/admin/shapes/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export function deleteShape(id: string): Promise<void> {
  return apiRequest(`/admin/shapes/${id}`, { method: "DELETE" });
}

export function getAdminCollections(): Promise<AdminCollection[]> {
  return apiRequest("/admin/collections");
}
export function createCollection(input: {
  name: string;
  slug?: string;
  description?: string;
  bannerImageUrl?: string;
  isActive?: boolean;
}) {
  return apiRequest<AdminCollection>("/admin/collections", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateCollection(
  id: string,
  input: {
    name: string;
    slug?: string;
    description?: string;
    bannerImageUrl?: string;
    isActive?: boolean;
  },
) {
  return apiRequest<AdminCollection>(`/admin/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export function deleteCollection(id: string): Promise<void> {
  return apiRequest(`/admin/collections/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------- Orders
export function getAdminOrders(params: {
  status?: string;
  q?: string;
  page?: string;
}): Promise<AdminOrderListResponse> {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (value) qs.set(key, value);
  return apiRequest(`/admin/orders?${qs.toString()}`);
}

export function getAdminOrder(id: string): Promise<AdminOrderDetail> {
  return apiRequest(`/admin/orders/${id}`);
}

export function createManualOrder(
  input: ManualOrderInput,
): Promise<AdminOrderDetail> {
  return apiRequest("/admin/orders", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateOrderStatus(
  id: string,
  input: {
    status: string;
    trackingNumber?: string;
    carrier?: string;
    note?: string;
  },
): Promise<AdminOrderDetail> {
  return apiRequest(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export function refundOrder(
  id: string,
  input: { amount?: number; reason?: string },
): Promise<AdminOrderDetail> {
  return apiRequest(`/admin/orders/${id}/refund`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

// ---------------------------------------------------------------- Coupons
export function getAdminCoupons(): Promise<AdminCoupon[]> {
  return apiRequest("/admin/coupons");
}
export function createCoupon(input: CouponInput): Promise<AdminCoupon> {
  return apiRequest("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateCoupon(
  id: string,
  input: CouponInput,
): Promise<AdminCoupon> {
  return apiRequest(`/admin/coupons/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export function deleteCoupon(id: string): Promise<void> {
  return apiRequest(`/admin/coupons/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------- Customers
export function getAdminCustomers(params: { page?: string; q?: string }) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params))
    if (value) qs.set(key, value);
  return apiRequest<AdminCustomerListResponse>(
    `/admin/customers?${qs.toString()}`,
  );
}
export function getAdminCustomer(id: string): Promise<AdminCustomerDetail> {
  return apiRequest(`/admin/customers/${id}`);
}
export function setCustomerDisabled(
  id: string,
  disabled: boolean,
): Promise<{ message: string }> {
  return apiRequest(`/admin/customers/${id}/disable`, {
    method: "PATCH",
    body: JSON.stringify({ disabled }),
  });
}

// ---------------------------------------------------------------- Blog
export function getAdminBlogPosts(): Promise<AdminBlogPost[]> {
  return apiRequest("/admin/blog/posts");
}
export function getAdminBlogPost(id: string): Promise<AdminBlogPost> {
  return apiRequest(`/admin/blog/posts/${id}`);
}
export function createBlogPost(input: BlogPostInput): Promise<AdminBlogPost> {
  return apiRequest("/admin/blog/posts", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateBlogPost(
  id: string,
  input: BlogPostInput,
): Promise<AdminBlogPost> {
  return apiRequest(`/admin/blog/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export function publishBlogPost(id: string): Promise<AdminBlogPost> {
  return apiRequest(`/admin/blog/posts/${id}/publish`, { method: "POST" });
}
export function unpublishBlogPost(id: string): Promise<AdminBlogPost> {
  return apiRequest(`/admin/blog/posts/${id}/unpublish`, { method: "POST" });
}
export function archiveBlogPost(id: string): Promise<AdminBlogPost> {
  return apiRequest(`/admin/blog/posts/${id}/archive`, { method: "POST" });
}
export function deleteBlogPost(id: string): Promise<void> {
  return apiRequest(`/admin/blog/posts/${id}`, { method: "DELETE" });
}

export function getAdminBlogCategories(): Promise<AdminBlogCategory[]> {
  return apiRequest("/admin/blog/categories");
}
export function createBlogCategory(input: {
  name: string;
  slug?: string;
}): Promise<AdminBlogCategory> {
  return apiRequest("/admin/blog/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateBlogCategory(
  id: string,
  input: { name: string; slug?: string },
): Promise<AdminBlogCategory> {
  return apiRequest(`/admin/blog/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}
export function deleteBlogCategory(id: string): Promise<void> {
  return apiRequest(`/admin/blog/categories/${id}`, { method: "DELETE" });
}

// ---------------------------------------------------------------- Content
export function getAdminContentBlocks(
  page: string,
): Promise<Record<string, unknown>> {
  return apiRequest(`/admin/content/${page}`);
}
export function updateContentBlock(
  page: string,
  blockKey: string,
  content: Record<string, unknown>,
) {
  return apiRequest(`/admin/content/${page}/${blockKey}`, {
    method: "PUT",
    body: JSON.stringify(content),
  });
}

// ---------------------------------------------------------------- Contact
export function getAdminContactSubmissions(
  status?: string,
): Promise<AdminContactSubmission[]> {
  const qs = status ? `?status=${status}` : "";
  return apiRequest(`/admin/contact-submissions${qs}`);
}
export function updateContactSubmissionStatus(
  id: string,
  status: string,
): Promise<AdminContactSubmission> {
  return apiRequest(`/admin/contact-submissions/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// ---------------------------------------------------------------- Newsletter
export function getAdminNewsletterSubscribers(): Promise<
  AdminNewsletterSubscriber[]
> {
  return apiRequest("/admin/newsletter/subscribers");
}
export function getNewsletterExportUrl(): string {
  return `${API_BASE_URL}/admin/newsletter/subscribers/export`;
}
export async function downloadNewsletterCsv(): Promise<Blob> {
  const token = getAccessToken();
  const res = await fetch(getNewsletterExportUrl(), {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Could not export subscribers.");
  return res.blob();
}

// ---------------------------------------------------------------- Settings
export function getAdminSettings(): Promise<AdminSettings> {
  return apiRequest("/admin/settings");
}
export function updateSettingsBlock(
  blockKey: string,
  content: Record<string, unknown>,
) {
  return apiRequest(`/admin/settings/${blockKey}`, {
    method: "PUT",
    body: JSON.stringify(content),
  });
}
export function listStaffUsers(): Promise<PublicUser[]> {
  return apiRequest("/admin/settings/users");
}
export function createStaffUser(input: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "staff" | "admin";
}): Promise<PublicUser> {
  return apiRequest("/admin/settings/users", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export function updateStaffRole(
  id: string,
  role: "staff" | "admin",
): Promise<PublicUser> {
  return apiRequest(`/admin/settings/users/${id}/role`, {
    method: "PATCH",
    body: JSON.stringify({ role }),
  });
}
