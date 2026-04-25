import type {
  Surah,
  Ayah,
  Reciter,
  AlQuranSurahListResponse,
  AlQuranSurahDetailResponse,
} from "./types";

const BASE_URL = "https://api.alquran.cloud/v1";
const AUDIO_CDN = "https://cdn.islamic.network/quran/audio/128";

// ─── Static Reciters ──────────────────────────────────────────────────────────
// AlQuran.cloud audio edition identifiers
export const RECITERS: Reciter[] = [
  { id: "ar.alafasy",              name: "Mishary Rashid Alafasy",     arabicName: "مشاري راشد العفاسي",    style: "Murattal" },
  { id: "ar.abdullahbasfar",       name: "Abdullah Basfar",            arabicName: "عبدالله بصفر",           style: "Murattal" },
  { id: "ar.abdurrahmaansudais",   name: "Abdurrahmaan As-Sudais",     arabicName: "عبدالرحمن السديس",       style: "Murattal" },
  { id: "ar.shaatree",             name: "Abu Bakr Ash-Shaatree",      arabicName: "أبو بكر الشاطري",        style: "Murattal" },
  { id: "ar.hudhaify",             name: "Ali Al-Hudhaify",            arabicName: "علي الحذيفي",            style: "Murattal" },
  { id: "ar.minshawi",             name: "Mohamed Siddiq El-Minshawi", arabicName: "محمد صديق المنشاوي",    style: "Murattal" },
  { id: "ar.muhammadayyoub",       name: "Muhammad Ayyoub",            arabicName: "محمد أيوب",             style: "Murattal" },
  { id: "ar.mahermuaiqly",        name: "Maher Al-Muaiqly",           arabicName: "ماهر المعيقلي",          style: "Murattal" },
];

// ─── Fetch all Surahs ─────────────────────────────────────────────────────────
export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE_URL}/surah`);
  if (!res.ok) throw new Error(`Failed to fetch surahs: ${res.statusText}`);

  const json: AlQuranSurahListResponse = await res.json();
  return json.data.map((s) => ({
    number: s.number,
    name: s.name,
    englishName: s.englishName,
    englishNameTranslation: s.englishNameTranslation,
    numberOfAyahs: s.numberOfAyahs,
    revelationType: s.revelationType as "Meccan" | "Medinan",
  }));
}

// ─── Fetch Surah with Text + Translation + Audio URLs ────────────────────────
export async function fetchSurahWithAudio(
  surahNumber: number,
  reciterId: string
): Promise<Ayah[]> {
  // Fetch Arabic text + English translation in parallel
  const editions = `quran-uthmani,en.asad`;
  const url = `${BASE_URL}/surah/${surahNumber}/editions/${editions}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch surah detail: ${res.statusText}`);

  const json: AlQuranSurahDetailResponse = await res.json();

  const arabicEdition = json.data[0];
  const translationEdition = json.data[1];

  // Map ayahs — merge Arabic, translation, and construct audio URL
  return arabicEdition.ayahs.map((arabicAyah, i) => {
    const translationAyah = translationEdition?.ayahs[i];
    // CDN audio URL pattern: /reciterId/absoluteAyahNumber.mp3
    const audioUrl = `${AUDIO_CDN}/${reciterId}/${arabicAyah.number}.mp3`;

    return {
      number: arabicAyah.number,
      numberInSurah: arabicAyah.numberInSurah,
      text: arabicAyah.text,
      translation: translationAyah?.text,
      audio: audioUrl,
    };
  });
}

// ─── Build audio URL for a single ayah ───────────────────────────────────────
export function getAyahAudioUrl(
  absoluteNumber: number,
  reciterId: string
): string {
  return `${AUDIO_CDN}/${reciterId}/${absoluteNumber}.mp3`;
}

// ─── Surah number → padded string (for display) ──────────────────────────────
export function formatSurahNumber(n: number): string {
  return String(n).padStart(3, "0");
}

// ─── Arabic numeral converter ─────────────────────────────────────────────────
export function toArabicNumeral(n: number): string {
  const arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return String(n)
    .split("")
    .map((d) => arabicNumerals[parseInt(d)] ?? d)
    .join("");
}
