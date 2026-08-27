"use client";

import { useState } from "react";
import Image from "next/image";
import { Gem, FileText, Play } from "lucide-react";
import clsx from "clsx";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex];

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-bg-dark">
        {active?.mediaType === "image" && (
          <Image
            src={active.url}
            alt={active.altText ?? productName}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        )}
        {active?.mediaType === "video" && (
          <video
            src={active.url}
            controls
            className="h-full w-full object-cover"
          />
        )}
        {active?.mediaType === "document" && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-text-muted-light">
            <FileText className="h-12 w-12" strokeWidth={1} />
            <a
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent-gold-text underline"
            >
              View Certificate
            </a>
          </div>
        )}
        {!active && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-text-muted-light">
            <Gem className="h-16 w-16" strokeWidth={1} />
            <span className="text-xs uppercase tracking-[0.1em]">
              Image Coming Soon
            </span>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, index) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={clsx(
                "relative aspect-square overflow-hidden rounded-md bg-bg-dark ring-offset-2 transition-shadow",
                index === activeIndex
                  ? "ring-2 ring-accent-gold"
                  : "ring-1 ring-border",
              )}
            >
              {img.mediaType === "image" && (
                <Image
                  src={img.url}
                  alt={img.altText ?? productName}
                  fill
                  sizes="10vw"
                  className="object-cover"
                />
              )}
              {img.mediaType === "video" && (
                <div className="flex h-full items-center justify-center text-text-muted-light">
                  <Play className="h-5 w-5" strokeWidth={1.5} />
                </div>
              )}
              {img.mediaType === "document" && (
                <div className="flex h-full items-center justify-center text-text-muted-light">
                  <FileText className="h-5 w-5" strokeWidth={1.5} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
