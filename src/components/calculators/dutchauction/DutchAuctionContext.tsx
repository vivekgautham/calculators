import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  ReactNode,
} from "react";
import {
  DealerBid,
  ProcessedBid,
  DealerSummary,
  AuctionResults,
  PresetScenario,
  PRIMARY_DEALER_NAMES,
} from "./types";

export const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: "10y_standard",
    name: "10-Year Treasury Note Auction ($42B)",
    description:
      "Standard $42B benchmark 10Y Note auction with competitive bids from 10 Primary Dealers. Moderate 2.58x Bid-to-Cover with a small +0.5 bps tail.",
    targetOfferingAmount: 42000,
    nonCompetitiveAmount: 1000,
    whenIssuedYield: 4.28,
    bids: [
      { dealerName: "JPMorgan Securities", bidYield: 4.25, bidAmount: 4500 },
      { dealerName: "Goldman Sachs", bidYield: 4.255, bidAmount: 5000 },
      { dealerName: "Morgan Stanley", bidYield: 4.26, bidAmount: 6000 },
      {
        dealerName: "Citigroup Global Markets",
        bidYield: 4.265,
        bidAmount: 7500,
      },
      { dealerName: "BofA Securities", bidYield: 4.27, bidAmount: 8000 },
      { dealerName: "Barclays Capital", bidYield: 4.275, bidAmount: 7000 },
      {
        dealerName: "Wells Fargo Securities",
        bidYield: 4.285,
        bidAmount: 9000,
      },
      { dealerName: "UBS Securities", bidYield: 4.285, bidAmount: 6500 },
      {
        dealerName: "BNP Paribas Securities",
        bidYield: 4.29,
        bidAmount: 8500,
      },
      {
        dealerName: "Deutsche Bank Securities",
        bidYield: 4.295,
        bidAmount: 9500,
      },
      { dealerName: "Cantor Fitzgerald", bidYield: 4.3, bidAmount: 11000 },
      { dealerName: "Nomura Securities", bidYield: 4.31, bidAmount: 12000 },
      { dealerName: "Jefferies LLC", bidYield: 4.32, bidAmount: 7000 },
      { dealerName: "Mizuho Securities", bidYield: 4.33, bidAmount: 6000 },
    ],
  },
  {
    id: "strong_blowout",
    name: "Strong Blowout Demand ($35B - Stopped Through)",
    description:
      "Very strong institutional demand with high 3.08x Bid-to-Cover. The auction stops through When-Issued yield by -1.5 bps with heavy aggressive bidding.",
    targetOfferingAmount: 35000,
    nonCompetitiveAmount: 800,
    whenIssuedYield: 4.15,
    bids: [
      { dealerName: "JPMorgan Securities", bidYield: 4.11, bidAmount: 6000 },
      { dealerName: "Goldman Sachs", bidYield: 4.115, bidAmount: 7500 },
      {
        dealerName: "Citigroup Global Markets",
        bidYield: 4.12,
        bidAmount: 8000,
      },
      { dealerName: "Morgan Stanley", bidYield: 4.125, bidAmount: 6500 },
      { dealerName: "BofA Securities", bidYield: 4.135, bidAmount: 9000 },
      { dealerName: "Barclays Capital", bidYield: 4.135, bidAmount: 7500 },
      {
        dealerName: "Wells Fargo Securities",
        bidYield: 4.14,
        bidAmount: 10000,
      },
      { dealerName: "UBS Securities", bidYield: 4.145, bidAmount: 8500 },
      {
        dealerName: "BNP Paribas Securities",
        bidYield: 4.15,
        bidAmount: 11000,
      },
      {
        dealerName: "Deutsche Bank Securities",
        bidYield: 4.16,
        bidAmount: 12000,
      },
      { dealerName: "Jefferies LLC", bidYield: 4.17, bidAmount: 9000 },
      { dealerName: "Nomura Securities", bidYield: 4.18, bidAmount: 9500 },
    ],
  },
  {
    id: "soft_tailed",
    name: "Soft Demand ($40B - Tailed by +2.0 bps)",
    description:
      "Subdued investor demand and cautious dealer bidding leading to a 2.18x Bid-to-Cover and a +2.0 bps tail above When-Issued yield.",
    targetOfferingAmount: 40000,
    nonCompetitiveAmount: 600,
    whenIssuedYield: 4.4,
    bids: [
      { dealerName: "JPMorgan Securities", bidYield: 4.37, bidAmount: 3000 },
      { dealerName: "Goldman Sachs", bidYield: 4.38, bidAmount: 3500 },
      { dealerName: "Morgan Stanley", bidYield: 4.39, bidAmount: 4000 },
      { dealerName: "BofA Securities", bidYield: 4.4, bidAmount: 5000 },
      {
        dealerName: "Citigroup Global Markets",
        bidYield: 4.41,
        bidAmount: 7000,
      },
      { dealerName: "Barclays Capital", bidYield: 4.415, bidAmount: 8000 },
      {
        dealerName: "Wells Fargo Securities",
        bidYield: 4.42,
        bidAmount: 12000,
      },
      {
        dealerName: "BNP Paribas Securities",
        bidYield: 4.42,
        bidAmount: 10000,
      },
      { dealerName: "UBS Securities", bidYield: 4.43, bidAmount: 11000 },
      {
        dealerName: "Deutsche Bank Securities",
        bidYield: 4.44,
        bidAmount: 12500,
      },
      { dealerName: "Cantor Fitzgerald", bidYield: 4.45, bidAmount: 10000 },
    ],
  },
  {
    id: "tight_allotment",
    name: "Tight Multi-Dealer Cutoff Tie ($50B)",
    description:
      "$50B offering where multiple primary dealers place large bids at the exact 4.495% stop-out yield, receiving a 41.2% pro-rata allotment.",
    targetOfferingAmount: 50000,
    nonCompetitiveAmount: 1200,
    whenIssuedYield: 4.5,
    bids: [
      { dealerName: "JPMorgan Securities", bidYield: 4.47, bidAmount: 8000 },
      { dealerName: "Goldman Sachs", bidYield: 4.475, bidAmount: 9000 },
      { dealerName: "Morgan Stanley", bidYield: 4.48, bidAmount: 10000 },
      {
        dealerName: "Citigroup Global Markets",
        bidYield: 4.485,
        bidAmount: 11000,
      },
      { dealerName: "BofA Securities", bidYield: 4.495, bidAmount: 9000 },
      { dealerName: "Barclays Capital", bidYield: 4.495, bidAmount: 8500 },
      {
        dealerName: "Wells Fargo Securities",
        bidYield: 4.495,
        bidAmount: 9500,
      },
      { dealerName: "UBS Securities", bidYield: 4.5, bidAmount: 12000 },
      {
        dealerName: "BNP Paribas Securities",
        bidYield: 4.505,
        bidAmount: 11500,
      },
      {
        dealerName: "Deutsche Bank Securities",
        bidYield: 4.51,
        bidAmount: 13000,
      },
      { dealerName: "Jefferies LLC", bidYield: 4.52, bidAmount: 10500 },
    ],
  },
];

