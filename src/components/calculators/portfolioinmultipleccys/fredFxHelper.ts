export interface FredFxRateInfo {
  seriesId: string;
  currencyCode: string;
  currencyName: string;
  symbol: string;
  flag: string;
  startRate: number;
  startDate: string;
  endRate: number;
  endDate: string;
  annualDeprecRate: number; // 5-year annualized depreciation rate vs USD (%)
}

export const KNOWN_FRED_5Y_RATES: Record<string, FredFxRateInfo> = {
  INR: {
    seriesId: "DEXINUS",
    currencyCode: "INR",
    currencyName: "Indian Rupee",
    symbol: "₹",
    flag: "🇮🇳",
    startRate: 74.12,
    startDate: "2021-08-23",
    endRate: 95.7,
    endDate: "2026-08-21",
    annualDeprecRate: -4.98,
  },
  USD: {
    seriesId: "USD",
    currencyCode: "USD",
    currencyName: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    startRate: 1,
    startDate: "2021-08-23",
    endRate: 1,
    endDate: "2026-08-21",
    annualDeprecRate: 0,
  },
  EUR: {
    seriesId: "DEXUSEU",
    currencyCode: "EUR",
    currencyName: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    startRate: 0.8524,
    startDate: "2021-08-23",
    endRate: 0.8559,
    endDate: "2026-08-21",
    annualDeprecRate: -0.08,
  },
  GBP: {
    seriesId: "DEXUSUK",
    currencyCode: "GBP",
    currencyName: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    startRate: 0.729,
    startDate: "2021-08-23",
    endRate: 0.7329,
    endDate: "2026-08-21",
    annualDeprecRate: -0.11,
  },
  JPY: {
    seriesId: "DEXJPUS",
    currencyCode: "JPY",
    currencyName: "Japanese Yen",
    symbol: "¥",
    flag: "🇯🇵",
    startRate: 109.78,
    startDate: "2021-08-23",
    endRate: 158.91,
    endDate: "2026-08-21",
    annualDeprecRate: -7.13,
  },
  CAD: {
    seriesId: "DEXCAUS",
    currencyCode: "CAD",
    currencyName: "Canadian Dollar",
    symbol: "C$",
    flag: "🇨🇦",
    startRate: 1.2666,
    startDate: "2021-08-23",
    endRate: 1.3765,
    endDate: "2026-08-21",
    annualDeprecRate: -1.65,
  },
  AUD: {
    seriesId: "DEXUSAL",
    currencyCode: "AUD",
    currencyName: "Australian Dollar",
    symbol: "A$",
    flag: "🇦🇺",
    startRate: 1.3873,
    startDate: "2021-08-23",
    endRate: 1.3931,
    endDate: "2026-08-21",
    annualDeprecRate: -0.08,
  },
  CHF: {
    seriesId: "DEXSZUS",
    currencyCode: "CHF",
    currencyName: "Swiss Franc",
    symbol: "CHF ",
    flag: "🇨🇭",
    startRate: 0.9137,
    startDate: "2021-08-23",
    endRate: 0.8008,
    endDate: "2026-08-21",
    annualDeprecRate: 2.67,
  },
  SGD: {
    seriesId: "DEXSIUS",
    currencyCode: "SGD",
    currencyName: "Singapore Dollar",
    symbol: "S$",
    flag: "🇸🇬",
    startRate: 1.3572,
    startDate: "2021-08-23",
    endRate: 1.2692,
    endDate: "2026-08-21",
    annualDeprecRate: 1.35,
  },
  CNY: {
    seriesId: "DEXCHUS",
    currencyCode: "CNY",
    currencyName: "Chinese Yuan",
    symbol: "¥",
    flag: "🇨🇳",
    startRate: 6.4805,
    startDate: "2021-08-23",
    endRate: 6.721,
    endDate: "2026-08-21",
    annualDeprecRate: -0.73,
  },
  BRL: {
    seriesId: "DEXBZUS",
    currencyCode: "BRL",
    currencyName: "Brazilian Real",
    symbol: "R$",
    flag: "🇧🇷",
    startRate: 5.384,
    startDate: "2021-08-23",
    endRate: 5.1469,
    endDate: "2026-08-21",
    annualDeprecRate: 0.9,
  },
  MXN: {
    seriesId: "DEXMXUS",
    currencyCode: "MXN",
    currencyName: "Mexican Peso",
    symbol: "Mex$",
    flag: "🇲🇽",
    startRate: 20.364,
    startDate: "2021-08-23",
    endRate: 16.8909,
    endDate: "2026-08-21",
    annualDeprecRate: 3.81,
  },
  ZAR: {
    seriesId: "DEXSFUS",
    currencyCode: "ZAR",
    currencyName: "South African Rand",
    symbol: "R ",
    flag: "🇿🇦",
    startRate: 15.1875,
    startDate: "2021-08-23",
    endRate: 15.9927,
    endDate: "2026-08-21",
    annualDeprecRate: -1.03,
  },
};

