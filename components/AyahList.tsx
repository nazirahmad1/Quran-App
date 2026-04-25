"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, BookOpen } from "lucide-react";
import { useQuranStore } from "@/lib/store";
import AyahItem from "./AyahItem";

export default function AyahList() {
  const {
    ayahs,
    isLoadingAyahs,
    currentAyahIndex,
    selectedSurah,
    error,
  } = useQuranStore();

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoadingAyahs) {
    return (
      <div className="space-y-4">
        {/* Loading header */}
        <div className="flex items-center justify-center gap-3 py-6">
          <Loader2 size={20} className="text-gold-500 animate-spin" />
          <span className="text-sm text-emerald-700/60 dark:text-emerald-400/50 font-body">
            Loading verses…
          </span>
        </div>
        {/* Skeleton cards */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 border border-gold-500/5 bg-emerald-900/[0.02] dark:bg-emerald-500/[0.02]"
          >
            {/* Number skeleton */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-full skeleton" />
            </div>
            {/* Arabic text skeleton — RTL, larger lines */}
            <div className="flex flex-col items-end gap-3 mb-4">
              <div className="skeleton h-7 rounded-lg" style={{ width: `${70 + (i % 3) * 12}%` }} />
              <div className="skeleton h-7 rounded-lg" style={{ width: `${50 + (i % 4) * 10}%` }} />
            </div>
            <div className="gold-divider my-3" />
            {/* Translation skeleton */}
            <div className="space-y-2">
              <div className="skeleton h-4 rounded w-full" />
              <div className="skeleton h-4 rounded" style={{ width: "80%" }} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-16 gap-4"
      >
        <div className="p-4 rounded-full bg-red-500/10">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <div className="text-center">
          <p className="font-semibold text-red-600 dark:text-red-400">
            Failed to load verses
          </p>
          <p className="text-sm text-emerald-700/50 dark:text-emerald-400/40 mt-1">
            {error}
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Empty / no selection ──────────────────────────────────────────────────
  if (!selectedSurah || ayahs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-24 gap-6"
      >
        {/* Decorative Quran icon */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gold-500/8 flex items-center justify-center">
            <BookOpen size={40} className="text-gold-500/40" />
          </div>
          {/* Orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gold-500/30"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: `0 ${-52}px`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 2,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="text-center">
          <p className="text-2xl font-arabic text-gold-600/60 dark:text-gold-400/50 mb-2">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="text-sm text-emerald-700/50 dark:text-emerald-400/40 font-body">
            Select a Surah and reciter to begin
          </p>
        </div>
      </motion.div>
    );
  }

  // ── Main list ─────────────────────────────────────────────────────────────
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedSurah.number}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Surah header */}
        <div className="text-center mb-8">
          <p className="font-arabic text-5xl text-emerald-900 dark:text-ivory-100 mb-2">
            {selectedSurah.name}
          </p>
          <p className="font-heading text-sm tracking-widest uppercase text-gold-600 dark:text-gold-400">
            {selectedSurah.englishName} · {selectedSurah.englishNameTranslation}
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs text-emerald-700/50 dark:text-emerald-400/40">
            <span>{selectedSurah.numberOfAyahs} verses</span>
            <span className="w-1 h-1 rounded-full bg-gold-500/40" />
            <span>{selectedSurah.revelationType}</span>
          </div>

          {/* Basmala (shown for all surahs except Al-Tawbah = 9) */}
          {selectedSurah.number !== 9 && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 font-arabic text-2xl text-gold-600/80 dark:text-gold-400/70"
              lang="ar"
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </motion.p>
          )}
        </div>

        <div className="gold-divider mb-6" />

        {/* Ayah list */}
        <div>
          {ayahs.map((ayah, index) => (
            <AyahItem
              key={ayah.number}
              ayah={ayah}
              index={index}
              isActive={index === currentAyahIndex}
            />
          ))}
        </div>

        {/* Footer */}
        <div className="text-center py-8 mt-4">
          <div className="gold-divider mb-6" />
          <p className="font-arabic text-xl text-gold-600/50 dark:text-gold-400/40">
            صَدَقَ اللَّهُ الْعَظِيمُ
          </p>
          <p className="text-xs text-emerald-700/30 dark:text-emerald-400/30 mt-1">
            Allah the Great has spoken the truth
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
