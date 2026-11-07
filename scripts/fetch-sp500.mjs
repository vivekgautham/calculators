import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.FRED_API_KEY || "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

async function fetchLatestSP500() {
  let latest = null;

  try {
    const url = `https://api.stlouisfed.org/fred/series/observations?api_key=${API_KEY}&series_id=SP500&file_type=json&sort_order=desc&limit=10`;
    console.log("Fetching latest S&P 500 from FRED (SP500)...");
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const observations = data.observations || [];

      for (const obs of observations) {
        const val = parseFloat(obs.value);
        if (!isNaN(val) && val > 0) {
          latest = {
            date: obs.date,
            value: val,
            source: "https://fred.stlouisfed.org/series/sp500",
          };
          break;
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch SP500 from FRED:", err.message);
  }

  // Supplement with latest trading day from Yahoo Finance if newer
  try {
    const yUrl =
      "https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC?interval=1d&range=5d";
    const yRes = await fetch(yUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (yRes.ok) {
      const yData = await yRes.json();
      const meta = yData.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice;
      const timestamp = meta?.regularMarketTime;
      if (price && timestamp) {
        const yDate = new Date(timestamp * 1000).toISOString().split("T")[0];
        if (!latest || yDate > latest.date) {
          console.log(
            `Supplementing latest S&P 500 from Yahoo Finance: ${price} on ${yDate}`,
          );
          latest = {
            date: yDate,
            value: parseFloat(price.toFixed(2)),
            source: "https://finance.yahoo.com/quote/%5EGSPC",
          };
        }
      }
    }
  } catch (err) {
    console.warn("Could not fetch SP500 from Yahoo Finance:", err.message);
  }

  if (latest) {
    return latest;
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
    source: latest.source,
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
