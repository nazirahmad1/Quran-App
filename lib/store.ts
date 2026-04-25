"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Surah, Ayah, Reciter, PlayerStatus, AppState, PlayerState } from "./types";
import { RECITERS, fetchSurahs, fetchSurahWithAudio } from "./api";

// ─── Combined Store Shape ─────────────────────────────────────────────────────

interface QuranStore extends AppState, PlayerState {
  // App actions
  toggleDarkMode: () => void;
  toggleTranslation: () => void;
  loadSurahs: () => Promise<void>;
  selectSurah: (surah: Surah) => void;
  selectReciter: (reciter: Reciter) => void;
  loadAyahs: (surahNumber: number) => Promise<void>;
  toggleBookmark: (ayahNumber: number) => void;
  isBookmarked: (ayahNumber: number) => boolean;

  // Player actions
  setStatus: (status: PlayerStatus) => void;
  setCurrentAyahIndex: (index: number) => void;
  setProgress: (progress: number, currentTime: number, duration: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  playNextAyah: () => void;
  playPrevAyah: () => void;
  seekToAyah: (index: number) => void;
  resetPlayer: () => void;
}

const defaultPlayerState: PlayerState = {
  status: "idle",
  currentAyahIndex: 0,
  progress: 0,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
};

export const useQuranStore = create<QuranStore>()(
  persist(
    (set, get) => ({
      // ── Initial App State ──────────────────────────────────────────────────
      darkMode: false,
      showTranslation: true,
      selectedSurah: null,
      selectedReciter: RECITERS[0],
      surahs: [],
      ayahs: [],
      isLoadingSurahs: false,
      isLoadingAyahs: false,
      bookmarkedAyahs: new Set<number>(),
      error: null,

      // ── Initial Player State ───────────────────────────────────────────────
      ...defaultPlayerState,

      // ── App Actions ───────────────────────────────────────────────────────

      toggleDarkMode: () =>
        set((s) => ({ darkMode: !s.darkMode })),

      toggleTranslation: () =>
        set((s) => ({ showTranslation: !s.showTranslation })),

      loadSurahs: async () => {
        if (get().surahs.length > 0) return; // already loaded
        set({ isLoadingSurahs: true, error: null });
        try {
          const surahs = await fetchSurahs();
          set({ surahs, isLoadingSurahs: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to load surahs",
            isLoadingSurahs: false,
          });
        }
      },

      selectSurah: (surah) => {
        set({ selectedSurah: surah, ayahs: [], ...defaultPlayerState });
        get().loadAyahs(surah.number);
      },

      selectReciter: (reciter) => {
        set({ selectedReciter: reciter, ayahs: [], ...defaultPlayerState });
        const { selectedSurah } = get();
        if (selectedSurah) get().loadAyahs(selectedSurah.number);
      },

      loadAyahs: async (surahNumber) => {
        const { selectedReciter } = get();
        set({ isLoadingAyahs: true, error: null, ...defaultPlayerState });
        try {
          const ayahs = await fetchSurahWithAudio(surahNumber, selectedReciter.id);
          set({ ayahs, isLoadingAyahs: false });
        } catch (err) {
          set({
            error: err instanceof Error ? err.message : "Failed to load ayahs",
            isLoadingAyahs: false,
          });
        }
      },

      toggleBookmark: (ayahNumber) => {
        const current = new Set(get().bookmarkedAyahs);
        if (current.has(ayahNumber)) {
          current.delete(ayahNumber);
        } else {
          current.add(ayahNumber);
        }
        set({ bookmarkedAyahs: current });
      },

      isBookmarked: (ayahNumber) => get().bookmarkedAyahs.has(ayahNumber),

      // ── Player Actions ────────────────────────────────────────────────────

      setStatus: (status) => set({ status }),

      setCurrentAyahIndex: (index) =>
        set({ currentAyahIndex: index, progress: 0, currentTime: 0, duration: 0 }),

      setProgress: (progress, currentTime, duration) =>
        set({ progress, currentTime, duration }),

      setVolume: (volume) => set({ volume, isMuted: volume === 0 }),

      toggleMute: () =>
        set((s) => ({ isMuted: !s.isMuted })),

      playNextAyah: () => {
        const { currentAyahIndex, ayahs } = get();
        if (currentAyahIndex < ayahs.length - 1) {
          set({ currentAyahIndex: currentAyahIndex + 1, progress: 0, currentTime: 0 });
        } else {
          set({ status: "ended", currentAyahIndex: 0 });
        }
      },

      playPrevAyah: () => {
        const { currentAyahIndex } = get();
        if (currentAyahIndex > 0) {
          set({ currentAyahIndex: currentAyahIndex - 1, progress: 0, currentTime: 0 });
        }
      },

      seekToAyah: (index) => {
        set({
          currentAyahIndex: index,
          progress: 0,
          currentTime: 0,
          status: "playing",
        });
      },

      resetPlayer: () => set(defaultPlayerState),
    }),
    {
      name: "quran-app-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist preferences and bookmarks, not transient player state
      partialize: (state) => ({
        darkMode: state.darkMode,
        showTranslation: state.showTranslation,
        selectedReciter: state.selectedReciter,
        bookmarkedAyahs: Array.from(state.bookmarkedAyahs),
        volume: state.volume,
      }),
      // Rehydrate bookmarks back to Set
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.bookmarkedAyahs)) {
          (state as QuranStore).bookmarkedAyahs = new Set(
            state.bookmarkedAyahs as unknown as number[]
          );
        }
      },
    }
  )
);
