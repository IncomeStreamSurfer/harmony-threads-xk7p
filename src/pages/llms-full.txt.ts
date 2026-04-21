import type { APIRoute } from "astro";
import { anonClient } from "../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async () => {
  const sb = anonClient();
  let pages: any[] = [];
  if (sb) {
    const { data } = await sb.from("pages").select("slug, title, body_html").not("published_at", "is", null);
    pages = data ?? [];
  }

  const stripHtml = (html: string) =>
    html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

  const staticContent = `
# Harmony Threads

> Music-inspired graphic tees, digital downloads, and lifestyle goods.

## About

Harmony Threads was founded in 2026 by music fans who couldn't find merch worth wearing. We make graphic tees featuring legendary rock acts, publish digital guides to rock history, and curate lifestyle goods for people who carry the music with them.

## Products

### The Band Graphic T-Shirt ($19.99)
Celebrate the timeless legacy of one of rock music's most influential groups. Unisex sizing Small through XL. Available in forest green, charcoal gray, and bold red. 150g ring-spun cotton. Free returns on unworn items.

### The History of Rock Music ($14.99)
A comprehensive digital journey through six decades of rock — from Chuck Berry's first riff to stadium anthems. Includes PDF, Kindle/ePub, and Audiobook formats. Instant delivery after purchase. DRM-free.

### Harmony Signature Perfume ($74.99)
A bold, long-lasting fragrance for those who carry the music with them. 50ml eau de parfum. Top notes of bergamot and black pepper; heart of leather and vetiver; base of sandalwood and musk.

## Collections

- Graphic Tees: Rock band apparel in multiple colorways, unisex sizing
- Digital Downloads: Instant-access music history books and ebooks
- Lifestyle: Premium goods for music enthusiasts

## Policies

- Free shipping on orders over $50
- Ships within 2 business days
- Free returns within 30 days (unworn, physical items)
- Digital purchases: instant delivery, DRM-free, non-refundable
`;

  const dbContent = pages.map(p =>
    `# ${p.title}\n\n${stripHtml(p.body_html ?? "")}\n\n---\n`
  ).join("\n");

  return new Response(staticContent + "\n---\n\n" + dbContent, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
