import Image from "next/image";
import type { SiteImage } from "@/lib/images";

/**
 * Masonry gallery. Each photo is shown whole at its true aspect ratio — never
 * cropped — using CSS multi-column layout. Heights vary naturally; there are no
 * letterbox bars. Intrinsic width/height are passed so next/image reserves the
 * correct space (no layout shift) and serves a sharp, appropriately sized AVIF/
 * WebP.
 */
export default function Gallery({
  images,
  columns = 3,
}: {
  images: SiteImage[];
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 4
      ? "sm:columns-3 lg:columns-4"
      : columns === 2
        ? "sm:columns-2"
        : "sm:columns-2 lg:columns-3";

  return (
    <div className={`columns-1 ${colClass} gap-3 [&>*]:mb-3`}>
      {images.map((img) => (
        <div
          key={img.src}
          className="overflow-hidden border border-border bg-surface break-inside-avoid"
        >
          <Image
            src={img.src}
            alt={img.alt}
            width={img.width}
            height={img.height}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            quality={82}
            className="h-auto w-full transition-transform duration-500 hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
