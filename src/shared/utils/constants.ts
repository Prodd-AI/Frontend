const server_url =
  import.meta.env.VITE_SERVER_URL ||
  "https://api.prodai.teknesisbrand.com/api/v1/";


  // Common timezones with their abbreviations
   const COMMON_TIMEZONES = [
  { value: "Africa/Lagos", label: "WAT - West Africa Time", abbr: "WAT" },
  { value: "America/New_York", label: "EST - Eastern Time", abbr: "EST" },
  { value: "America/Chicago", label: "CST - Central Time", abbr: "CST" },
  { value: "America/Denver", label: "MST - Mountain Time", abbr: "MST" },
  { value: "America/Los_Angeles", label: "PST - Pacific Time", abbr: "PST" },
  { value: "Europe/London", label: "GMT - Greenwich Mean Time", abbr: "GMT" },
  { value: "Europe/Paris", label: "CET - Central European Time", abbr: "CET" },
  { value: "Asia/Dubai", label: "GST - Gulf Standard Time", abbr: "GST" },
  { value: "Asia/Kolkata", label: "IST - India Standard Time", abbr: "IST" },
  { value: "Asia/Shanghai", label: "CST - China Standard Time", abbr: "CST" },
  { value: "Asia/Tokyo", label: "JST - Japan Standard Time", abbr: "JST" },
  {
    value: "Australia/Sydney",
    label: "AEDT - Australian Eastern Time",
    abbr: "AEDT",
  },
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];


export {
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES,
  COMMON_TIMEZONES,
  server_url
}