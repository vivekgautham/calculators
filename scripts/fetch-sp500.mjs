import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.FRED_API_KEY || "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

async function fetchLatestSP500() {
  const url = `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}&series_id=SP500&file_type=json&sort_order=desc&limit=10`;
  console.log("Fetching latest S&P 500 from FRED (SP500)...");
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch SP500: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  const observations = data.observations || [];

  for (const obs of observations) {
    const val = parseFloat(obs.value);
    if (!isNaN(val) && val > 0) {
      return {
        date: obs.date,
        value: val,
      };
    }
  }

  throw new Error("No valid observation found for SP500");
}

async function main() {
  const outputDir = path.resolve(__dirname, "../public/data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const latest = await fetchLatestSP500();
  const output = {
    updatedAt: new Date().toISOString(),
    seriesId: "SP500",
    name: "S&P 500",
    date: latest.date,
    value: latest.value,
    source: "https://fred.stlouisfed.org/series/sp500",
  };

  const outputPath = path.join(outputDir, "sp500.json");
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
  console.log(
    `Saved latest S&P 500 (${latest.value} on ${latest.date}) to ${outputPath}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
