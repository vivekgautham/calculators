import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.FRED_API_KEY || "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

export const FX_SERIES = [
  // Major Currencies
  {
    id: "DEXUSEU",
    code: "USD/EUR",
    name: "USD/EUR (Euro)",
    currencyName: "Euro",
    invert: true,
    category: "Major Currencies",
  },
  {
    id: "DEXJPUS",
    code: "USD/JPY",
    name: "USD/JPY (Japanese Yen)",
    currencyName: "Japanese Yen",
    invert: false,
    category: "Major Currencies",
  },
  {
    id: "DEXUSUK",
    code: "USD/GBP",
    name: "USD/GBP (British Pound)",
    currencyName: "British Pound",
    invert: true,
    category: "Major Currencies",
  },
  {
    id: "DEXCAUS",
    code: "USD/CAD",
    name: "USD/CAD (Canadian Dollar)",
    currencyName: "Canadian Dollar",
    invert: false,
    category: "Major Currencies",
  },
  {
    id: "DEXUSAL",
    code: "USD/AUD",
    name: "USD/AUD (Australian Dollar)",
    currencyName: "Australian Dollar",
    invert: true,
    category: "Major Currencies",
  },
  {
    id: "DEXSZUS",
    code: "USD/CHF",
    name: "USD/CHF (Swiss Franc)",
    currencyName: "Swiss Franc",
    invert: false,
    category: "Major Currencies",
  },
  {
    id: "DEXUSNZ",
    code: "USD/NZD",
    name: "USD/NZD (New Zealand Dollar)",
    currencyName: "New Zealand Dollar",
    invert: true,
    category: "Major Currencies",
  },
  {
    id: "DEXSIUS",
    code: "USD/SGD",
    name: "USD/SGD (Singapore Dollar)",
    currencyName: "Singapore Dollar",
    invert: false,
    category: "Major Currencies",
  },
  {
    id: "DEXHKUS",
    code: "USD/HKD",
    name: "USD/HKD (Hong Kong Dollar)",
    currencyName: "Hong Kong Dollar",
    invert: false,
    category: "Major Currencies",
  },
  {
    id: "DEXNOUS",
    code: "USD/NOK",
    name: "USD/NOK (Norwegian Krone)",
    currencyName: "Norwegian Krone",
    invert: false,
    category: "Major Currencies",
  },
  {
    id: "DEXSDUS",
    code: "USD/SEK",
    name: "USD/SEK (Swedish Krona)",
    currencyName: "Swedish Krona",
    invert: false,
    category: "Major Currencies",
  },
  {
    id: "DEXKOUS",
    code: "USD/KRW",
    name: "USD/KRW (South Korean Won)",
    currencyName: "South Korean Won",
    invert: false,
    category: "Major Currencies",
  },

  // Emerging Market Currencies
  {
    id: "DEXINUS",
    code: "USD/INR",
    name: "USD/INR (Indian Rupee)",
    currencyName: "Indian Rupee",
    invert: false,
    category: "Emerging Market Currencies",
  },
  {
    id: "DEXCHUS",
    code: "USD/CNY",
    name: "USD/CNY (Chinese Yuan)",
    currencyName: "Chinese Yuan",
    invert: false,
    category: "Emerging Market Currencies",
  },
  {
    id: "DEXTAUS",
    code: "USD/TWD",
    name: "USD/TWD (Taiwan Dollar)",
    currencyName: "Taiwan Dollar",
    invert: false,
    category: "Emerging Market Currencies",
  },
  {
    id: "DEXBZUS",
    code: "USD/BRL",
    name: "USD/BRL (Brazilian Real)",
    currencyName: "Brazilian Real",
    invert: false,
    category: "Emerging Market Currencies",
  },
  {
    id: "DEXMXUS",
    code: "USD/MXN",
    name: "USD/MXN (Mexican Peso)",
    currencyName: "Mexican Peso",
    invert: false,
    category: "Emerging Market Currencies",
  },
  {
    id: "DEXSFUS",
    code: "USD/ZAR",
    name: "USD/ZAR (South African Rand)",
    currencyName: "South African Rand",
    invert: false,
    category: "Emerging Market Currencies",
  },
];

const START_DATE = "2006-01-01";

async function fetchSeries(series) {
  const url = `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}&series_id=${series.id}&file_type=json&observation_start=${START_DATE}`;
  console.log(`Fetching ${series.name} (${series.id})...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch ${series.id}: ${res.status} ${res.statusText}`,
    );
  }
  const data = await res.json();
  const obsMap = {};

  for (const obs of data.observations || []) {
    const rawValue = parseFloat(obs.value);
    if (!isNaN(rawValue) && rawValue !== 0) {
      const val = series.invert ? 1 / rawValue : rawValue;
      obsMap[obs.date] = parseFloat(val.toFixed(4));
    }
  }

  return { id: series.id, obsMap };
}

async function main() {
  const outputDir = path.resolve(__dirname, "../public/data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const seriesMaps = {};
  const dateSet = new Set();

  for (const s of FX_SERIES) {
    try {
      const { id, obsMap } = await fetchSeries(s);
      seriesMaps[id] = obsMap;
      Object.keys(obsMap).forEach((d) => dateSet.add(d));
    } catch (err) {
      console.error(`Error fetching series ${s.id}:`, err);
    }
  }

  const sortedDates = Array.from(dateSet).sort();
  const output = {
    updatedAt: new Date().toISOString(),
    dates: sortedDates,
    series: {},
  };

  for (const s of FX_SERIES) {
    if (seriesMaps[s.id]) {
      output.series[s.id] = sortedDates.map((d) =>
        seriesMaps[s.id][d] !== undefined ? seriesMaps[s.id][d] : null,
      );
    }
  }

  const outputPath = path.join(outputDir, "fx_rates.json");
  fs.writeFileSync(outputPath, JSON.stringify(output));
  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`Saved FX rates to ${outputPath} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
