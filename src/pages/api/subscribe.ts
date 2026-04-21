import type { APIRoute } from "astro";
import { serviceClient } from "../../lib/supabase";
import { hitOrReject } from "../../lib/rate-limit";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const ip = (request.headers.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  const rl = hitOrReject(ip);
  if (!rl.ok) {
    return new Response(JSON.stringify({ error: "Too many requests" }), {
      status: 429,
      headers: { "Retry-After": String(rl.retryAfterSec), "Content-Type": "application/json" },
    });
  }

  let body: any;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 }); }

  // HONEYPOT
  if (body._honey) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  // TIMING
  const age = Date.now() - Number(body._ts ?? 0);
  if (age < 3000 || age > 24 * 60 * 60 * 1000) {
    return new Response(JSON.stringify({ error: "Form expired" }), { status: 400 });
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
  }

  const sb = serviceClient();
  if (!sb) {
    return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 });
  }

  await sb.from("subscribers").upsert({ email, source: 'newsletter' }, { onConflict: 'email', ignoreDuplicates: true });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
