export const API_KEY = "2d9fe8dbad89dabfd5afba8ca6e5f4f6";

// Using Vite proxy to avoid CORS issues in development
export const FRED_URL = `/api/fred/fred/series/observations?api_key=${API_KEY}`;

export const SERIES_NAMES = [
    "DEXINUS",
    "DEXCHUS",
    "DEXJPUS",
    "DEXUSUK",
    "DEXUSAL",
    "DEXCAUS",
    "DEXKOUS",
    "DEXUSEU",
    "DEXSIUS",
];
