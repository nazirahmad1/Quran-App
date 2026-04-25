"use client";

import { motion } from "framer-motion";
import ReciterSelector from "./ReciterSelector";
import SurahSelector from "./SurahSelector";
import AudioPlayer from "./AudioPlayer";
import { IslamicArch } from "./IslamicPattern";
import { useQuranStore } from "@/lib/store";

export default function Sidebar() {
  const { selectedSurah, ayahs } = useQuranStore();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4"
      dir="ltr"
    >
      {/* Decorative arch header */}
      <div className="relative overflow-hidden rounded-2xl glass-card p-5 islamic-pattern">
        <IslamicArch className="w-full mb-2 opacity-60" />
        <div className="text-center">
          <p className="font-arabic text-3xl text-gold-600/80 dark:text-gold-400/70 mb-1">
            الْقُرْآنُ الْكَرِيمُ
          </p>
          <p className="font-heading text-[11px] uppercase tracking-[0.2em] text-emerald-700/50 dark:text-emerald-400/40">
            The Noble Quran
          </p>
        </div>

        {/* Surah stats */}
        {selectedSurah && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 grid grid-cols-2 gap-2"
          >
            <div className="text-center p-2 rounded-lg bg-emerald-900/5 dark:bg-emerald-500/5">
              <p className="text-gold-500 font-heading font-bold text-lg">
                {selectedSurah.number}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-emerald-700/50 dark:text-emerald-400/40">
                Surah No.
              </p>
            </div>
            <div className="text-center p-2 rounded-lg bg-emerald-900/5 dark:bg-emerald-500/5">
              <p className="text-gold-500 font-heading font-bold text-lg">
                {selectedSurah.numberOfAyahs}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-emerald-700/50 dark:text-emerald-400/40">
                Verses
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Selectors */}
      <SurahSelector />
      <ReciterSelector />

      {/* Divider */}
      <div className="gold-divider" />

      {/* Audio Player */}
      <AudioPlayer />

      {/* Footer note */}
      <p className="text-center text-[10px] text-emerald-700/30 dark:text-emerald-400/20 font-body px-2">
        Audio from cdn.islamic.network · Text from alquran.cloud
      </p>
    </motion.aside>
  );
}
