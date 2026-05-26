import Image from "next/image";
import type { SiteImage } from "@/lib/images";

export default function Gallery({
  images,
  columns = 3,
}: {
  images: SiteImage[];
  columns?: 2 | 3 | 4;
}) {
  const colClass =
    columns === 4
      ? "sm:grid-cols-3 lg:grid-cols-4"
      : columns === 2
        ? "sm:grid-cols-2"
        : "sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-2 gap-3 ${colClass}`}>
      {images.map((img) => (
        <div
          key={img.src}
          className="relative aspect-[4/5] overflow-hidden bg-surface"
        >
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
            className="object-cover transition-transform duration-500 hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}