export const getCurrencySymbol = (ccyCode: string): string => {
  const code = (ccyCode || "").toUpperCase().trim();
  if (KNOWN_FRED_5Y_RATES[code]) {
    return KNOWN_FRED_5Y_RATES[code].symbol;
  }
  if (code.includes("INR") || code.includes("RUPEE")) return "₹";
  if (code.includes("EUR") || code.includes("EURO")) return "€";
  if (code.includes("GBP") || code.includes("POUND")) return "£";
  if (code.includes("JPY") || code.includes("YEN")) return "¥";
  if (code.includes("CHF") || code.includes("FRANC")) return "CHF ";
  if (code.includes("CAD")) return "C$";
  if (code.includes("AUD")) return "A$";
  if (code.includes("SGD")) return "S$";
  return "$";
};

export const getCurrentFxRate = (ccyCode: string): number => {
  const code = (ccyCode || "").toUpperCase().trim();
  if (KNOWN_FRED_5Y_RATES[code]) {
    return KNOWN_FRED_5Y_RATES[code].endRate;
  }
  if (code.includes("INR")) return 95.7;
  if (code.includes("EUR")) return 0.8559;
  if (code.includes("GBP")) return 0.7329;
  if (code.includes("JPY")) return 158.91;
  if (code.includes("CAD")) return 1.3765;
  if (code.includes("AUD")) return 1.3931;
  if (code.includes("CHF")) return 0.8008;
  if (code.includes("SGD")) return 1.2692;
  if (code.includes("CNY")) return 6.721;
  if (code.includes("AED")) return 3.6725;
  return 1.0;
};

export const convertToUSD = (amount: number, ccyCode: string): number => {
  const rate = getCurrentFxRate(ccyCode);
  return rate > 0 ? amount / rate : amount;
};

export const formatUSDCompact = (val: number, decimals: number = 2): string => {
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";
  if (abs >= 1_000_000_000)
    return `${sign}$${(abs / 1_000_000_000).toFixed(decimals)}B`;
  if (abs >= 1_000_000)
    return `${sign}$${(abs / 1_000_000).toFixed(decimals)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(decimals)}K`;
  return `${sign}$${abs.toFixed(decimals)}`;
};

export const formatCurrencyValue = (val: number, ccyCode: string): string => {
  const symbol = getCurrencySymbol(ccyCode);
  const abs = Math.abs(val);
  const sign = val < 0 ? "-" : "";

  // Special formatting for Indian Rupee (Lakhs & Crores)
  const isINR = (ccyCode || "").toUpperCase().includes("INR");
  if (isINR) {
    if (abs >= 10_000_000) {
      const cr = (abs / 10_000_000).toFixed(2);
      return `${sign}${symbol}${cr} Cr (₹${abs.toLocaleString("en-IN")})`;
    }
    if (abs >= 100_000) {
      const lk = (abs / 100_000).toFixed(2);
      return `${sign}${symbol}${lk} L (₹${abs.toLocaleString("en-IN")})`;
    }
    return `${sign}${symbol}${abs.toLocaleString("en-IN")}`;
  }

  // Western formatting (K, M, B)
  if (abs >= 1_000_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000_000).toFixed(2)}B ($${abs.toLocaleString()})`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${symbol}${(abs / 1_000_000).toFixed(2)}M ($${abs.toLocaleString()})`;
  }
  if (abs >= 1_000) {
    return `${sign}${symbol}${(abs / 1_000).toFixed(1)}K (${abs.toLocaleString()})`;
  }
  return `${sign}${symbol}${abs.toLocaleString()}`;
};
