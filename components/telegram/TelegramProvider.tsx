// "use client";

// import { useEffect } from "react";

// export default function TelegramProvider() {
//   useEffect(() => {
//     if (typeof window !== "undefined" && window.Telegram?.WebApp) {
//       const tg = window.Telegram.WebApp;

//       tg.ready();
//       tg.expand();

//       console.log("Telegram WebApp Ready");

//       const user = tg.initDataUnsafe?.user;
//       console.log("User:", user);
//     }
//   }, []);

//   return null;
// }


"use client";

import { useEffect, useState } from "react";

export default function TelegramProvider() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) return;

    tg.ready();
    tg.expand();

    const initData = tg.initData; // 👈 امن (برای بک‌اند)
    const unsafeUser = tg.initDataUnsafe?.user; // 👈 فقط برای UI موقت

    console.log("Unsafe user:", unsafeUser);

    // ارسال به سرور برای verify
    fetch("/api/auth/telegram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ initData }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) {
          setUser(data.user); // 👈 user واقعی و verify شده
        }
      })
      .catch((err) => {
        console.error("Auth error:", err);
      });
  }, []);

  return null;
}
