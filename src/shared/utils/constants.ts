import { MoodType } from "@/shared/typings/mood-trend";

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "https://api.prodily.tech/api/v1/";

// Common timezones with their abbreviations
const COMMON_TIMEZONES = [
  // Africa
  { value: "Africa/Lagos", label: "WAT - West Africa Time", abbr: "WAT" },
  { value: "Africa/Cairo", label: "EET - Egypt Time", abbr: "EET" },
  {
    value: "Africa/Johannesburg",
    label: "SAST - South Africa Time",
    abbr: "SAST",
  },
  { value: "Africa/Nairobi", label: "EAT - East Africa Time", abbr: "EAT" },
  { value: "Africa/Casablanca", label: "WET - Morocco Time", abbr: "WET" },
  // Americas
  { value: "America/New_York", label: "EST - Eastern Time", abbr: "EST" },
  { value: "America/Chicago", label: "CST - Central Time", abbr: "CST" },
  { value: "America/Denver", label: "MST - Mountain Time", abbr: "MST" },
  { value: "America/Los_Angeles", label: "PST - Pacific Time", abbr: "PST" },
  { value: "America/Anchorage", label: "AKST - Alaska Time", abbr: "AKST" },
  { value: "America/Toronto", label: "EST - Toronto", abbr: "EST" },
  { value: "America/Vancouver", label: "PST - Vancouver", abbr: "PST" },
  { value: "America/Mexico_City", label: "CST - Mexico City", abbr: "CST" },
  { value: "America/Sao_Paulo", label: "BRT - Brasilia Time", abbr: "BRT" },
  { value: "America/Buenos_Aires", label: "ART - Argentina Time", abbr: "ART" },
  { value: "America/Lima", label: "PET - Peru Time", abbr: "PET" },
  { value: "America/Bogota", label: "COT - Colombia Time", abbr: "COT" },
  // Europe
  { value: "Europe/London", label: "GMT - Greenwich Mean Time", abbr: "GMT" },
  { value: "Europe/Paris", label: "CET - Central European Time", abbr: "CET" },
  { value: "Europe/Berlin", label: "CET - Berlin", abbr: "CET" },
  { value: "Europe/Amsterdam", label: "CET - Amsterdam", abbr: "CET" },
  { value: "Europe/Madrid", label: "CET - Madrid", abbr: "CET" },
  { value: "Europe/Rome", label: "CET - Rome", abbr: "CET" },
  { value: "Europe/Moscow", label: "MSK - Moscow Time", abbr: "MSK" },
  { value: "Europe/Istanbul", label: "TRT - Turkey Time", abbr: "TRT" },
  { value: "Europe/Athens", label: "EET - Athens", abbr: "EET" },
  { value: "Europe/Warsaw", label: "CET - Warsaw", abbr: "CET" },
  // Asia
  { value: "Asia/Dubai", label: "GST - Gulf Standard Time", abbr: "GST" },
  { value: "Asia/Kolkata", label: "IST - India Standard Time", abbr: "IST" },
  { value: "Asia/Shanghai", label: "CST - China Standard Time", abbr: "CST" },
  { value: "Asia/Tokyo", label: "JST - Japan Standard Time", abbr: "JST" },
  { value: "Asia/Singapore", label: "SGT - Singapore Time", abbr: "SGT" },
  { value: "Asia/Hong_Kong", label: "HKT - Hong Kong Time", abbr: "HKT" },
  { value: "Asia/Seoul", label: "KST - Korea Standard Time", abbr: "KST" },
  { value: "Asia/Bangkok", label: "ICT - Indochina Time", abbr: "ICT" },
  { value: "Asia/Jakarta", label: "WIB - Western Indonesia Time", abbr: "WIB" },
  { value: "Asia/Manila", label: "PHT - Philippine Time", abbr: "PHT" },
  { value: "Asia/Karachi", label: "PKT - Pakistan Time", abbr: "PKT" },
  { value: "Asia/Riyadh", label: "AST - Arabia Standard Time", abbr: "AST" },
  { value: "Asia/Tel_Aviv", label: "IST - Israel Time", abbr: "IST" },
  // Australia & Pacific
  {
    value: "Australia/Sydney",
    label: "AEDT - Australian Eastern Time",
    abbr: "AEDT",
  },
  { value: "Australia/Melbourne", label: "AEDT - Melbourne", abbr: "AEDT" },
  { value: "Australia/Brisbane", label: "AEST - Brisbane", abbr: "AEST" },
  {
    value: "Australia/Perth",
    label: "AWST - Australian Western Time",
    abbr: "AWST",
  },
  { value: "Pacific/Auckland", label: "NZDT - New Zealand Time", abbr: "NZDT" },
  { value: "Pacific/Honolulu", label: "HST - Hawaii Time", abbr: "HST" },
  { value: "Pacific/Fiji", label: "FJT - Fiji Time", abbr: "FJT" },
  // UTC
  { value: "UTC", label: "UTC - Coordinated Universal Time", abbr: "UTC" },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];
const MOOD_EMOJIS: Record<MoodType, string> = {
  great: "☺️",
  good: "🙂",
  okay: "😐",
  notGreat: "😞",
  rough: "😣",
};
export {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  COMMON_TIMEZONES,
  SERVER_URL,
  MOOD_EMOJIS,
};