interface DutchAuctionContextType {
  targetOfferingAmount: number;
  setTargetOfferingAmount: (amount: number) => void;
  nonCompetitiveAmount: number;
  setNonCompetitiveAmount: (amount: number) => void;
  whenIssuedYield: number | null;
  setWhenIssuedYield: (yieldVal: number | null) => void;
  availableDealers: string[];
  addDealer: (dealerName: string) => void;
  bids: DealerBid[];
  addBid: (dealerName: string, bidYield: number, bidAmount: number) => void;
  updateBid: (
    id: string,
    field: keyof DealerBid,
    value: string | number,
  ) => void;
  removeBid: (id: string) => void;
  duplicateBid: (id: string) => void;
  clearAllBids: () => void;
  loadPreset: (presetId: string) => void;
  activePresetId: string | null;
  auctionResults: AuctionResults;
  formatCurrency: (amountInMillions: number) => string;
  formatYield: (yieldVal: number) => string;
}

const DutchAuctionContext = createContext<DutchAuctionContextType | undefined>(
  undefined,
);

export const useDutchAuction = () => {
  const context = useContext(DutchAuctionContext);
  if (!context) {
    throw new Error(
      "useDutchAuction must be used within a DutchAuctionProvider",
    );
  }
  return context;
};

interface DutchAuctionProviderProps {
  children: ReactNode;
}

