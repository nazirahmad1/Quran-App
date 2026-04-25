"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Loader2,
  BookOpen,
} from "lucide-react";
import { useQuranStore } from "@/lib/store";

// ─── Time formatter ───────────────────────────────────────────────────────────
function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    status,
    currentAyahIndex,
    progress,
    currentTime,
    duration,
    volume,
    isMuted,
    ayahs,
    selectedSurah,
    setStatus,
    setProgress,
    setVolume,
    toggleMute,
    playNextAyah,
    playPrevAyah,
    seekToAyah,
    setCurrentAyahIndex,
  } = useQuranStore();

  const currentAyah = ayahs[currentAyahIndex];
  const isPlaying = status === "playing";
  const isLoading = status === "loading";
  const hasAyahs = ayahs.length > 0;

  // ── Create / manage the audio element ────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.preload = "auto";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      if (!audio.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      setProgress(progress, audio.currentTime, audio.duration);
    };

    const onEnded = () => playNextAyah();
    const onCanPlay = () => {
      if (useQuranStore.getState().status === "loading") {
        setStatus("playing");
        audio.play().catch(() => setStatus("paused"));
      }
    };
    const onError = () => setStatus("paused");

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("canplaythrough", onCanPlay);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("canplaythrough", onCanPlay);
      audio.removeEventListener("error", onError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Load new audio when ayah changes ─────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentAyah?.audio) return;

    audio.pause();
    audio.src = currentAyah.audio;
    audio.load();

    if (status === "playing" || status === "loading") {
      setStatus("loading");
      // canplaythrough handler will resume playback
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAyahIndex, currentAyah?.audio]);

  // ── Volume / mute sync ────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // ── Play / Pause toggle ───────────────────────────────────────────────────
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !hasAyahs) return;

    if (isPlaying) {
      audio.pause();
      setStatus("paused");
    } else {
      if (!audio.src && currentAyah?.audio) {
        audio.src = currentAyah.audio;
        audio.load();
        setStatus("loading");
        return;
      }
      try {
        setStatus("loading");
        await audio.play();
        setStatus("playing");
      } catch {
        setStatus("paused");
      }
    }
  }, [isPlaying, hasAyahs, currentAyah, setStatus]);

  // ── Seek on progress bar change ───────────────────────────────────────────
  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const audio = audioRef.current;
      if (!audio || !audio.duration) return;
      const pct = Number(e.target.value);
      const newTime = (pct / 100) * audio.duration;
      audio.currentTime = newTime;
      setProgress(pct, newTime, audio.duration);
    },
    [setProgress]
  );

  // ── Skip handlers ──────────────────────────────────────────────────────────
  const handlePrev = () => {
    const audio = audioRef.current;
    // If more than 3s in, restart the same ayah; otherwise go to prev
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
    } else {
      playPrevAyah();
    }
  };

  const handleNext = () => playNextAyah();

  // ── Progress bar background gradient ─────────────────────────────────────
  const progressGradient = `linear-gradient(to right, #d4af37 0%, #d4af37 ${progress}%, rgba(212,175,55,0.2) ${progress}%, rgba(212,175,55,0.2) 100%)`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`
        glass-card rounded-2xl overflow-hidden
        ${!hasAyahs ? "opacity-60 pointer-events-none" : ""}
      `}
      dir="ltr"
    >
      {/* ── Currently Playing Info ───────────────────────────────────────── */}
      <div className="px-5 pt-4 pb-3 border-b border-gold-500/10">
        <AnimatePresence mode="wait">
          {selectedSurah && currentAyah ? (
            <motion.div
              key={`${currentAyah.number}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Animated wave indicator */}
                {isPlaying && (
                  <div className="flex items-end gap-0.5 h-5 flex-shrink-0">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1 bg-gold-500 rounded-full"
                        animate={{ height: ["4px", "16px", "4px"] }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.15,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs text-emerald-700/60 dark:text-emerald-400/50 font-heading uppercase tracking-wider">
                    Now Playing
                  </p>
                  <p className="text-sm font-semibold text-emerald-900 dark:text-ivory-100 truncate">
                    {selectedSurah.englishName} — Ayah {currentAyah.numberInSurah}
                  </p>
                </div>
              </div>
              <span className="text-2xl font-arabic text-gold-600/80 dark:text-gold-400/80 flex-shrink-0">
                {selectedSurah.name}
              </span>
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-3"
            >
              <BookOpen size={18} className="text-gold-500/40" />
              <p className="text-sm text-emerald-700/40 dark:text-emerald-400/30">
                Select a Surah to begin
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Progress Bar ─────────────────────────────────────────────────── */}
      <div className="px-5 pt-4">
        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={handleSeek}
          disabled={!hasAyahs || !duration}
          className="progress-bar w-full"
          style={{ background: progressGradient }}
          aria-label="Playback progress"
        />
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-emerald-700/50 dark:text-emerald-400/40 tabular-nums">
            {formatTime(currentTime)}
          </span>
          <span className="text-[11px] text-emerald-700/50 dark:text-emerald-400/40 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-4">
        {/* Volume */}
        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg hover:bg-gold-500/10 transition-colors text-emerald-700/60 dark:text-emerald-400/50 hover:text-gold-500"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={isMuted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="volume-bar flex-1 max-w-[80px]"
            style={{
              background: `linear-gradient(to right, #d4af37 0%, #d4af37 ${
                (isMuted ? 0 : volume) * 100
              }%, rgba(212,175,55,0.2) ${(isMuted ? 0 : volume) * 100}%, rgba(212,175,55,0.2) 100%)`,
            }}
            aria-label="Volume"
          />
        </div>

        {/* Main controls */}
        <div className="flex items-center gap-3">
          {/* Prev */}
          <button
            onClick={handlePrev}
            disabled={!hasAyahs || currentAyahIndex === 0}
            className="p-2 rounded-xl hover:bg-gold-500/10 transition-colors text-emerald-700/70 dark:text-emerald-400/60 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Previous ayah"
          >
            <SkipBack size={20} />
          </button>

          {/* Play/Pause */}
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={togglePlay}
            disabled={!hasAyahs}
            className={`
              relative w-14 h-14 rounded-full flex items-center justify-center
              bg-gradient-to-br from-gold-500 to-gold-600
              shadow-lg shadow-gold-500/30 hover:shadow-gold-500/50
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-shadow duration-300
            `}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isLoading ? (
              <Loader2 size={22} className="text-white animate-spin" />
            ) : isPlaying ? (
              <Pause size={22} className="text-white" />
            ) : (
              <Play size={22} className="text-white translate-x-0.5" />
            )}
            {/* Pulse ring when playing */}
            {isPlaying && (
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-gold-400"
                animate={{ scale: [1, 1.3], opacity: [0.6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
              />
            )}
          </motion.button>

          {/* Next */}
          <button
            onClick={handleNext}
            disabled={!hasAyahs || currentAyahIndex === ayahs.length - 1}
            className="p-2 rounded-xl hover:bg-gold-500/10 transition-colors text-emerald-700/70 dark:text-emerald-400/60 hover:text-gold-500 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next ayah"
          >
            <SkipForward size={20} />
          </button>
        </div>

        {/* Ayah counter */}
        <div className="flex-1 flex justify-end">
          <span className="text-xs text-emerald-700/50 dark:text-emerald-400/40 font-heading tabular-nums">
            {hasAyahs ? `${currentAyahIndex + 1} / ${ayahs.length}` : "— / —"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
