# Adding photos to the site

Three steps. You never touch code.

## 1. Put the originals in the right folder

Straight out of Lightroom/Capture One — full size, JPEG, whatever you'd normally
export. The script resizes and optimises; it never modifies your originals.

```
source-images/
  Events/     ← corporate events: conferences, awards nights, launches, functions
  Team/       ← on-site team days: the mobile studio set up in an office,
                 a headshot day in progress, behind-the-scenes
  Branding/   ← personal branding: lifestyle, at-work, environmental, detail shots
  Actor/      ← actor headshots (already has 6)
  Corporate/  ← corporate headshots (already has 49)
  Family/  Model/  Musician/  Singer/  Sports portraits/  Presenter/  Writer/
```

File names don't matter — the script renames everything to SEO filenames like
`corporate-event-photography-sydney-04.webp`.

**Two things worth doing while you choose:**

- **For Events**, include the shots that prove range: a speaker mid-talk, candid
  networking, the room, branding and sponsor signage, an award moment. Marketing
  teams are looking for whether you cover *their* run sheet, not for the best
  single photograph.
- **For Team**, the most valuable image on the whole site is probably the least
  glamorous one: your mobile studio set up in an ordinary meeting room. It is the
  thing an office manager cannot picture and the thing they are actually buying.

## 2. Run one command

```bash
npm run ingest
```

Or, to see what it would do first:

```bash
npm run ingest -- --dry
npm run ingest -- --cat=Events     # just one folder
```

It will:

- resize each photo to a 2000px long edge and write both `.webp` and `.jpg`
- name them sequentially, **continuing from the last number** — existing images
  are never renamed or renumbered
- embed your copyright and name into the JPEG metadata
- skip anything it has already processed, so it's safe to re-run
- regenerate `lib/image-dimensions.ts` (dimensions and per-silo counts)

## 3. Build and check

```bash
npm run build
npm run dev     # then look at the pages
```

Several pages update themselves as soon as images exist:

- **`/corporate-event-photographer-sydney`** currently shows a note explaining
  there's no event gallery yet. Add photos to `source-images/Events/` and the
  note is replaced by a real gallery, and the hero switches to an event photo.
- **`/team-headshots-sydney`** puts any `Team/` photos first, ahead of the
  studio portraits.
- **`/personal-branding-sydney`** and **`/actor-headshots-sydney`** currently
  borrow a few supporting frames from the corporate and model libraries. Once
  those silos have 6 and 8 of their own images respectively, the borrowed frames
  drop away automatically — and so do the honest "there aren't many photos here
  yet" paragraphs on those pages.

## Alt text

Every image needs a short description of what's in the frame. It's what Google
Images reads, and what a blind visitor hears.

Generate contact sheets to write from:

```bash
npm run ingest -- --thumbs
```

That writes 480px copies to `.image-review/<silo>/`. Descriptions go in
`lib/image-alts.ts`, keyed by path:

```ts
export const imageAlts: Record<string, string> = {
  "/images/corporate-events/corporate-event-photography-sydney-01":
    "Keynote speaker on stage at a Sydney conference",
  "/images/team-headshots/on-site-team-headshots-sydney-01":
    "Mobile studio set up in an office meeting room for a team headshot day",
};
```

Until an image has an entry it falls back to a generic per-category line, which
works but wastes most of the Google Images value.

**Write what is actually in the photograph.** Don't stuff keywords —
"Sydney corporate headshots professional business photography Sydney" reads as
spam to Google and is useless to a screen-reader user. And don't claim a
location you can't verify: the site previously had alt text describing "guests
in formal dress at a Sydney corporate function" on files that were studio
headshots, which is exactly the mistake to avoid.

## Adding a whole new category

Create the folder, then add one line to `CATEGORIES` in
`scripts/ingest-images.mjs`:

```js
Headshots2027: { silo: "corporate-headshots", slug: "corporate-headshot-sydney" },
```

`silo` is the folder under `public/images/`; `slug` is the filename stem. If the
silo is new, also add it to the `SiloKey` union and `SILOS` map in
`lib/images.ts`.

## If something looks wrong

Nothing here is destructive — originals in `source-images/` are never touched,
and the script skips anything already processed. To reprocess a photo, delete
its row from `public/images/image-manifest.csv` and its files from
`public/images/<silo>/`, then run `npm run ingest` again.