export const DutchAuctionProvider: React.FC<DutchAuctionProviderProps> = ({
  children,
}) => {
  const defaultPreset = PRESET_SCENARIOS[0];

  const [targetOfferingAmount, setTargetOfferingAmount] = useState<number>(
    defaultPreset.targetOfferingAmount,
  );
  const [nonCompetitiveAmount, setNonCompetitiveAmount] = useState<number>(
    defaultPreset.nonCompetitiveAmount,
  );
  const [whenIssuedYield, setWhenIssuedYield] = useState<number | null>(
    defaultPreset.whenIssuedYield,
  );
  const [activePresetId, setActivePresetId] = useState<string | null>(
    defaultPreset.id,
  );

  const [availableDealers, setAvailableDealers] = useState<string[]>([
    ...PRIMARY_DEALER_NAMES,
  ]);

  const [bids, setBids] = useState<DealerBid[]>(() => {
    return defaultPreset.bids.map((b, idx) => ({
      ...b,
      id: `bid_${Date.now()}_${idx}`,
    }));
  });

  const addDealer = useCallback((dealerName: string) => {
    const trimmed = dealerName.trim();
    if (!trimmed) return;
    setAvailableDealers((prev) => {
      if (prev.includes(trimmed)) return prev;
      return [trimmed, ...prev];
    });
  }, []);

  const addBid = useCallback(
    (dealerName: string, bidYield: number, bidAmount: number) => {
      const name = dealerName.trim() || PRIMARY_DEALER_NAMES[0];
      // Ensure dealer is in available list
      setAvailableDealers((prev) =>
        prev.includes(name) ? prev : [name, ...prev],
      );

      const newBid: DealerBid = {
        id: `bid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        dealerName: name,
        bidYield: Math.max(0, bidYield),
        bidAmount: Math.max(0, bidAmount),
      };
      setBids((prev) => [...prev, newBid]);
      setActivePresetId(null);
    },
    [],
  );

  const updateBid = useCallback(
    (id: string, field: keyof DealerBid, value: string | number) => {
      setBids((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          if (field === "bidYield" || field === "bidAmount") {
            const num = typeof value === "string" ? parseFloat(value) : value;
            return { ...b, [field]: isNaN(num) ? 0 : Math.max(0, num) };
          }
          if (field === "dealerName" && typeof value === "string") {
            const trimmed = value.trim();
            if (trimmed) {
              setAvailableDealers((dPrev) =>
                dPrev.includes(trimmed) ? dPrev : [trimmed, ...dPrev],
              );
            }
          }
          return { ...b, [field]: value };
        }),
      );
      setActivePresetId(null);
    },
    [],
  );

  const removeBid = useCallback((id: string) => {
    setBids((prev) => prev.filter((b) => b.id !== id));
    setActivePresetId(null);
  }, []);

  const duplicateBid = useCallback((id: string) => {
    setBids((prev) => {
      const target = prev.find((b) => b.id === id);
      if (!target) return prev;
      const clone: DealerBid = {
        ...target,
        id: `bid_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      };
      return [...prev, clone];
    });
    setActivePresetId(null);
  }, []);

  const clearAllBids = useCallback(() => {
    setBids([]);
    setActivePresetId(null);
  }, []);

  const loadPreset = useCallback((presetId: string) => {
    const preset = PRESET_SCENARIOS.find((p) => p.id === presetId);
    if (!preset) return;

    setTargetOfferingAmount(preset.targetOfferingAmount);
    setNonCompetitiveAmount(preset.nonCompetitiveAmount);
    setWhenIssuedYield(preset.whenIssuedYield);
    setBids(
      preset.bids.map((b, idx) => ({
        ...b,
        id: `bid_${Date.now()}_${idx}`,
      })),
    );
    setActivePresetId(presetId);
  }, []);

  // Format helpers
  const formatCurrency = useCallback((amountInMillions: number): string => {
    if (amountInMillions >= 1000) {
      const inBillions = amountInMillions / 1000;
      return `$${inBillions.toLocaleString("en-US", {
        minimumFractionDigits: inBillions % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 3,
      })}B`;
    }
    return `$${amountInMillions.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}M`;
  }, []);

  const formatYield = useCallback((yieldVal: number): string => {
    return `${yieldVal.toFixed(3)}%`;
  }, []);

  // Core Dutch Auction Matching Engine Calculation
  const auctionResults: AuctionResults = useMemo(() => {
    const competitiveOffering = Math.max(
      0,
      targetOfferingAmount - nonCompetitiveAmount,
    );

    // 1. Sort all bids by yield ascending (lowest yield = best price)
    const validBids = bids.filter((b) => b.bidAmount > 0 && b.bidYield >= 0);
    const sortedBids = [...validBids].sort((a, b) => a.bidYield - b.bidYield);

    const totalTendered = sortedBids.reduce((sum, b) => sum + b.bidAmount, 0);
    const isFullyCovered = totalTendered >= competitiveOffering;

    // Group bids by exact unique yield
    const uniqueYields = Array.from(
      new Set(sortedBids.map((b) => b.bidYield)),
    ).sort((a, b) => a - b);

    const yieldTotals: { [yieldKey: number]: number } = {};
    uniqueYields.forEach((y) => {
      yieldTotals[y] = sortedBids
        .filter((b) => b.bidYield === y)
        .reduce((sum, b) => sum + b.bidAmount, 0);
    });

    let stopOutYield = 0;
    let allotmentAtHighPct = 0;
    let amountAwardedAtHigh = 0;
    let totalBidsAtHigh = 0;
    let cumulativeSum = 0;
    let stopOutFound = false;

    // Map each unique yield to its award percentage
    const yieldAwardRatios: { [yieldKey: number]: number } = {};

    for (let i = 0; i < uniqueYields.length; i++) {
      const y = uniqueYields[i];
      const bidsAtYield = yieldTotals[y];
      const sumBeforeThisYield = cumulativeSum;
      cumulativeSum += bidsAtYield;

      if (!stopOutFound) {
        if (cumulativeSum < competitiveOffering) {
          // All bids at this yield are 100% accepted
          yieldAwardRatios[y] = 1.0;
          stopOutYield = y;
        } else {
          // This yield crosses or exactly meets the offering amount => Stop-Out Yield!
          stopOutYield = y;
          stopOutFound = true;
          totalBidsAtHigh = bidsAtYield;

          const neededAtThisYield = Math.max(
            0,
            competitiveOffering - sumBeforeThisYield,
          );
          const ratio =
            bidsAtYield > 0
              ? Math.min(1.0, neededAtThisYield / bidsAtYield)
              : 0;

          yieldAwardRatios[y] = ratio;
          allotmentAtHighPct = ratio * 100;
          amountAwardedAtHigh = neededAtThisYield;
        }
      } else {
        // Yield is above stop-out => 0% awarded
        yieldAwardRatios[y] = 0.0;
      }
    }

    // If total bids never reached the offering amount, all submitted bids accepted 100%
    if (!stopOutFound) {
      if (uniqueYields.length > 0) {
        stopOutYield = uniqueYields[uniqueYields.length - 1];
      }
      allotmentAtHighPct = 100;
      amountAwardedAtHigh = totalBidsAtHigh;
    }

    // Build Processed Bids with Cumulative Sum & Allotment Status
    let runningCum = 0;
    let totalAccepted = nonCompetitiveAmount;

    const processedBids: ProcessedBid[] = sortedBids.map((bid) => {
      runningCum += bid.bidAmount;
      const ratio = yieldAwardRatios[bid.bidYield] ?? 0;
      const awarded = bid.bidAmount * ratio;
      totalAccepted += awarded;

      let status: "ACCEPTED" | "ALLOTTED_AT_HIGH" | "REJECTED" = "REJECTED";
      if (ratio >= 0.99999) {
        status = "ACCEPTED";
      } else if (ratio > 0) {
        status = "ALLOTTED_AT_HIGH";
      }

      return {
        ...bid,
        cumulativeAmount: runningCum,
        status,
        allotmentPct: ratio * 100,
        awardedAmount: awarded,
        clearingYield: stopOutYield,
      };
    });

    // Compute Low Yield & Median Yield of Accepted Bids
    const acceptedBids = processedBids.filter((b) => b.awardedAmount > 0);
    const lowYield = acceptedBids.length > 0 ? acceptedBids[0].bidYield : 0;

    // Median yield: yield at which 50% of competitive offering is filled
    const halfCompetitive = competitiveOffering / 2;
    let medianSum = 0;
    let medianYield = stopOutYield;
    for (const b of acceptedBids) {
      medianSum += b.awardedAmount;
      if (medianSum >= halfCompetitive) {
        medianYield = b.bidYield;
        break;
      }
    }

    // Bid to Cover Ratio
    const bidToCoverRatio =
      targetOfferingAmount > 0
        ? (totalTendered + nonCompetitiveAmount) / targetOfferingAmount
        : 0;

    // Tail in basis points: Stop-Out Yield minus When-Issued Yield
    const tailBps =
      whenIssuedYield !== null ? (stopOutYield - whenIssuedYield) * 100 : null;

    // Dealer Summaries (aggregated by primary dealer)
    const dealerMap: { [name: string]: DealerSummary } = {};
    processedBids.forEach((b) => {
      if (!dealerMap[b.dealerName]) {
        dealerMap[b.dealerName] = {
          dealerName: b.dealerName,
          totalBidsCount: 0,
          totalBidAmount: 0,
          totalAwardedAmount: 0,
          overallAllotmentPct: 0,
          shareOfAuctionPct: 0,
          averageBidYield: 0,
        };
      }
      const entry = dealerMap[b.dealerName];
      entry.totalBidsCount += 1;
      entry.totalBidAmount += b.bidAmount;
      entry.totalAwardedAmount += b.awardedAmount;
    });

    const dealerSummaries: DealerSummary[] = Object.values(dealerMap)
      .map((entry) => {
        const dealerBids = processedBids.filter(
          (b) => b.dealerName === entry.dealerName,
        );
        const weightedYieldSum = dealerBids.reduce(
          (sum, b) => sum + b.bidYield * b.bidAmount,
          0,
        );
        const avgYield =
          entry.totalBidAmount > 0
            ? weightedYieldSum / entry.totalBidAmount
            : 0;

        return {
          ...entry,
          overallAllotmentPct:
            entry.totalBidAmount > 0
              ? (entry.totalAwardedAmount / entry.totalBidAmount) * 100
              : 0,
          shareOfAuctionPct:
            targetOfferingAmount > 0
              ? (entry.totalAwardedAmount / targetOfferingAmount) * 100
              : 0,
          averageBidYield: avgYield,
        };
      })
      .sort((a, b) => b.totalAwardedAmount - a.totalAwardedAmount);

    return {
      targetOfferingAmount,
      nonCompetitiveAmount,
      competitiveOfferingAmount: competitiveOffering,
      totalTenderedAmount: totalTendered,
      totalAcceptedAmount: totalAccepted,
      bidToCoverRatio,
      stopOutYield,
      lowYield,
      medianYield,
      tailBps,
      allotmentAtHighPct,
      amountAwardedAtHigh,
      totalBidsAtHigh,
      processedBids,
      dealerSummaries,
      isFullyCovered,
    };
  }, [bids, targetOfferingAmount, nonCompetitiveAmount, whenIssuedYield]);

  return (
    <DutchAuctionContext.Provider
      value={{
        targetOfferingAmount,
        setTargetOfferingAmount,
        nonCompetitiveAmount,
        setNonCompetitiveAmount,
        whenIssuedYield,
        setWhenIssuedYield,
        availableDealers,
        addDealer,
        bids,
        addBid,
        updateBid,
        removeBid,
        duplicateBid,
        clearAllBids,
        loadPreset,
        activePresetId,
        auctionResults,
        formatCurrency,
        formatYield,
      }}
    >
      {children}
    </DutchAuctionContext.Provider>
  );
};
