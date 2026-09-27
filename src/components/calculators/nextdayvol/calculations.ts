/**
 * Calculations for Next-Day S&P 500 Implied Volatility and Range Brackets
 * based on CBOE VIX.
 */

export interface NextDayVolResult {
  // Annualized VIX
  vix: number;
  // S&P 500 Spot
  spotPrice: number;
  // Exact 1-day implied volatility % using trading days (sqrt(252))
  dailyVolPercent: number;
  // Rule of 16 approximation % (VIX / 16)
  ruleOf16VolPercent: number;
  // Expected 1-day move in dollars/points (+/-)
  expectedMoveDollars: number;

  // 1-Sigma Expected Range (68.27% probability)
  sigma1Upper: number;
  sigma1Lower: number;

  // 2-Sigma Extreme Range (95.45% probability)
  sigma2Upper: number;
  sigma2Lower: number;

  // 3-Sigma Tail Range (99.73% probability)
  sigma3Upper: number;
  sigma3Lower: number;
}

export const TRADING_DAYS = 252;
export const SQRT_252 = Math.sqrt(TRADING_DAYS); // ~15.8745

export function calculateNextDayVolatility(
  spotPrice: number,
  vix: number,
): NextDayVolResult {
  const safeSpot = Math.max(0, spotPrice || 0);
  const safeVix = Math.max(0, vix || 0);

  // Daily Implied Volatility: VIX / sqrt(252)
  const dailyVolPercent = safeVix / SQRT_252;
  const ruleOf16VolPercent = safeVix / 16;

  // 1-Sigma move in dollar points
  const expectedMoveDollars = safeSpot * (dailyVolPercent / 100);

  return {
    vix: safeVix,
    spotPrice: safeSpot,
    dailyVolPercent,
    ruleOf16VolPercent,
    expectedMoveDollars,

    // 1-Sigma (68.27%)
    sigma1Upper: safeSpot + expectedMoveDollars,
    sigma1Lower: safeSpot - expectedMoveDollars,

    // 2-Sigma (95.45%)
    sigma2Upper: safeSpot + 2 * expectedMoveDollars,
    sigma2Lower: safeSpot - 2 * expectedMoveDollars,

    // 3-Sigma (99.73%)
    sigma3Upper: safeSpot + 3 * expectedMoveDollars,
    sigma3Lower: safeSpot - 3 * expectedMoveDollars,
  };
}

export function formatCurrency(val: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

export function formatNumber(val: number, decimals = 2): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}
