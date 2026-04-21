const BRAND_NAME = "Harmony Threads";
const BRAND_ACCENT = "#C8A96E";
const SITE_URL = (import.meta.env.PUBLIC_SITE_URL ?? process.env.PUBLIC_SITE_URL ?? "https://harmony-threads-xk7p.vercel.app").replace(/\/$/, "");

function layout(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body { margin:0; padding:0; background:#0F0F0F; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, sans-serif; color:#F0EDE8; }
  .preheader { display:none !important; font-size:1px; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden; }
  .container { max-width:560px; margin:0 auto; padding:32px 24px; }
  .card { background:#1A1A1A; border:1px solid rgba(200,169,110,0.2); border-radius:4px; padding:32px; }
  h1 { font-family: Georgia, 'Times New Roman', serif; font-size:28px; line-height:1.2; margin:0 0 16px; color:#F0EDE8; letter-spacing:-0.01em; }
  p { font-size:15px; line-height:1.6; margin:0 0 16px; color:#9A9189; }
  .btn { display:inline-block; background:${BRAND_ACCENT}; color:#0F0F0F !important; padding:12px 24px; border-radius:2px; text-decoration:none; font-weight:600; }
  .muted { color:#9A9189; font-size:13px; line-height:1.5; }
  .dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:${BRAND_ACCENT}; margin-right:8px; vertical-align:middle; }
  strong { color: #F0EDE8; }
  a { color: ${BRAND_ACCENT}; }
</style></head><body>
<span class="preheader">${preheader}</span>
<div class="container">
  <div style="margin-bottom:24px;"><span class="dot"></span><strong style="font-size:18px;">${BRAND_NAME}</strong></div>
  <div class="card">${content}</div>
  <p class="muted" style="text-align:center; margin-top:24px;">
    <a href="${SITE_URL}">${SITE_URL.replace(/^https?:\/\//, "")}</a>
  </p>
</div>
</body></html>`;
}

export function orderConfirmationHtml({ orderId, amount, currency }: { orderId: string; amount: string; currency: string }) {
  return layout(`
    <h1>Order confirmed ♪</h1>
    <p>Thanks for your order! We've received payment and are getting it ready.</p>
    <p><strong>Order number:</strong> ${orderId}<br /><strong>Total:</strong> ${currency} ${amount}</p>
    <p><a class="btn" href="${SITE_URL}/shop">Continue shopping</a></p>
    <p class="muted">If you ordered a digital product, your download link will arrive separately. Physical orders ship within 2 business days.</p>
  `, `Order ${orderId} confirmed — ${currency} ${amount}`);
}

export function contactAckHtml({ name }: { name: string }) {
  return layout(`
    <h1>Got your message</h1>
    <p>Hey ${name} — thanks for reaching out. We read every message and we'll get back to you within 1 business day.</p>
    <p><a class="btn" href="${SITE_URL}/shop">Browse the shop</a></p>
  `, "We got your message");
}
