import type {
  BlogListResponse,
  BlogPost,
  CatalogQuery,
  CategoryWithCount,
  Product,
  ProductListResponse,
  RefSlug,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

// ISR per Technical Spec §7: catalog/PDP/blog pages revalidate every 60s.
const REVALIDATE_SECONDS = 60;

async function apiFetch<T>(
  path: string,
  revalidate: number | false = REVALIDATE_SECONDS,
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    next: revalidate === false ? undefined : { revalidate },
    cache: revalidate === false ? "no-store" : undefined,
  });
  if (!res.ok) {
    if (res.status === 404) {
      throw new NotFoundApiError(path);
    }
    throw new Error(`API request failed: ${res.status} ${path}`);
  }
  return res.json() as Promise<T>;
}

export class NotFoundApiError extends Error {
  constructor(path: string) {
    super(`Not found: ${path}`);
    this.name = "NotFoundApiError";
  }
}

function toQueryString(query: object): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === "string" && value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export function getProducts(
  query: CatalogQuery = {},
): Promise<ProductListResponse> {
  return apiFetch(`/products${toQueryString(query)}`);
}

export function getProduct(slug: string): Promise<Product> {
  return apiFetch(`/products/${encodeURIComponent(slug)}`);
}

export function getRelatedProducts(slug: string): Promise<Product[]> {
  return apiFetch(`/products/${encodeURIComponent(slug)}/related`);
}

export function getCategories(): Promise<CategoryWithCount[]> {
  return apiFetch("/categories");
}

export function getGemTypes(): Promise<CategoryWithCount[]> {
  return apiFetch("/gem-types");
}

export function getShapes(): Promise<RefSlug[]> {
  return apiFetch("/shapes");
}

export function getBlogPosts(
  query: { category?: string; q?: string; page?: string; limit?: string } = {},
): Promise<BlogListResponse> {
  return apiFetch(`/blog/posts${toQueryString(query)}`);
}

export function getBlogPost(slug: string): Promise<BlogPost> {
  return apiFetch(`/blog/posts/${encodeURIComponent(slug)}`);
}
