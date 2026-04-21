import type { APIRoute } from "astro";
import { ssrClient } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let body: any;
  try { body = await request.json(); }
  catch { return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400 }); }

  const email = String(body.email ?? "").trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400 });
  }

  let sb: any;
  try { sb = ssrClient(cookies); }
  catch { return new Response(JSON.stringify({ error: "Server not configured" }), { status: 500 }); }

  const siteUrl = import.meta.env.PUBLIC_SITE_URL ?? "https://harmony-threads-xk7p.vercel.app";

  const { error } = await sb.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${siteUrl}/api/admin/callback`,
    },
  });

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};
