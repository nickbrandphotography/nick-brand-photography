/**
 * Booking domain logic for Nick Brand Photography.
 *
 * This module is the SEAM between the booking UI and the future backend.
 * Right now it returns deterministic MOCK availability so the booking flow
 * runs locally with no server, database or API keys.
 *
 * When the real backend is built (see /supabase/schema.sql and
 * BOOKING-SETUP.md), ONLY the functions in this file change — they will call
 * the Supabase API instead of generating mock data. The BookingFlow UI
 * component never needs to be touched.
 */

export type BookingMode = "instant" | "enquiry";

export type SessionType = {
  id: string;
  name: string;
  category: string;
  /** Session length in minutes. 0 for enquiry-only services. */
  durationMin: number;
  /** Price in AUD. 0 for enquiry-only services. */
  price: number;
  /** Deposit as a fraction of price, e.g. 0.2 = 20%. */
  depositPct: number;
  mode: BookingMode;
  blurb: string;
  includes: string[];
  popular?: boolean;
  /** Can this session run at the client's own location (adds a travel fee)? */
  allowsOnLocation?: boolean;
};

/**
 * The bookable session types. Mirrors the pricing in lib/pricing.ts.
 * In the real backend these come from the `session_types` database table.
 */
export const sessionTypes: SessionType[] = [
  {
    id: "headshot-essential",
    name: "Corporate Headshot — Essential",
    category: "Headshots",
    durationMin: 45,
    price: 395,
    depositPct: 0.2,
    mode: "instant",
    allowsOnLocation: true,
    blurb:
      "A focused 45-minute session for one clean, confident professional headshot.",
    includes: [
      "Studio or outdoor location",
      "1–2 outfit changes",
      "5 fully edited images",
      "Private online gallery",
    ],
  },
  {
    id: "headshot-professional",
    name: "Corporate Headshot — Professional",
    category: "Headshots",
    durationMin: 90,
    price: 695,
    depositPct: 0.2,
    mode: "instant",
    popular: true,
    allowsOnLocation: true,
    blurb:
      "A 90-minute studio and outdoor session with a LinkedIn-optimised crop.",
    includes: [
      "Studio + outdoor combo",
      "3–4 outfit changes",
      "15 fully edited images",
      "Priority 3-day turnaround",
    ],
  },
  {
    id: "portfolio",
    name: "Actor & Model Portfolio",
    category: "Portfolio",
    durationMin: 120,
    price: 750,
    depositPct: 0.2,
    mode: "instant",
    blurb:
      "A two-hour portfolio build with multiple looks and casting guidance.",
    includes: [
      "Dramatic + natural light setups",
      "3–4 look changes",
      "25 fully edited images",
      "Casting director guidance",
    ],
  },
  {
    id: "family",
    name: "Family Session",
    category: "Portrait",
    durationMin: 90,
    price: 550,
    depositPct: 0.2,
    mode: "instant",
    blurb:
      "A relaxed 90-minute outdoor session at a Sydney beach or park for up to six people.",
    includes: [
      "Outdoor Sydney location",
      "20 fully edited images",
      "Print release included",
      "Pets welcome",
    ],
  },
  {
    id: "team-quote",
    name: "Team Headshots & Corporate Projects",
    category: "Teams & Events",
    durationMin: 0,
    price: 0,
    depositPct: 0,
    mode: "enquiry",
    blurb:
      "On-site team headshot days, event coverage and larger projects — request a tailored quote.",
    includes: [
      "On-site mobile studio",
      "Per-person team rates",
      "Invoice billing available",
    ],
  },
];

export function getSessionType(id: string): SessionType | undefined {
  return sessionTypes.find((s) => s.id === id);
}

/* ------------------------------------------------------------------------ */
/*  On-location travel pricing (Tier 1 — a flat fee per Sydney zone)        */
/*                                                                          */
/*  Studio shoots have no travel fee. When a client books Nick to come to   */
/*  their workplace, a flat fee is added based on the postcode of the       */
/*  location. The fee deliberately BUNDLES travel time, distance, tolls     */
/*  and a parking allowance into one predictable number.                    */
/*                                                                          */
/*  ADJUST FREELY: change the `fee` amounts, rename zones, or move postcode  */
/*  ranges between zones. Postcode boundaries are approximate Sydney         */
/*  groupings from the Lane Cove studio (postcode 2066) — tune to taste.    */
/* ------------------------------------------------------------------------ */

