-- ===========================================================================
--  Nick Brand Photography — Booking Platform database schema
--  PostgreSQL / Supabase
--
--  Run this once in the Supabase SQL editor to create the database.
--  See BOOKING-SETUP.md for the full setup walkthrough.
--
--  The single most important line in this file is the `no_double_booking`
--  exclusion constraint on the `bookings` table — it makes overlapping
--  bookings physically impossible to store.
-- ===========================================================================

create extension if not exists "btree_gist";
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- ORGANIZATIONS  (multi-tenant root; one row for now)
-- ---------------------------------------------------------------
create table if not exists organizations (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  slug          text not null unique,
  timezone      text not null default 'Australia/Sydney',
  brand         jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- STAFF  (photographers / assistants; Nick is staff #1)
-- ---------------------------------------------------------------
create table if not exists staff (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  auth_user_id    uuid,
  display_name    text not null,
  email           text not null,
  role            text not null default 'owner'
                   check (role in ('owner','photographer','assistant')),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- CALENDAR_ACCOUNTS  (the Google Calendar connection)
-- ---------------------------------------------------------------
create table if not exists calendar_accounts (
  id                   uuid primary key default gen_random_uuid(),
  organization_id      uuid not null references organizations(id),
  staff_id             uuid not null references staff(id),
  provider             text not null default 'google',
  google_email         text,
  access_token         text,
  refresh_token        text,
  token_expires_at     timestamptz,
  booking_calendar_id  text,
  sync_token           text,
  watch_channel_id     text,
  watch_resource_id    text,
  watch_expires_at     timestamptz,
  created_at           timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- SESSION_TYPES  (drives booking mode + payment behaviour)
-- ---------------------------------------------------------------
create table if not exists session_types (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),
  name                text not null,
  slug                text not null,
  description         text,
  duration_minutes    int  not null,
  buffer_before_min   int  not null default 0,
  buffer_after_min    int  not null default 0,
  booking_mode        text not null default 'instant'
                       check (booking_mode in ('instant','enquiry','consult','campaign')),
  payment_rule        text not null default 'none'
                       check (payment_rule in ('none','deposit','full')),
  price_cents         int  not null default 0,
  deposit_cents       int  not null default 0,
  currency            text not null default 'AUD',
  min_notice_hours    int  not null default 12,
  max_horizon_days    int  not null default 90,
  location            text,
  cover_image_url     text,
  is_active           boolean not null default true,
  sort_order          int not null default 0,
  created_at          timestamptz not null default now(),
  unique (organization_id, slug)
);

-- ---------------------------------------------------------------
-- TRAVEL_ZONES  (flat on-location travel fee per Sydney postcode area)
-- ---------------------------------------------------------------
create table if not exists travel_zones (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  label           text not null,
  fee_cents       int not null,
  -- postcode_ranges: JSON array of [min,max] pairs, e.g. [[2000,2011],[2060,2074]]
  postcode_ranges jsonb not null default '[]',
  examples        text,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now(),
  unique (organization_id, label)
);

-- ---------------------------------------------------------------
-- AVAILABILITY_RULES  (recurring weekly working hours)
-- ---------------------------------------------------------------
create table if not exists availability_rules (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  staff_id        uuid not null references staff(id),
  weekday         int  not null check (weekday between 0 and 6),
  start_time      time not null,
  end_time        time not null,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- AVAILABILITY_EXCEPTIONS  (one-off blocks; also Google busy blocks)
-- ---------------------------------------------------------------
create table if not exists availability_exceptions (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  staff_id        uuid not null references staff(id),
  during          tstzrange not null,
  kind            text not null default 'block'
                   check (kind in ('block','open')),
  source          text not null default 'manual'
                   check (source in ('manual','google')),
  google_event_id text,
  note            text,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- CUSTOMERS  (the client record)
-- ---------------------------------------------------------------
create table if not exists customers (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),
  full_name         text not null,
  email             text not null,
  phone             text,
  company           text,
  notes             text,
  marketing_opt_in  boolean not null default false,
  total_bookings    int not null default 0,
  total_spent_cents int not null default 0,
  created_at        timestamptz not null default now(),
  unique (organization_id, email)
);

-- ---------------------------------------------------------------
-- CAMPAIGNS  (mini-session events)
-- ---------------------------------------------------------------
create table if not exists campaigns (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  session_type_id uuid not null references session_types(id),
  name            text not null,
  sales_opens_at  timestamptz,
  sales_closes_at timestamptz,
  event_date      date not null,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- BOOKINGS  (the core table — note the exclusion constraint)
-- ---------------------------------------------------------------
create table if not exists bookings (
  id                uuid primary key default gen_random_uuid(),
  organization_id   uuid not null references organizations(id),
  staff_id          uuid not null references staff(id),
  session_type_id   uuid not null references session_types(id),
  customer_id       uuid references customers(id),
  campaign_id       uuid references campaigns(id),
  during            tstzrange not null,
  status            text not null default 'pending'
                     check (status in ('pending','confirmed','completed',
                                        'cancelled','no_show')),
  hold_expires_at   timestamptz,
  google_event_id   text,
  price_cents       int not null default 0,
  -- On-location travel: 'studio' = no fee; 'onlocation' adds travel_fee_cents.
  location_type     text not null default 'studio'
                     check (location_type in ('studio','onlocation')),
  location_postcode text,
  travel_fee_cents  int not null default 0,
  amount_paid_cents int not null default 0,
  manage_token      text not null default encode(gen_random_bytes(16),'hex'),
  client_note       text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),

  -- THE CORE GUARANTEE: no two non-cancelled bookings for the same
  -- staff member may overlap in time.
  constraint no_double_booking
    exclude using gist (
      staff_id with =,
      during   with &&
    )
    where (status in ('pending','confirmed','completed'))
);

-- ---------------------------------------------------------------
-- BOOKING_ADDONS  (upsells)
-- ---------------------------------------------------------------
create table if not exists booking_addons (
  id          uuid primary key default gen_random_uuid(),
  booking_id  uuid not null references bookings(id),
  name        text not null,
  price_cents int not null default 0,
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- PAYMENTS  (Stripe transactions)
-- ---------------------------------------------------------------
create table if not exists payments (
  id                       uuid primary key default gen_random_uuid(),
  organization_id          uuid not null references organizations(id),
  booking_id               uuid references bookings(id),
  voucher_id               uuid,
  kind                     text not null
                            check (kind in ('deposit','full','balance',
                                            'voucher_purchase','refund')),
  amount_cents             int not null,
  currency                 text not null default 'AUD',
  status                   text not null default 'pending'
                            check (status in ('pending','succeeded','failed','refunded')),
  stripe_payment_intent_id text,
  created_at               timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- VOUCHERS  (gift cards)
-- ---------------------------------------------------------------
create table if not exists vouchers (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),
  code                text not null unique,
  initial_value_cents int not null,
  balance_cents       int not null,
  purchaser_email     text,
  recipient_email     text,
  expires_at          timestamptz,
  created_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- WAITLIST_ENTRIES
-- ---------------------------------------------------------------
create table if not exists waitlist_entries (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  session_type_id uuid references session_types(id),
  campaign_id     uuid references campaigns(id),
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  desired_date    date,
  status          text not null default 'waiting'
                   check (status in ('waiting','notified','converted','expired')),
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- ENQUIRIES  (the commercial / quote path)
-- ---------------------------------------------------------------
create table if not exists enquiries (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  session_type_id uuid references session_types(id),
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text,
  company         text,
  message         text,
  status          text not null default 'new'
                   check (status in ('new','quoted','won','lost')),
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- MESSAGES  (log of every email / SMS sent)
-- ---------------------------------------------------------------
create table if not exists messages (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  booking_id      uuid references bookings(id),
  channel         text not null check (channel in ('email','sms')),
  template        text not null,
  recipient       text not null,
  status          text not null default 'queued'
                   check (status in ('queued','sent','delivered','failed')),
  sent_at         timestamptz,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- BOOKING_EVENTS  (append-only audit log)
-- ---------------------------------------------------------------
create table if not exists booking_events (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  booking_id      uuid references bookings(id),
  event_type      text not null,
  actor           text,
  detail          jsonb not null default '{}',
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------
create index if not exists idx_bookings_org_status on bookings (organization_id, status);
create index if not exists idx_bookings_during on bookings using gist (during);
create index if not exists idx_exceptions_during on availability_exceptions using gist (during);
create index if not exists idx_customers_email on customers (organization_id, email);
create index if not exists idx_messages_booking on messages (booking_id);

-- ===========================================================================
--  SEED — one organization (Nick Brand Photography), staff #1, and the
--  session types that mirror lib/booking.ts. Adjust as needed.
-- ===========================================================================
insert into organizations (name, slug, timezone)
values ('Nick Brand Photography', 'nick-brand-photography', 'Australia/Sydney')
on conflict (slug) do nothing;

insert into staff (organization_id, display_name, email, role)
select id, 'Nick Brand', 'info@nickbrandphotography.com', 'owner'
from organizations where slug = 'nick-brand-photography'
on conflict do nothing;

-- Session types (prices in cents; deposit = 20%).
insert into session_types
  (organization_id, name, slug, duration_minutes, booking_mode,
   payment_rule, price_cents, deposit_cents, location, sort_order)
select o.id, v.name, v.slug, v.duration, v.mode, v.payrule,
       v.price, v.deposit, v.location, v.sort_order
from organizations o
cross join (values
  ('Corporate Headshot — Essential',    'headshot-essential',    45,  'instant', 'deposit', 39500,  7900, 'Lane Cove studio', 1),
  ('Corporate Headshot — Professional', 'headshot-professional', 90,  'instant', 'deposit', 69500, 13900, 'Lane Cove studio', 2),
  ('Actor & Model Portfolio',           'portfolio',             120, 'instant', 'deposit', 75000, 15000, 'Studio or location', 3),
  ('Family Session',                    'family',                90,  'instant', 'deposit', 55000, 11000, 'Outdoor Sydney location', 4),
  ('Team Headshots & Corporate Projects','team-quote',           0,   'enquiry', 'none',    0,         0, 'On-site', 5)
) as v(name, slug, duration, mode, payrule, price, deposit, location, sort_order)
where o.slug = 'nick-brand-photography'
on conflict (organization_id, slug) do nothing;

-- Working hours: Mon–Fri 08:00–17:00, Sat 09:00–14:00.
insert into availability_rules (organization_id, staff_id, weekday, start_time, end_time)
select o.id, s.id, wd.weekday, wd.start_time, wd.end_time
from organizations o
join staff s on s.organization_id = o.id and s.role = 'owner'
cross join (values
  (1, time '08:00', time '17:00'),
  (2, time '08:00', time '17:00'),
  (3, time '08:00', time '17:00'),
  (4, time '08:00', time '17:00'),
  (5, time '08:00', time '17:00'),
  (6, time '09:00', time '14:00')
) as wd(weekday, start_time, end_time)
where o.slug = 'nick-brand-photography'
on conflict do nothing;

-- Travel zones (fees in cents) — mirrors travelZones in lib/booking.ts.
insert into travel_zones
  (organization_id, label, fee_cents, postcode_ranges, examples, sort_order)
select o.id, v.label, v.fee_cents, v.ranges::jsonb, v.examples, v.sort_order
from organizations o
cross join (values
  ('North Shore & City',                5500,  '[[2000,2011],[2060,2074],[2110,2114]]', 'Lane Cove, North Sydney, Chatswood, Sydney CBD, Ryde', 1),
  ('Inner, Eastern & Northern Beaches', 12000, '[[2015,2052],[2075,2109],[2115,2141]]', 'Surry Hills, Bondi, Newtown, Manly, Hornsby', 2),
  ('Greater Sydney',                    20000, '[[2142,2234]]', 'Parramatta, Liverpool, Bankstown, Sutherland, Cronulla', 3),
  ('Outer Sydney',                      30000, '[[2250,2340],[2555,2580],[2740,2790]]', 'Central Coast, Penrith, Campbelltown, Camden', 4)
) as v(label, fee_cents, ranges, examples, sort_order)
where o.slug = 'nick-brand-photography'
on conflict (organization_id, label) do nothing;
