import type { APIRoute } from "astro";
import { anonClient } from "../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async () => {
  const SITE = (import.meta.env.PUBLIC_SITE_URL ?? "https://harmony-threads-xk7p.vercel.app").replace(/\/$/, "");
  const sb = anonClient();

  const staticPages = [
    { title: "Shop All Products", slug: "shop", desc: "Browse all Harmony Threads products — graphic tees, digital downloads, and lifestyle goods." },
    { title: "Graphic Tees Collection", slug: "collections/graphic-tees", desc: "Rock band graphic t-shirts in green, gray, and red. Unisex sizing S–XL." },
    { title: "Digital Downloads", slug: "collections/digital-downloads", desc: "Instant-access rock music history ebooks. PDF, Kindle, and Audio included." },
    { title: "Lifestyle Collection", slug: "collections/lifestyle", desc: "Premium lifestyle goods for music lovers including signature perfume." },
    { title: "About Harmony Threads", slug: "about", desc: "Founded by music fans who wanted merch worth wearing." },
    { title: "Contact", slug: "contact", desc: "Get in touch for order support, sizing help, or digital download issues." },
  ];

  let articles: any[] = [];
  if (sb) {
    const { data } = await sb
      .from("content")
      .select("slug, title, excerpt")
      .not("published_at", "is", null)
      .order("published_at", { ascending: false })
      .limit(20);
    articles = data ?? [];
  }

  const lines: string[] = [
    "# Harmony Threads",
    "",
    "> Music-inspired graphic tees, digital history books, and lifestyle goods for people who live the sound.",
    "",
    "## Products",
    "",
    `- [The Band Graphic T-Shirt](${SITE}/product/physical-product-the-band-t-shirt): Rock band graphic tee in green, gray, and red. Unisex sizing S–XL. $19.99.`,
    `- [The History of Rock Music](${SITE}/product/digital-product-the-history-of-rock-music): Digital book covering six decades of rock. PDF, Kindle, and Audio. $14.99.`,
    `- [Harmony Signature Perfume](${SITE}/product/example-perfume): Premium fragrance for music lovers. 50ml eau de parfum. $74.99.`,
    "",
    "## Key pages",
    "",
    ...staticPages.map(p => `- [${p.title}](${SITE}/${p.slug}): ${p.desc}`),
  ];

  if (articles.length > 0) {
    lines.push("", "## Latest articles", "");
    for (const a of articles) {
      lines.push(`- [${a.title}](${SITE}/blog/${a.slug}): ${a.excerpt ?? ""}`);
    }
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
