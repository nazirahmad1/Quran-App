import type { Metadata } from "next";
import "./globals.css";
import TelegramProvider from "../components/telegram/TelegramProvider";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Noor — The Holy Quran",
  description:
    "A beautiful Quran reader with audio recitation, ayah highlighting, and translation.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cinzel:wght@400;600;700&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased min-h-screen bg-ivory-100 dark:bg-dark-900 text-emerald-900 dark:text-ivory-100 transition-colors duration-300">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{const s=JSON.parse(localStorage.getItem('quran-app-storage')||'{}');if(s.state?.darkMode)document.documentElement.classList.add('dark');}catch(e){}`,
          }}
        />
        <TelegramProvider />
        {children}

          <Footer />
      </body>
    </html>
  );
}
