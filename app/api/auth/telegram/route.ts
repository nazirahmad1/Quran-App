// app/api/auth/telegram/route.ts

import crypto from "crypto";

export async function POST(req: Request) {
  const { initData } = await req.json();

  if (!initData) {
    return Response.json({ ok: false });
  }

  const urlParams = new URLSearchParams(initData);
  const hash = urlParams.get("hash");

  urlParams.delete("hash");

  // ساخت data_check_string
  const dataCheckString = Array.from(urlParams.entries())
    .sort()
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  // 🔑 BOT TOKEN از env
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;

  const secretKey = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  const hmac = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  // ❌ اگر hash برابر نبود → رد
  if (hmac !== hash) {
    return Response.json({ ok: false, error: "Invalid hash" });
  }

  // ✅ حالا دیتا معتبره
  const user = JSON.parse(urlParams.get("user") || "{}");

  return Response.json({
    ok: true,
    user,
  });
}