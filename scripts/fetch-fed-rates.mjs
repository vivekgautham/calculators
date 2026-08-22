import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.FRED_API_KEY || "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

const SERIES = [
  { id: "DGS2", name: "2-Year Treasury Yield" },
  { id: "DGS10", name: "10-Year Treasury Yield" },
  { id: "DGS30", name: "30-Year Treasury Yield" },
  { id: "DGS5", name: "5-Year Treasury Yield" },
  { id: "DGS1", name: "1-Year Treasury Yield" },
  { id: "DGS3MO", name: "3-Month Treasury Yield" },
  { id: "DFF", name: "Effective Federal Funds Rate (EFFR)" },
  { id: "SOFR", name: "Secured Overnight Financing Rate (SOFR)" },
];

// Fetch 20 years of daily observations to stay well under 500 KB limit
const START_DATE = "2006-01-01";

async function fetchSeries(series) {
  const url = `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}&series_id=${series.id}&file_type=json&observation_start=${START_DATE}`;
  console.log(`Fetching ${series.name} (${series.id})...`);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch ${series.id}: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const obsMap = {};
  for (const obs of data.observations || []) {
    const val = parseFloat(obs.value);
    if (!isNaN(val)) {
      obsMap[obs.date] = val;
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

  for (const s of SERIES) {
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

  for (const s of SERIES) {
    if (seriesMaps[s.id]) {
      output.series[s.id] = sortedDates.map((d) =>
        seriesMaps[s.id][d] !== undefined ? seriesMaps[s.id][d] : null,
      );
    }
  }

  const outputPath = path.join(outputDir, "fed_rates.json");
  fs.writeFileSync(outputPath, JSON.stringify(output));
  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(1);
  console.log(`Saved Fed & Treasury rates to ${outputPath} (${sizeKB} KB)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
