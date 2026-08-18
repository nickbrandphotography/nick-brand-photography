import Image from "next/image";
import type { SiteImage } from "@/lib/images";
import { imageGallerySchema } from "@/lib/schema";
import JsonLd from "./JsonLd";

/**
 * Masonry gallery. Each photo is shown whole at its true aspect ratio — never
 * cropped — using CSS multi-column layout. Heights vary naturally; there are no
 * letterbox bars. Intrinsic width/height are passed so next/image reserves the
 * correct space (no layout shift) and serves a sharp, appropriately sized AVIF/
 * WebP.
 *
 * When `schemaName` is passed, an ImageGallery block of ImageObjects is emitted
 * alongside. Previously only hero images carried ImageObject markup, so the
 * Licensable-badge eligibility that lib/schema.ts carefully engineered applied
 * to roughly 30 of the 132 photographs on the site.
 */
export default function Gallery({
  images,
  columns = 3,
  schemaName,
}: {
  images: SiteImage[];
  columns?: 2 | 3 | 4;
  /** Emit ImageGallery/ImageObject structured data under this name. */
  schemaName?: string;
}) {
  if (!images.length) return null;

  const colClass =
    columns === 4
      ? "sm:columns-3 lg:columns-4"
      : columns === 2
        ? "sm:columns-2"
        : "sm:columns-2 lg:columns-3";

  return (
    <>
      {schemaName ? (
        // Capped at 8 so the JSON-LD payload stays sensible on long pages —
        // each entry carries a self-contained creator/licence block.
        <JsonLd data={imageGallerySchema(images.slice(0, 8), schemaName)} />
      ) : null}
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
    </>
  );
}
