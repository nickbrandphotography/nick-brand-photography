# Image re-crop pipeline

`scripts/recrop-images.mjs` generates ratio-specific, face-aware crops of the
site's photos so images stop being decapitated by `object-cover`. It fixes the
core problem found in the June 2026 image audit: one source file was being
shown in 4:5, 3:2 and 16:9 containers, and the browser's centre-crop cut heads
off (e.g. the headless suit on the homepage, the headless speakers on blog
heroes).

## How it works

For each silo it renders the ratio variants that silo actually needs:

| Silo | Variants | Why |
|------|----------|-----|
| corporate-headshots | 4x5, 3x2, 16x9 | galleries/heroes, home cards, blog heroes |
| personal-branding | 4x5, 3x2, 16x9 | same |
| actor-headshots | 4x5, 3x2 | galleries/hero, home card |
| family | 4x5, 3x2 | galleries/hero, home card |
| about | 4x5 | about hero |

Cropping uses Sharp's `attention` strategy, which biases the crop toward faces
and high-detail regions — this is what keeps heads in frame. Output is written
**next to the originals** as `<base>-<ratio>.webp` and `<base>-<ratio>.jpg`.
Originals are never modified, and images are never upscaled past their source.

## Run it

```bash
npm install            # first time only — installs sharp
npm run recrop         # generate every variant (webp + jpg)
npm run recrop -- --dry            # preview, write nothing
npm run recrop -- --silo=family    # one silo
npm run recrop -- --force          # regenerate / overwrite existing
```

## When attention guesses wrong

For a few full-length shots, attention locks onto a high-contrast element
(a belt, a hand) instead of the face. Pin those with a manual override in the
`OVERRIDES` map at the top of the script — key is `"<silo>/<basename>"`, value
maps a ratio to a Sharp gravity (`north` = top, `centre`, `south`, etc.):

```js
const OVERRIDES = {
  "personal-branding/personal-branding-photography-sydney-01": {
    "16x9": "north",
    "3x2": "north",
  },
};
```

(The two personal-branding speakers are already pinned this way.)

## Images no crop can fix

Some images are the wrong orientation for their slot and should be **replaced**,
not cropped — the script renders a best effort but prints a warning. Currently:

- `corporate-headshot-sydney-27` — a 6-person group panorama (loses people in tall slots)
- `family-portrait-sydney-02` — a wide ocean-pool shot

## Next step — wire the variants into the site

The script produces the files; the components still request the un-suffixed
originals. To use the variants, update `lib/images.ts` to accept a ratio and
return the matching variant path, then have each slot pass its container ratio:

- 4:5 → heroes, galleries, About hero, `Gallery` cells
- 3:2 → homepage service cards, homepage About teaser
- 16:9 → blog post heroes

Example shape:

```ts
export function getImage(silo, index, alt?, ratio?: "4x5" | "3x2" | "16x9") {
  const suffix = ratio ? `-${ratio}` : "";
  const base = `/images/${silo}/${meta.slug}-${num}${suffix}`;
  return { src: `${base}.webp`, jpg: `${base}.jpg`, alt: /* … */ };
}
```

Then e.g. the homepage service card calls `getImage(s.heroSilo, s.heroIndex, s.navLabel, "3x2")`
and the blog hero passes `"16x9"`. Once wired, every slot serves a correctly
framed image and `object-cover` has nothing left to crop.
