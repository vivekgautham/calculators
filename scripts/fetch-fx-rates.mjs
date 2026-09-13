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

async function supplementLatestRates(seriesMaps, dateSet) {
  const dates = Array.from(dateSet).sort();
  const lastDate = dates[dates.length - 1];
  const todayStr = new Date().toISOString().split("T")[0];
  if (!lastDate || lastDate >= todayStr) return;

  console.log(
    `Supplementing latest FX rates beyond FRED H.10 release (${lastDate})...`,
  );

  // 1. Fetch range of daily observations from European Central Bank (Frankfurter)
  try {
    const rangeUrl = `https://api.frankfurter.app/${lastDate}..${todayStr}?from=USD`;
    const res = await fetch(rangeUrl);
    if (res.ok) {
      const data = await res.json();
      const ratesMap = data.rates || {};
      for (const [date, dayRates] of Object.entries(ratesMap)) {
        if (date <= lastDate) continue;
        dateSet.add(date);
        for (const s of FX_SERIES) {
          const ccy = s.code.replace("USD/", "");
          if (dayRates[ccy] !== undefined) {
            if (!seriesMaps[s.id]) seriesMaps[s.id] = {};
            seriesMaps[s.id][date] = parseFloat(dayRates[ccy].toFixed(4));
          }
        }
      }
    }
  } catch (e) {
    console.warn("Could not supplement from Frankfurter:", e.message);
  }

  // 2. Fetch latest live rates from open.er-api to ensure all currencies (e.g. TWD) have the latest date
  try {
    const liveRes = await fetch("https://open.er-api.com/v6/latest/USD");
    if (liveRes.ok) {
      const liveData = await liveRes.json();
      if (liveData.rates) {
        const sortedNow = Array.from(dateSet).sort();
        const latestAvailableDate = sortedNow[sortedNow.length - 1] || todayStr;

        for (const s of FX_SERIES) {
          const ccy = s.code.replace("USD/", "");
          if (!seriesMaps[s.id]) seriesMaps[s.id] = {};
          if (
            seriesMaps[s.id][latestAvailableDate] === undefined &&
            liveData.rates[ccy] !== undefined
          ) {
            seriesMaps[s.id][latestAvailableDate] = parseFloat(
              Number(liveData.rates[ccy]).toFixed(4),
            );
          }
        }
      }
    }
  } catch (e) {
    console.warn("Could not supplement from open.er-api:", e.message);
  }
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

  await supplementLatestRates(seriesMaps, dateSet);

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
