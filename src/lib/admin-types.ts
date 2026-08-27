import type { OrderItem, OrderStatus, ShippingAddress } from "./types";

export interface PagedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ---------------------------------------------------------------- Products
export interface AdminProduct {
  id: string;
  sku: string;
  name: string;
  slug: string;
  productType: string;
  price: number;
  currency: string;
  category: { id: string; name: string; slug: string } | null;
  gemType: { id: string; name: string; slug: string } | null;
  shape: { id: string; name: string; slug: string } | null;
  shortDescription: string | null;
  longDescription: string | null;
  caratWeight: number | null;
  dimensionsMm: string | null;
  color: string | null;
  clarity: string | null;
  originCountry: string | null;
  treatment: string | null;
  certificationBody: string | null;
  certificationInfoUrl: string | null;
  isUnique: boolean;
  stockQuantity: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock" | "sold";
  isFeatured: boolean;
  isActive: boolean;
  images: {
    id: string;
    url: string;
    mediaType: string;
    altText: string | null;
    sortOrder: number;
  }[];
  createdAt: string;
  collectionIds: string[];
  relatedProductIds: string[];
}

export interface AdminProductListResponse {
  data: AdminProduct[];
  meta: PagedMeta;
}

export interface ProductInput {
  name: string;
  slug?: string;
  sku: string;
  productType?: string;
  categoryId: string;
  gemTypeId: string;
  shapeId?: string;
  shortDescription?: string;
  longDescription?: string;
  price: number;
  caratWeight?: number;
  dimensionsMm?: string;
  color?: string;
  clarity?: string;
  originCountry?: string;
  treatment?: string;
  certificationBody?: string;
  certificationInfoUrl?: string;
  isUnique?: boolean;
  stockQuantity?: number;
  stockStatus?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  collectionIds?: string[];
  relatedProductIds?: string[];
}

// ---------------------------------------------------------------- Taxonomy
export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
}

export interface AdminGemType {
  id: string;
  name: string;
  slug: string;
  aboutText: string | null;
  careText: string | null;
  createdAt: string;
}

export interface AdminShape {
  id: string;
  name: string;
  slug: string;
}

export interface AdminCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  bannerImageUrl: string | null;
  isActive: boolean;
  createdAt: string;
}

// ---------------------------------------------------------------- Orders
export interface AdminOrderSummary {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  customerName: string | null;
  customerEmail: string | null;
  itemCount: number;
  total: number;
  currency: string;
  createdAt: string;
}

export interface AdminOrderListResponse {
  data: AdminOrderSummary[];
  meta: PagedMeta;
}

export interface ManualOrderInput {
  userId?: string;
  guestEmail?: string;
  items: { productId: string; quantity: number }[];
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  note?: string;
  sendConfirmationEmail?: boolean;
}

export interface AdminOrderDetail {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  email: string | null;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: ShippingAddress | null;
  trackingNumber: string | null;
  carrier: string | null;
  statusHistory: { status: string; note: string | null; createdAt: string }[];
  placedAt: string | null;
  processingAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  customer: {
    id: string | null;
    name: string | null;
    email: string | null;
    phone: string | null;
  };
}

// ---------------------------------------------------------------- Coupons
export interface AdminCoupon {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: string;
  minSpendCents: string;
  usageLimit?: number;
  timesUsed: number;
  startsAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CouponInput {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minSpend?: number;
  usageLimit?: number;
  startsAt?: string;
  expiresAt?: string;
  isActive?: boolean;
}

// ---------------------------------------------------------------- Customers
export interface AdminCustomerSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  joinedAt: string;
  totalOrders: number;
  lifetimeSpendCents: number;
  marketingEmails: boolean;
  disabledAt: string | null;
}

export interface AdminCustomerListResponse {
  data: AdminCustomerSummary[];
  meta: PagedMeta;
}

export interface AdminCustomerDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  joinedAt: string;
  marketingEmails: boolean;
  disabledAt: string | null;
  addresses: {
    id: string;
    fullName: string;
    addressLine1: string;
    city: string;
    country: string;
    isDefault: boolean;
  }[];
  orders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
  }[];
  wishlist: {
    id: string;
    product: { name: string; slug: string; price: number };
  }[];
}

// ---------------------------------------------------------------- Blog
export interface AdminBlogPost {
  id: string;
  title: string;
  slug: string;
  blogCategoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  excerpt: string | null;
  bodyHtml: string | null;
  featuredImageUrl: string | null;
  readTimeMinutes: number | null;
  author: { id: string; firstName: string; lastName: string } | null;
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPostInput {
  title: string;
  slug?: string;
  blogCategoryId: string;
  excerpt?: string;
  body: string;
  featuredImageUrl?: string;
  readTimeMinutes?: number;
}

export interface AdminBlogCategory {
  id: string;
  name: string;
  slug: string;
}

// ---------------------------------------------------------------- Contact
export interface AdminContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "in_progress" | "resolved";
  createdAt: string;
}

// ---------------------------------------------------------------- Newsletter
export interface AdminNewsletterSubscriber {
  id: string;
  email: string;
  confirmedAt: string | null;
  unsubscribedAt: string | null;
  source: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------- Settings
export interface GeneralSettings {
  storeName?: string;
  supportEmail?: string;
  supportPhone?: string;
  businessHours?: string;
  showroomAddress?: string;
}

export interface ShippingSettings {
  freeShippingThresholdCents?: number;
  flatShippingCents?: number;
}

export interface TaxSettings {
  flatTaxRate?: number;
}

export interface AdminSettings {
  general?: GeneralSettings;
  shipping?: ShippingSettings;
  tax?: TaxSettings;
  payment: { configured: boolean; mode: "test" | "live" | null };
}

// ---------------------------------------------------------------- Dashboard
export interface DashboardKpis {
  todayOrderCount: number;
  todayRevenueCents: number;
  pendingOrdersCount: number;
  lowStockCount: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    currency: string;
    itemCount: number;
    createdAt: string;
  }[];
}
