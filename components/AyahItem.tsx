"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Play } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { toArabicNumeral } from "@/lib/api";
import type { Ayah } from "@/lib/types";

interface AyahItemProps {
  ayah: Ayah;
  index: number;
  isActive: boolean;
}

export default function AyahItem({ ayah, index, isActive }: AyahItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const { showTranslation, isBookmarked, toggleBookmark, seekToAyah } =
    useQuranStore();

  const bookmarked = isBookmarked(ayah.number);

  // Auto-scroll active ayah into view
  useEffect(() => {
    if (isActive && itemRef.current) {
      itemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isActive]);

  return (
    <motion.div
      ref={itemRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.8) }}
      className={`
        group relative rounded-2xl px-5 py-5 mb-3
        transition-all duration-300 ease-out cursor-default
        border border-transparent
        ${
          isActive
            ? "ayah-highlight border-gold-500/20 shadow-lg shadow-gold-500/10"
            : "hover:bg-emerald-900/[0.03] dark:hover:bg-emerald-500/[0.04] hover:border-gold-500/10"
        }
      `}
    >
      {/* ── Top row: ayah number + actions ────────────────────────────────── */}
      <div className="flex items-center justify-between mb-4">
        {/* Ayah number badge (Arabic style) */}
        <div className="relative flex-shrink-0">
          <svg
            viewBox="0 0 44 44"
            className="w-10 h-10"
            aria-hidden="true"
          >
            <polygon
              points="22,2 26,10 35,10 28,17 31,26 22,21 13,26 16,17 9,10 18,10"
              fill={isActive ? "#d4af37" : "none"}
              stroke="#d4af37"
              strokeWidth="1.5"
              strokeOpacity={isActive ? "1" : "0.5"}
              fillOpacity={isActive ? "0.15" : "0"}
            />
            <text
              x="22"
              y="28"
              textAnchor="middle"
              fontSize="11"
              fontFamily="var(--font-amiri)"
              fill={isActive ? "#d4af37" : "#7c7c6e"}
              fontWeight="bold"
            >
              {toArabicNumeral(ayah.numberInSurah)}
            </text>
          </svg>
        </div>

        {/* Actions (show on hover / active) */}
        <div
          className={`
            flex items-center gap-2 transition-opacity duration-200
            ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          {/* Play this ayah */}
          <button
            onClick={() => seekToAyah(index)}
            className="p-1.5 rounded-lg bg-gold-500/10 hover:bg-gold-500/20 text-gold-600 dark:text-gold-400 transition-colors"
            aria-label={`Play ayah ${ayah.numberInSurah}`}
          >
            <Play size={13} className="translate-x-px" />
          </button>

          {/* Bookmark */}
          <button
            onClick={() => toggleBookmark(ayah.number)}
            className={`
              p-1.5 rounded-lg transition-colors
              ${
                bookmarked
                  ? "bg-gold-500/15 text-gold-500"
                  : "bg-emerald-900/5 dark:bg-emerald-500/5 text-emerald-700/50 dark:text-emerald-400/50 hover:text-gold-500 hover:bg-gold-500/10"
              }
            `}
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark this ayah"}
          >
            {bookmarked ? (
              <BookmarkCheck size={13} />
            ) : (
              <Bookmark size={13} />
            )}
          </button>
        </div>
      </div>

      {/* ── Arabic text ────────────────────────────────────────────────────── */}
      <p
        className={`
          arabic-text arabic-text-large text-right leading-loose mb-4
          transition-colors duration-300
          ${
            isActive
              ? "text-emerald-900 dark:text-ivory-50"
              : "text-emerald-900/85 dark:text-ivory-200/85"
          }
        `}
        lang="ar"
        dir="rtl"
      >
        {ayah.text}
        {/* Verse end marker (Unicode) */}
        <span className="text-gold-500 mx-2 opacity-80">
          {" "}﴿{toArabicNumeral(ayah.numberInSurah)}﴾
        </span>
      </p>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="gold-divider my-3" />

      {/* ── Translation ───────────────────────────────────────────────────── */}
      {showTranslation && ayah.translation && (
        <motion.p
          initial={false}
          animate={{ opacity: 1 }}
          className={`
            text-sm leading-relaxed font-body dir-ltr
            ${
              isActive
                ? "text-emerald-800 dark:text-ivory-200"
                : "text-emerald-800/70 dark:text-ivory-300/60"
            }
          `}
          dir="ltr"
        >
          {ayah.translation}
        </motion.p>
      )}

      {/* Active left border indicator */}
      {isActive && (
        <motion.div
          layoutId="active-ayah-indicator"
          className="absolute left-0 top-3 bottom-3 w-0.5 bg-gold-500 rounded-full animate-glow-pulse"
        />
      )}
    </motion.div>
  );
}
