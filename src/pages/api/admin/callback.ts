import type { APIRoute } from "astro";
import { ssrClient } from "../../../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get("code");
  if (!code) return redirect("/admin/login");

  let sb: any;
  try { sb = ssrClient(cookies); }
  catch { return redirect("/admin/login"); }

  const { error } = await sb.auth.exchangeCodeForSession(code);
  if (error) return redirect("/admin/login");

  return redirect("/admin");
};
