"use client";

import { motion } from "framer-motion";
import { Moon, Sun, Languages, Bookmark } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { useEffect } from "react";

export default function Header() {
  const { darkMode, toggleDarkMode, showTranslation, toggleTranslation, bookmarkedAyahs } =
    useQuranStore();

  const bookmarkCount = bookmarkedAyahs.size;

  // Sync dark mode class on <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-gold-500/15 px-4 md:px-8">
      <div className="max-w-5xl mx-auto h-16 flex items-center justify-between gap-4">
        {/* Logo / App name */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
          dir="ltr"
        >
          {/* Geometric logo mark */}
          <svg width="32" height="32" viewBox="0 0 32 32" aria-hidden="true">
            <polygon
              points="16,2 20,10 29,10 22,17 25,26 16,21 7,26 10,17 3,10 12,10"
              fill="none"
              stroke="#d4af37"
              strokeWidth="1.5"
            />
            <circle cx="16" cy="16" r="4" fill="#d4af37" fillOpacity="0.6" />
          </svg>
          <div>
            <h1 className="font-heading text-lg font-semibold gold-text tracking-widest uppercase leading-none">
              Noor
            </h1>
            <p className="font-arabic text-xs text-emerald-700/50 dark:text-emerald-400/40 leading-none mt-0.5">
              نُور
            </p>
          </div>
        </motion.div>

        {/* Right actions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-1"
          dir="ltr"
        >
          {/* Bookmark count badge */}
          {bookmarkCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-500/10 mr-1"
            >
              <Bookmark size={13} className="text-gold-500" />
              <span className="text-xs font-semibold text-gold-600 dark:text-gold-400">
                {bookmarkCount}
              </span>
            </motion.div>
          )}

          {/* Translation toggle */}
          <button
            onClick={toggleTranslation}
            title={showTranslation ? "Hide translation" : "Show translation"}
            className={`
              p-2.5 rounded-xl transition-all duration-200
              ${
                showTranslation
                  ? "bg-emerald-700/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                  : "text-emerald-700/40 dark:text-emerald-400/30 hover:text-emerald-700 dark:hover:text-emerald-400"
              }
              hover:bg-emerald-700/10 dark:hover:bg-emerald-500/10
            `}
            aria-label="Toggle translation"
          >
            <Languages size={18} />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDarkMode}
            title={darkMode ? "Light mode" : "Dark mode"}
            className="p-2.5 rounded-xl text-emerald-700/60 dark:text-emerald-400/50 hover:text-gold-500 hover:bg-gold-500/10 transition-all duration-200"
            aria-label="Toggle dark mode"
          >
            <motion.div
              key={darkMode ? "moon" : "sun"}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.div>
          </button>
        </motion.div>
      </div>
    </header>
  );
}
