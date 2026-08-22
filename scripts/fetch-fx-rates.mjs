import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.FRED_API_KEY || "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

const SERIES_NAMES = [
  { id: "DEXINUS", name: "USD/INR" },
  { id: "DEXCHUS", name: "USD/CNY" },
  { id: "DEXJPUS", name: "USD/JPY" },
  { id: "DEXUSUK", name: "GBP/USD" },
  { id: "DEXUSAL", name: "AUD/USD" },
  { id: "DEXCAUS", name: "USD/CAD" },
  { id: "DEXKOUS", name: "USD/KRW" },
  { id: "DEXUSEU", name: "EUR/USD" },
  { id: "DEXSIUS", name: "USD/SGD" },
  { id: "DEXUSNZ", name: "NZD/USD" },
  { id: "DEXTAUS", name: "TWD/USD" },
  { id: "DEXBZUS", name: "BRL/USD" },
];

const START_DATE = "2010-01-01";

async function fetchSeries(series) {
  const url = `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}&series_id=${series.id}&file_type=json&observation_start=${START_DATE}`;
  console.log(`Fetching ${series.name} (${series.id})...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${series.id}: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const isBaseNotUsd = !series.name.startsWith("USD/");
  const obsMap = {};

  for (const obs of data.observations || []) {
    const rawValue = parseFloat(obs.value);
    if (!isNaN(rawValue)) {
      const val = isBaseNotUsd && rawValue !== 0 ? 1 / rawValue : rawValue;
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

  for (const s of SERIES_NAMES) {
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

  for (const s of SERIES_NAMES) {
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
