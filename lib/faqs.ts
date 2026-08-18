/**
 * Shared FAQ content.
 *
 * The homepage and booking FAQs used to be declared inline in their own page
 * files, which meant nothing else could reuse them — including the /faq hub,
 * which exists so there is one citable URL answering every question about
 * working with Nick. Answer engines strongly prefer a page whose topic *is* the
 * question set over an answer buried three sections down a sales page.
 */

import type { FAQ } from "./services";
import { site } from "./site";

export const homeFaqs: FAQ[] = [
  {
    q: "What type of photography does Nick Brand Photography specialise in?",
    a: "Nick Brand Photography specialises in corporate headshots, personal branding photography, executive portraits, team headshots, LinkedIn headshots, actor headshots and corporate event photography across Sydney.",
  },
  {
    q: "Where is Nick Brand Photography based?",
    a: `The studio is at ${site.address.street}, ${site.address.suburb} ${site.address.state}. Sessions also run on-site at offices and on location across Greater Sydney, including the CBD, North Sydney, Surry Hills, Parramatta and Chatswood.`,
  },
  {
    q: "How do I book a photography session?",
    a: `Bookings are made online through the booking page, which shows live availability. You can also call ${site.phone} or email ${site.email} to discuss a shoot.`,
  },
  {
    q: "Do you photograph teams at their own office?",
    a: "Yes. On-site team headshot days are run across Sydney with a mobile studio set up in your office, so staff are photographed consistently with minimal disruption.",
  },
];

export const bookingFaqs: FAQ[] = [
  {
    q: "How far in advance should I book?",
    a: "Individual headshot and personal branding sessions can often be booked within the same week. Team headshot days and corporate event coverage are best booked two to three weeks ahead so the date and crew can be locked in.",
  },
  {
    q: "What happens after I book online?",
    a: "You'll receive an instant confirmation, and Nick will follow up to confirm the shoot details — location, number of people, wardrobe and the look you're after. Nothing is left to guesswork on the day.",
  },
  {
    q: "Can you photograph our team at our own office?",
    a: "Yes. On-site days run across Greater Sydney with a full mobile studio set up in your workplace, so staff are photographed consistently with minimal disruption to the working day.",
  },
  {
    q: "What if I need to reschedule?",
    a: "Plans change — just let Nick know as early as you can and the session will be moved to a new time. You can reschedule directly from your booking confirmation email.",
  },
  {
    q: "Do you prefer a quick chat before booking?",
    a: `Absolutely. If you'd rather talk through your shoot first, call ${site.phone} or email ${site.email} and Nick will help you choose the right session before you reserve a time.`,
  },
];

/** Questions about the business itself, for the /faq hub. */
export const businessFaqs: FAQ[] = [
  {
    q: "Who will actually photograph my session?",
    a: "Nick Brand, personally. Every session on this site is photographed by Nick himself rather than by an associate or a contractor — which is the reason a team of fifty can be matched frame for frame, and the reason the person who quotes you is the person who turns up.",
  },
  {
    q: "Is Nick Brand Photography insured?",
    a: `Yes — $20 million public liability. A certificate of currency is supplied on request, which building managers and corporate procurement teams often require before an on-site shoot is approved. Ask for it when you book and it will not hold up the date.`,
  },
  {
    q: "Do your prices include GST?",
    a: "There is no GST to include. Nick Brand Photography is not registered for GST, so every published price is the final price and nothing is added at invoice. This is worth checking against other quotes, because most Sydney studios advertise ex-GST figures that are 10% higher than they appear.",
  },
  {
    q: "Where is the studio, and is there parking?",
    a: `The studio is at ${site.address.street}, ${site.address.suburb} ${site.address.state} ${site.address.postcode}, on Sydney's Lower North Shore. There is parking on site, and it is an easy drive from the CBD, North Sydney, Chatswood and St Leonards.`,
  },
  {
    q: "What are your opening hours?",
    a: `Sessions run ${site.hours}. Early-morning and evening slots are genuinely available rather than nominal — a lot of corporate work happens before nine or after five, because that is when people can get away from their desks.`,
  },
  {
    q: "Do you travel outside Sydney?",
    a: "Greater Sydney is included in the standard rates. Work further afield — the Central Coast, the Hunter, Wollongong or interstate — is quoted individually to cover travel time. Get in touch with the location and dates.",
  },
  {
    q: "Who owns the copyright in the photographs?",
    a: "Nick retains copyright in the photographs, which is standard practice. You receive full rights to use your images for business and personal promotion — website, social media, print, press and advertising — with no time limit and no per-use fee. The images are not licensed to anyone else.",
  },
  {
    q: "How long does it take to get the images?",
    a: "Standard delivery is within five business days for headshot and team sessions. A 48-hour express option is available for an additional $80, and actor sessions have a 24-hour rush option for submission deadlines. Personal branding libraries take a little longer because there are far more frames to edit.",
  },
  {
    q: "What happens if I don't like my photos?",
    a: "You review the session in a private online gallery and choose which frames get edited, so nothing is finished before you have seen it. If the session genuinely hasn't produced something you're happy with, Nick will reshoot it. That has been rare — mostly because the direction happens during the shoot rather than being discovered afterwards.",
  },
  {
    q: "Can you match headshots to an existing set from another photographer?",
    a: "Usually, yes. Send a few examples of the existing images before the session and the lighting, background and crop can be matched closely enough that new starters sit alongside the old set without standing out. Mention it at the enquiry stage rather than on the day.",
  },
];
