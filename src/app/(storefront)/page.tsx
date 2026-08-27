import { Hero } from "@/components/home/Hero";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { PopularGemstones } from "@/components/home/PopularGemstones";
import { BirthstoneCollection } from "@/components/home/BirthstoneCollection";
import { CustomGemsCta } from "@/components/home/CustomGemsCta";
import { PromoBanners } from "@/components/home/PromoBanners";
import { BlogPreview } from "@/components/home/BlogPreview";
import { HeritageBanner } from "@/components/home/HeritageBanner";
import { InstagramStrip } from "@/components/home/InstagramStrip";
import { TrustBar } from "@/components/layout/TrustBar";
import { FadeIn } from "@/components/motion/FadeIn";
import { getCategories, getProducts, getBlogPosts } from "@/lib/api";

export default async function HomePage() {
  const [categories, popularProducts, blogPosts] = await Promise.all([
    getCategories().catch(() => []),
    getProducts({ sort: "featured", limit: "5" }).catch(() => null),
    getBlogPosts({ limit: "3" }).catch(() => null),
  ]);

  return (
    <>
      <Hero />
      <FadeIn>
        <ShopByCategory categories={categories} />
      </FadeIn>
      <FadeIn>
        <PopularGemstones products={popularProducts?.data ?? []} />
      </FadeIn>
      <FadeIn>
        <BirthstoneCollection />
      </FadeIn>
      <FadeIn>
        <CustomGemsCta />
      </FadeIn>
      <FadeIn>
        <PromoBanners />
      </FadeIn>
      <FadeIn>
        <BlogPreview posts={blogPosts?.data ?? []} />
      </FadeIn>
      <FadeIn>
        <HeritageBanner />
      </FadeIn>
      <FadeIn>
        <InstagramStrip />
      </FadeIn>
      <FadeIn>
        <TrustBar />
      </FadeIn>
    </>
  );
}
