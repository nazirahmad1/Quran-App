"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mic2, Check } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import { RECITERS } from "@/lib/api";
import type { Reciter } from "@/lib/types";

export default function ReciterSelector() {
  const [open, setOpen] = useState(false);
  const { selectedReciter, selectReciter, isLoadingAyahs } = useQuranStore();

  const handleSelect = (reciter: Reciter) => {
    selectReciter(reciter);
    setOpen(false);
  };

  return (
    <div className="relative" dir="ltr">
      {/* Trigger */}
      <button
        onClick={() => setOpen((p) => !p)}
        disabled={isLoadingAyahs}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          w-full flex items-center gap-3 px-4 py-3
          glass-card rounded-xl
          hover:border-gold-500/50 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-gold-500/50
          disabled:opacity-60 disabled:cursor-not-allowed
          group transition-all duration-200
        `}
      >
        {/* Icon */}
        <span className="p-1.5 rounded-lg bg-emerald-900/10 dark:bg-emerald-500/10">
          <Mic2 size={16} className="text-gold-500" />
        </span>

        {/* Text */}
        <div className="flex-1 text-left min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-emerald-700/60 dark:text-emerald-400/50 font-heading">
            Reciter
          </p>
          <p className="text-sm font-medium text-emerald-900 dark:text-ivory-100 truncate">
            {selectedReciter.name}
          </p>
        </div>

        {/* Chevron */}
        <ChevronDown
          size={16}
          className={`
            text-gold-500 flex-shrink-0 transition-transform duration-200
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.ul
              role="listbox"
              aria-label="Select reciter"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className={`
                absolute z-20 top-full mt-2 left-0 right-0
                glass-card rounded-xl overflow-hidden
                shadow-2xl shadow-emerald-950/20 dark:shadow-black/40
                max-h-72 overflow-y-auto
              `}
            >
              {RECITERS.map((reciter, i) => {
                const isSelected = reciter.id === selectedReciter.id;
                return (
                  <motion.li
                    key={reciter.id}
                    role="option"
                    aria-selected={isSelected}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <button
                      onClick={() => handleSelect(reciter)}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3
                        text-left transition-colors duration-150
                        ${isSelected
                          ? "bg-gold-500/10 text-gold-600 dark:text-gold-400"
                          : "hover:bg-emerald-900/5 dark:hover:bg-emerald-500/5 text-emerald-900 dark:text-ivory-200"
                        }
                      `}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{reciter.name}</p>
                        {reciter.arabicName && (
                          <p className="text-xs text-emerald-700/50 dark:text-emerald-400/40 font-arabic mt-0.5">
                            {reciter.arabicName}
                          </p>
                        )}
                      </div>
                      {reciter.style && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400 uppercase tracking-wide flex-shrink-0">
                          {reciter.style}
                        </span>
                      )}
                      {isSelected && (
                        <Check size={14} className="text-gold-500 flex-shrink-0" />
                      )}
                    </button>
                    {i < RECITERS.length - 1 && <div className="gold-divider mx-4" />}
                  </motion.li>
                );
              })}
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