export type TravelZone = {
  id: string;
  label: string;
  /** Flat travel fee in AUD, added to the session price. */
  fee: number;
  /** Inclusive postcode ranges [min, max] that fall in this zone. */
  postcodeRanges: [number, number][];
  /** Example suburbs — shown to reassure the client the zone looks right. */
  examples: string;
};

/** The studio's postcode. A studio booking never incurs a travel fee. */
export const STUDIO_POSTCODE = 2066;

export const travelZones: TravelZone[] = [
  {
    id: "zone-a",
    label: "North Shore & City",
    fee: 55,
    postcodeRanges: [
      [2000, 2011],
      [2060, 2074],
      [2110, 2114],
    ],
    examples: "Lane Cove, North Sydney, Chatswood, Sydney CBD, Ryde",
  },
  {
    id: "zone-b",
    label: "Inner, Eastern & Northern Beaches",
    fee: 120,
    postcodeRanges: [
      [2015, 2052],
      [2075, 2109],
      [2115, 2141],
    ],
    examples: "Surry Hills, Bondi, Newtown, Manly, Hornsby",
  },
  {
    id: "zone-c",
    label: "Greater Sydney",
    fee: 200,
    postcodeRanges: [[2142, 2234]],
    examples: "Parramatta, Liverpool, Bankstown, Sutherland, Cronulla",
  },
  {
    id: "zone-d",
    label: "Outer Sydney",
    fee: 300,
    postcodeRanges: [
      [2250, 2340],
      [2555, 2580],
      [2740, 2790],
    ],
    examples: "Central Coast, Penrith, Campbelltown, Camden",
  },
];

/**
 * Find the travel zone for a 4-digit postcode, or null if it falls outside
 * the standard travel area (those clients are routed to a custom quote).
 */
export function findTravelZone(postcode: number): TravelZone | null {
  for (const zone of travelZones) {
    for (const [min, max] of zone.postcodeRanges) {
      if (postcode >= min && postcode <= max) return zone;
    }
  }
  return null;
}

/* ------------------------------------------------------------------------ */
/*  Mock availability engine                                                */
/*  Deterministic so the calendar is stable across re-renders.              */
/* ------------------------------------------------------------------------ */

/** Opening hours per weekday (0 = Sunday). null = closed. [openHour, closeHour] */
export const OPENING_HOURS: Record<number, [number, number] | null> = {
  0: null, // Sunday — closed
  1: [8, 17],
  2: [8, 17],
  3: [8, 17],
  4: [8, 17],
  5: [8, 17],
  6: [9, 14], // Saturday — shorter
};

/** Earliest a client can book (lead time) and how far ahead (horizon). */
export const MIN_NOTICE_DAYS = 2;
export const HORIZON_DAYS = 75;

/** Small deterministic string hash (FNV-1a). */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** YYYY-MM-DD key for a date, in local time. */
export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

/** Midnight today, local time. */
export function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export type Slot = {
  /** Display label, e.g. "9:30 am" */
  label: string;
  hour: number;
  minute: number;
  available: boolean;
};

function formatTime(h: number, m: number): string {
  const period = h >= 12 ? "pm" : "am";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, "0")} ${period}`;
}

/** All candidate slots for a given day and session length. */
export function getDaySlots(date: Date, durationMin: number): Slot[] {
  const hours = OPENING_HOURS[date.getDay()];
  if (!hours || durationMin <= 0) return [];
  const [open, close] = hours;
  const step = durationMin >= 90 ? 60 : 30;
  const slots: Slot[] = [];
  for (let m = open * 60; m + durationMin <= close * 60; m += step) {
    const hh = Math.floor(m / 60);
    const mm = m % 60;
    // ~60% of slots are open; deterministic per date + time.
    const available = hash(`${dateKey(date)}#${m}`) % 10 > 3;
    slots.push({ label: formatTime(hh, mm), hour: hh, minute: mm, available });
  }
  return slots;
}

/** Is this date within the booking window and does it have any open slot? */
export function isBookable(date: Date, durationMin: number): boolean {
  const today = startOfToday();
  const earliest = new Date(today);
  earliest.setDate(earliest.getDate() + MIN_NOTICE_DAYS);
  const latest = new Date(today);
  latest.setDate(latest.getDate() + HORIZON_DAYS);
  if (date < earliest || date > latest) return false;
  return getDaySlots(date, durationMin).some((s) => s.available);
}

/** Friendly long date, e.g. "Thursday, 28 May 2026". */
export function formatLongDate(d: Date): string {
  return d.toLocaleDateString("en-AU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** A short human booking reference, e.g. "NBP-7K3Q". */
export function makeReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `NBP-${code}`;
}
