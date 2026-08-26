export interface RefSlug {
  id?: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  url: string;
  mediaType: "image" | "video" | "document";
  altText: string | null;
  sortOrder: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  productType: string;
  price: number; // cents
  currency: string;
  category: RefSlug | null;
  gemType: RefSlug | null;
  shape: RefSlug | null;
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
  images: ProductImage[];
  createdAt: string;
}

export interface Facet {
  slug: string;
  name: string | null;
  count: number;
}

export interface ProductListResponse {
  data: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  facets: { category: Facet[]; gemType: Facet[]; shape: Facet[] };
}

export interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: { name: string; slug: string } | null;
  excerpt: string | null;
  bodyHtml: string | null;
  featuredImageUrl: string | null;
  readTimeMinutes: number | null;
  author: { firstName: string; lastName: string } | null;
  publishedAt: string | null;
}

export interface BlogListResponse {
  data: BlogPost[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

export interface OrderItem {
  id: string;
  productId: string | null;
  productName: string;
  productImageUrl: string | null;
  sku: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface OrderStatusHistoryEntry {
  status: string;
  note: string | null;
  createdAt: string;
}

export interface OrderResponse {
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
  statusHistory: OrderStatusHistoryEntry[];
  placedAt: string | null;
  processingAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
}

export interface CheckoutSessionResponse {
  id: string;
  clientSecret: string;
  order: OrderResponse;
}

export interface CatalogQuery {
  category?: string;
  gemType?: string;
  shape?: string;
  minPrice?: string;
  maxPrice?: string;
  collection?: string;
  q?: string;
  sort?: string;
  page?: string;
  limit?: string;
}
