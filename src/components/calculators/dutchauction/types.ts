export interface DealerBid {
  id: string;
  dealerName: string;
  bidYield: number; // e.g. 4.250 for 4.250%
  bidAmount: number; // in Millions of USD
}

export type BidStatus = "ACCEPTED" | "ALLOTTED_AT_HIGH" | "REJECTED";

export interface ProcessedBid extends DealerBid {
  cumulativeAmount: number;
  status: BidStatus;
  allotmentPct: number; // 0 to 100
  awardedAmount: number; // in Millions of USD
  clearingYield: number; // Stop-out yield awarded
}

export interface DealerSummary {
  dealerName: string;
  totalBidsCount: number;
  totalBidAmount: number;
  totalAwardedAmount: number;
  overallAllotmentPct: number;
  shareOfAuctionPct: number;
  averageBidYield: number;
}

export interface AuctionResults {
  targetOfferingAmount: number; // Target total
  nonCompetitiveAmount: number; // Non-competitive accepted in full
  competitiveOfferingAmount: number; // Net available for competitive
  totalTenderedAmount: number; // Total competitive bids submitted
  totalAcceptedAmount: number; // Total awarded
  bidToCoverRatio: number; // Total Tendered / Target Offering
  stopOutYield: number; // High clearing yield (%)
  lowYield: number; // Lowest accepted bid yield (%)
  medianYield: number; // Median accepted bid yield (%)
  tailBps: number | null; // Stop-out yield minus WI yield in basis points
  allotmentAtHighPct: number; // Pro-rata award % at the stop-out yield (0 to 100)
  amountAwardedAtHigh: number; // Millions USD awarded at stop-out yield
  totalBidsAtHigh: number; // Millions USD bid at stop-out yield
  processedBids: ProcessedBid[];
  dealerSummaries: DealerSummary[];
  isFullyCovered: boolean;
}

export interface PresetScenario {
  id: string;
  name: string;
  description: string;
  targetOfferingAmount: number;
  nonCompetitiveAmount: number;
  whenIssuedYield: number;
  bids: Omit<DealerBid, "id">[];
}

export const PRIMARY_DEALER_NAMES = [
  "JPMorgan Securities",
  "Goldman Sachs",
  "Morgan Stanley",
  "BofA Securities",
  "Citigroup Global Markets",
  "Barclays Capital",
  "Wells Fargo Securities",
  "BNP Paribas Securities",
  "UBS Securities",
  "Deutsche Bank Securities",
  "Cantor Fitzgerald",
  "Nomura Securities",
  "Jefferies LLC",
  "Mizuho Securities",
  "RBC Capital Markets",
  "TD Securities",
  "HSBC Securities",
  "Santander US Capital Markets",
];
