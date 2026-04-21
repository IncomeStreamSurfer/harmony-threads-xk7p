import type { AstroGlobal } from "astro";
import { ssrClient } from "./supabase";

export async function requireAdmin(Astro: AstroGlobal): Promise<Response | null> {
  let sb: any;
  try {
    sb = ssrClient(Astro.cookies);
  } catch {
    return Astro.redirect("/admin/login");
  }
  
  const { data: { user } } = await sb.auth.getUser();
  if (!user) {
    return Astro.redirect("/admin/login?next=" + encodeURIComponent(Astro.url.pathname));
  }

  const { data: admin } = await sb
    .from("admins")
    .select("email")
    .eq("email", user.email ?? "")
    .maybeSingle();

  if (!admin) {
    return new Response("Forbidden — your email is not in the admin allowlist.", { status: 403 });
  }

  return null;
}
