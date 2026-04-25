// ─── Quran Data Types ────────────────────────────────────────────────────────

export interface Surah {
  number: number;
  name: string;           // Arabic name
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
}

export interface Ayah {
  number: number;         // absolute ayah number (1–6236)
  numberInSurah: number;  // position within the surah
  text: string;           // Arabic (Uthmani script)
  translation?: string;   // English translation
  audio?: string;         // direct URL for this ayah's audio
}

export interface Edition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

// ─── Reciter Types ───────────────────────────────────────────────────────────

export interface Reciter {
  id: string;             // e.g. "ar.alafasy"
  name: string;           // Display name
  arabicName?: string;
  style?: string;         // e.g. "Murattal", "Muallim"
}

// ─── Player State ─────────────────────────────────────────────────────────────

export type PlayerStatus = "idle" | "loading" | "playing" | "paused" | "ended";

export interface PlayerState {
  status: PlayerStatus;
  currentAyahIndex: number;   // index into the loaded ayahs array
  progress: number;            // 0–100
  currentTime: number;         // seconds
  duration: number;            // seconds
  volume: number;              // 0–1
  isMuted: boolean;
}

// ─── App State ────────────────────────────────────────────────────────────────

export interface AppState {
  darkMode: boolean;
  showTranslation: boolean;
  selectedSurah: Surah | null;
  selectedReciter: Reciter;
  surahs: Surah[];
  ayahs: Ayah[];
  isLoadingSurahs: boolean;
  isLoadingAyahs: boolean;
  bookmarkedAyahs: Set<number>;   // stores absolute ayah numbers
  error: string | null;
}

// ─── AlQuran Cloud API Response Shapes ───────────────────────────────────────

export interface AlQuranSurahListResponse {
  code: number;
  status: string;
  data: AlQuranSurah[];
}

export interface AlQuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface AlQuranEditionAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | object;
  audio?: string;
  audioSecondary?: string[];
}

export interface AlQuranEdition {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: AlQuranEditionAyah[];
  edition: Edition;
}

export interface AlQuranSurahDetailResponse {
  code: number;
  status: string;
  data: AlQuranEdition[];
}
