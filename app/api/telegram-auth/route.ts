// app/api/telegram-auth/route.ts
import crypto from "crypto";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { initData } = await req.json();

  const urlParams = new URLSearchParams(initData);

  const hash = urlParams.get("hash");
  urlParams.delete("hash");

  const dataCheckString = Array.from(urlParams.entries())
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const botToken = process.env.TELEGRAM_BOT_TOKEN!;

  const secret = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  const checkHash = crypto
    .createHmac("sha256", secret)
    .update(dataCheckString)
    .digest("hex");

  if (checkHash !== hash) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const user = JSON.parse(urlParams.get("user") || "{}");

  // 👇 ذخیره یا آپدیت کاربر
  await supabase.from("tg_users").upsert({
    telegram_id: user.id,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
  });

  // 👇 ثبت بازدید
  await supabase.from("tg_visits").insert([
    {
      telegram_id: user.id,
      username: user.username,
      visited_at: new Date().toISOString(),
    },
  ]);

  return Response.json({ ok: true, user });
}