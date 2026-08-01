import { getData } from "country-list";

export interface CountryDemographic {
  name: string;
  fertility: number;
  lifeExpectancy: number;
  netMigration: number;
  youthRatio: number;
  workingRatio: number;
  elderlyRatio: number;
}

// Simple string hashing function to generate deterministic profile values per country
function getHashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

const rawCountries = getData();

// Generate dynamic, unique demographics for all countries
export const COUNTRIES_DEMOGRAPHICS: Record<string, CountryDemographic> = {
  custom: {
    name: "Custom Settings",
    fertility: 2.1,
    lifeExpectancy: 75,
    netMigration: 0,
    youthRatio: 0.20,
    workingRatio: 0.65,
    elderlyRatio: 0.15,
  },
};

rawCountries.forEach((c) => {
  const hash = getHashCode(c.name);

  // Deterministic value mapping in realistic ranges:
  const fertility = 1.2 + (hash % 16) * 0.1; // 1.2 to 2.7
  const lifeExpectancy = 68 + (hash % 16); // 68 to 83
  const netMigration = ((hash % 7) - 3) * 30000; // -90,000 to +90,000

  // Cohorts ratios summing up to 100%
  const youthRatio = 0.15 + (hash % 7) * 0.03; // 15% to 33%
  const workingRatio = 0.55 + (hash % 6) * 0.02; // 55% to 65%
  const elderlyRatio = 1 - youthRatio - workingRatio;

  // Key is the lowercased ISO country code
  const key = c.code.toLowerCase();

  COUNTRIES_DEMOGRAPHICS[key] = {
    name: c.name,
    fertility,
    lifeExpectancy,
    netMigration,
    youthRatio,
    workingRatio,
    elderlyRatio,
  };
});
