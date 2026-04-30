"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function TelegramProvider() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) return;

    tg.ready();
    tg.expand();

    const initData = tg.initData;

    // ارسال برای verify
    fetch("/api/telegram-auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ initData }),
    });
  }, []);

  return null;
}