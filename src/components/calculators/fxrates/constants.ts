export interface FXSeriesOption {
  id: string;
  code: string;
  name: string;
  currencyName: string;
  category: "Major Currencies" | "Emerging Market Currencies";
  flag: string;
  symbol: string;
}

export const FX_SERIES_OPTIONS: FXSeriesOption[] = [
  // Major Currencies
  {
    id: "DEXUSEU",
    code: "USD/EUR",
    name: "USD/EUR (Euro)",
    currencyName: "Euro",
    category: "Major Currencies",
    flag: "🇪🇺",
    symbol: "€",
  },
  {
    id: "DEXJPUS",
    code: "USD/JPY",
    name: "USD/JPY (Japanese Yen)",
    currencyName: "Japanese Yen",
    category: "Major Currencies",
    flag: "🇯🇵",
    symbol: "¥",
  },
  {
    id: "DEXUSUK",
    code: "USD/GBP",
    name: "USD/GBP (British Pound)",
    currencyName: "British Pound",
    category: "Major Currencies",
    flag: "🇬🇧",
    symbol: "£",
  },
  {
    id: "DEXCAUS",
    code: "USD/CAD",
    name: "USD/CAD (Canadian Dollar)",
    currencyName: "Canadian Dollar",
    category: "Major Currencies",
    flag: "🇨🇦",
    symbol: "C$",
  },
  {
    id: "DEXUSAL",
    code: "USD/AUD",
    name: "USD/AUD (Australian Dollar)",
    currencyName: "Australian Dollar",
    category: "Major Currencies",
    flag: "🇦🇺",
    symbol: "A$",
  },
  {
    id: "DEXSZUS",
    code: "USD/CHF",
    name: "USD/CHF (Swiss Franc)",
    currencyName: "Swiss Franc",
    category: "Major Currencies",
    flag: "🇨🇭",
    symbol: "CHF",
  },
  {
    id: "DEXUSNZ",
    code: "USD/NZD",
    name: "USD/NZD (New Zealand Dollar)",
    currencyName: "New Zealand Dollar",
    category: "Major Currencies",
    flag: "🇳🇿",
    symbol: "NZ$",
  },
  {
    id: "DEXSIUS",
    code: "USD/SGD",
    name: "USD/SGD (Singapore Dollar)",
    currencyName: "Singapore Dollar",
    category: "Major Currencies",
    flag: "🇸🇬",
    symbol: "S$",
  },
  {
    id: "DEXHKUS",
    code: "USD/HKD",
    name: "USD/HKD (Hong Kong Dollar)",
    currencyName: "Hong Kong Dollar",
    category: "Major Currencies",
    flag: "🇭🇰",
    symbol: "HK$",
  },
  {
    id: "DEXNOUS",
    code: "USD/NOK",
    name: "USD/NOK (Norwegian Krone)",
    currencyName: "Norwegian Krone",
    category: "Major Currencies",
    flag: "🇳🇴",
    symbol: "kr",
  },
  {
    id: "DEXSDUS",
    code: "USD/SEK",
    name: "USD/SEK (Swedish Krona)",
    currencyName: "Swedish Krona",
    category: "Major Currencies",
    flag: "🇸🇪",
    symbol: "kr",
  },
  {
    id: "DEXKOUS",
    code: "USD/KRW",
    name: "USD/KRW (South Korean Won)",
    currencyName: "South Korean Won",
    category: "Major Currencies",
    flag: "🇰🇷",
    symbol: "₩",
  },

  // Emerging Market Currencies
  {
    id: "DEXINUS",
    code: "USD/INR",
    name: "USD/INR (Indian Rupee)",
    currencyName: "Indian Rupee",
    category: "Emerging Market Currencies",
    flag: "🇮🇳",
    symbol: "₹",
  },
  {
    id: "DEXCHUS",
    code: "USD/CNY",
    name: "USD/CNY (Chinese Yuan)",
    currencyName: "Chinese Yuan",
    category: "Emerging Market Currencies",
    flag: "🇨🇳",
    symbol: "¥",
  },
  {
    id: "DEXTAUS",
    code: "USD/TWD",
    name: "USD/TWD (Taiwan Dollar)",
    currencyName: "Taiwan Dollar",
    category: "Emerging Market Currencies",
    flag: "🇹🇼",
    symbol: "NT$",
  },
  {
    id: "DEXBZUS",
    code: "USD/BRL",
    name: "USD/BRL (Brazilian Real)",
    currencyName: "Brazilian Real",
    category: "Emerging Market Currencies",
    flag: "🇧🇷",
    symbol: "R$",
  },
  {
    id: "DEXMXUS",
    code: "USD/MXN",
    name: "USD/MXN (Mexican Peso)",
    currencyName: "Mexican Peso",
    category: "Emerging Market Currencies",
    flag: "🇲🇽",
    symbol: "Mex$",
  },
  {
    id: "DEXSFUS",
    code: "USD/ZAR",
    name: "USD/ZAR (South African Rand)",
    currencyName: "South African Rand",
    category: "Emerging Market Currencies",
    flag: "🇿🇦",
    symbol: "R",
  },
];

export const DEFAULT_FX_SERIES: FXSeriesOption[] = [
  FX_SERIES_OPTIONS.find((s) => s.id === "DEXUSEU")!,
  FX_SERIES_OPTIONS.find((s) => s.id === "DEXUSUK")!,
  FX_SERIES_OPTIONS.find((s) => s.id === "DEXJPUS")!,
  FX_SERIES_OPTIONS.find((s) => s.id === "DEXUSAL")!,
  FX_SERIES_OPTIONS.find((s) => s.id === "DEXCAUS")!,
  FX_SERIES_OPTIONS.find((s) => s.id === "DEXINUS")!,
  FX_SERIES_OPTIONS.find((s) => s.id === "DEXCHUS")!,
];

// Alias for backwards compatibility if needed
export const SERIES_NAMES = FX_SERIES_OPTIONS;
