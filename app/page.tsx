"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AyahList from "@/components/AyahList";
import { useQuranStore } from "@/lib/store";
import IslamicPattern from "@/components/IslamicPattern";

export default function Home() {
  const { loadSurahs } = useQuranStore();

  // Load surah list on first mount
  useEffect(() => {
    loadSurahs();
  }, [loadSurahs]);

  return (
    <div className="relative min-h-screen">
      {/* Background decorative patterns */}
      <IslamicPattern
        className="fixed top-0 right-0 w-96 h-96 pointer-events-none"
        opacity={0.06}
      />
      <IslamicPattern
        className="fixed bottom-0 left-0 w-72 h-72 pointer-events-none"
        opacity={0.04}
      />

      {/* Header */}
      <Header />

      {/* Main layout */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start">
          {/* Sidebar — sticky on desktop */}
          <div className="lg:sticky lg:top-24">
            <Sidebar />
          </div>

          {/* Ayah content area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="min-h-[60vh]"
          >
            <AyahList />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
