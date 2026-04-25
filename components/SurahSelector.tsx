"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, BookOpen, X } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import type { Surah } from "@/lib/types";

export default function SurahSelector() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const { surahs, selectedSurah, selectSurah, isLoadingSurahs, isLoadingAyahs } =
    useQuranStore();

  // Focus search input when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return surahs;
    const q = query.toLowerCase();
    return surahs.filter(
      (s) =>
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        String(s.number).includes(q)
    );
  }, [surahs, query]);

  const handleSelect = (surah: Surah) => {
    selectSurah(surah);
    setOpen(false);
  };

  const revelationColor = (type: string) =>
    type === "Meccan"
      ? "bg-gold-500/10 text-gold-600 dark:text-gold-400"
      : "bg-emerald-700/10 text-emerald-700 dark:text-emerald-400";

  return (
    <div className="relative" dir="ltr">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={isLoadingSurahs || isLoadingAyahs}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          w-full flex items-center gap-3 px-4 py-3
          glass-card rounded-xl
          hover:border-gold-500/50 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-gold-500/50
          disabled:opacity-60 disabled:cursor-not-allowed
          transition-all duration-200
        `}
      >
        <span className="p-1.5 rounded-lg bg-emerald-900/10 dark:bg-emerald-500/10">
          <BookOpen size={16} className="text-gold-500" />
        </span>

        <div className="flex-1 text-left min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-emerald-700/60 dark:text-emerald-400/50 font-heading">
            Surah
          </p>
          {selectedSurah ? (
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gold-600 dark:text-gold-400 font-heading font-semibold">
                {String(selectedSurah.number).padStart(3, "0")}
              </span>
              <p className="text-sm font-medium text-emerald-900 dark:text-ivory-100 truncate">
                {selectedSurah.englishName}
              </p>
            </div>
          ) : (
            <p className="text-sm text-emerald-700/50 dark:text-emerald-400/40">
              {isLoadingSurahs ? "Loading…" : "Select a Surah"}
            </p>
          )}
        </div>

        <ChevronDown
          size={16}
          className={`text-gold-500 flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={`
                absolute z-20 top-full mt-2 left-0 right-0
                glass-card rounded-xl overflow-hidden
                shadow-2xl shadow-emerald-950/20 dark:shadow-black/40
                min-w-[320px]
              `}
            >
              {/* Search */}
              <div className="p-3 border-b border-gold-500/10">
                <div className="relative flex items-center">
                  <Search
                    size={14}
                    className="absolute left-3 text-gold-500/60 pointer-events-none"
                  />
                  <input
                    ref={searchRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search surah…"
                    className={`
                      w-full pl-8 pr-8 py-2 text-sm rounded-lg
                      bg-emerald-900/5 dark:bg-emerald-500/5
                      border border-gold-500/20
                      text-emerald-900 dark:text-ivory-100
                      placeholder:text-emerald-700/30 dark:placeholder:text-emerald-400/30
                      outline-none focus:border-gold-500/50
                    `}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className="absolute right-2.5 text-emerald-700/40 hover:text-emerald-700/70"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              </div>

              {/* List */}
              <ul
                role="listbox"
                aria-label="Select surah"
                className="max-h-80 overflow-y-auto"
              >
                {filtered.length === 0 ? (
                  <li className="py-8 text-center text-sm text-emerald-700/40 dark:text-emerald-400/40">
                    No surahs found
                  </li>
                ) : (
                  filtered.map((surah) => {
                    const isSelected = selectedSurah?.number === surah.number;
                    return (
                      <li key={surah.number} role="option" aria-selected={isSelected}>
                        <button
                          onClick={() => handleSelect(surah)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5
                            text-left transition-colors duration-100
                            ${
                              isSelected
                                ? "bg-gold-500/10"
                                : "hover:bg-emerald-900/5 dark:hover:bg-emerald-500/5"
                            }
                          `}
                        >
                          {/* Number */}
                          <span
                            className={`
                              w-8 h-8 flex-shrink-0 flex items-center justify-center
                              rounded-lg text-[11px] font-heading font-semibold
                              ${
                                isSelected
                                  ? "bg-gold-500 text-white"
                                  : "bg-emerald-900/8 dark:bg-emerald-500/8 text-gold-600 dark:text-gold-400"
                              }
                            `}
                          >
                            {surah.number}
                          </span>

                          {/* Name info */}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-sm font-medium truncate ${
                                isSelected
                                  ? "text-gold-600 dark:text-gold-400"
                                  : "text-emerald-900 dark:text-ivory-100"
                              }`}
                            >
                              {surah.englishName}
                            </p>
                            <p className="text-xs text-emerald-700/50 dark:text-emerald-400/40 truncate">
                              {surah.englishNameTranslation} · {surah.numberOfAyahs} ayahs
                            </p>
                          </div>

                          {/* Arabic name + type */}
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <span className="font-arabic text-base text-emerald-900 dark:text-ivory-200">
                              {surah.name}
                            </span>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-wide ${revelationColor(
                                surah.revelationType
                              )}`}
                            >
                              {surah.revelationType}
                            </span>
                          </div>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
