import type { MetadataRoute } from "next";
import { getProducts, getBlogPosts } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/gems", changeFrequency: "daily", priority: 0.9 },
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
  { path: "/blog", changeFrequency: "daily", priority: 0.7 },
];

async function allProductSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  for (;;) {
    const { data, meta } = await getProducts({
      limit: "100",
      page: String(page),
    }).catch(() => ({ data: [], meta: { totalPages: 0 } }) as never);
    slugs.push(...data.map((p) => p.slug));
    if (page >= meta.totalPages) break;
    page += 1;
  }
  return slugs;
}

async function allBlogSlugs(): Promise<string[]> {
  const slugs: string[] = [];
  let page = 1;
  for (;;) {
    const { data, meta } = await getBlogPosts({
      limit: "100",
      page: String(page),
    }).catch(() => ({ data: [], meta: { totalPages: 0 } }) as never);
    slugs.push(...data.map((p) => p.slug));
    if (page >= meta.totalPages) break;
    page += 1;
  }
  return slugs;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, blogSlugs] = await Promise.all([
    allProductSlugs(),
    allBlogSlugs(),
  ]);
  const now = new Date();

  return [
    ...STATIC_ROUTES.map((route) => ({
      url: `${SITE_URL}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
    ...productSlugs.map((slug) => ({
      url: `${SITE_URL}/gems/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${SITE_URL}/blog/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
