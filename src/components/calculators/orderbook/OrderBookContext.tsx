import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

export interface Order {
  id: string;
  side: "BUY" | "SELL";
  type: "LIMIT" | "MARKET";
  price: number;
  qty: number;
  remainingQty: number;
  traderName: string;
  timestamp: Date;
  timeInForce?: "GTC" | "IOC" | "FOK";
}

export interface Trade {
  id: string;
  price: number;
  qty: number;
  aggressor: "BUY" | "SELL";
  buyer: string;
  seller: string;
  timestamp: Date;
}

export interface PricePoint {
  timestamp: string;
  timeLabel: string;
  price: number;
  volume: number;
}

interface OrderBookContextType {
  bids: Order[];
  asks: Order[];
  trades: Trade[];
  priceHistory: PricePoint[];
  lastTradedPrice: number | null;
  referencePrice: number;
  highPrice: number | null;
  lowPrice: number | null;
  totalVolume: number;
  placeOrder: (order: {
    side: "BUY" | "SELL";
    type: "LIMIT" | "MARKET";
    price: number;
    qty: number;
    traderName?: string;
    timeInForce?: "GTC" | "IOC" | "FOK";
  }) => {
    matched: boolean;
    filledQty: number;
    avgPrice: number;
    remainingQty: number;
  };
  cancelOrder: (orderId: string) => void;
  cancelAllOrders: () => void;
  clearBook: () => void;
  resetBook: () => void;
}

const OrderBookContext = createContext<OrderBookContextType | undefined>(
  undefined,
);

const INITIAL_BASE_PRICE = 100.0;

const DEFAULT_INITIAL_BIDS = [
  { price: 99.9, qty: 100 },
  { price: 99.8, qty: 250 },
  { price: 99.7, qty: 400 },
  { price: 99.6, qty: 600 },
];

const DEFAULT_INITIAL_ASKS = [
  { price: 100.0, qty: 120 },
  { price: 100.1, qty: 300 },
  { price: 100.2, qty: 450 },
  { price: 100.3, qty: 700 },
];

export const OrderBookProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [priceHistory, setPriceHistory] = useState<PricePoint[]>([]);
  const [lastTradedPrice, setLastTradedPrice] = useState<number | null>(
    INITIAL_BASE_PRICE,
  );
  const [referencePrice] = useState<number>(INITIAL_BASE_PRICE);
  const [highPrice, setHighPrice] = useState<number | null>(INITIAL_BASE_PRICE);
  const [lowPrice, setLowPrice] = useState<number | null>(INITIAL_BASE_PRICE);
  const [totalVolume, setTotalVolume] = useState<number>(0);

  const orderIdCounterRef = useRef<number>(1);
  const tradeIdCounterRef = useRef<number>(1);

  // Initialize or Reset to default simple state
  const resetBook = useCallback(() => {
    setLastTradedPrice(INITIAL_BASE_PRICE);
    setHighPrice(INITIAL_BASE_PRICE);
    setLowPrice(INITIAL_BASE_PRICE);
    setTotalVolume(0);
    setTrades([]);

    const now = new Date();

    const newBids: Order[] = DEFAULT_INITIAL_BIDS.map((b, idx) => ({
      id: `bid_${idx + 1}`,
      side: "BUY",
      type: "LIMIT",
      price: b.price,
      qty: b.qty,
      remainingQty: b.qty,
      traderName: `Trader_B${idx + 1}`,
      timestamp: new Date(now.getTime() - (10 - idx) * 1000),
      timeInForce: "GTC",
    }));

    const newAsks: Order[] = DEFAULT_INITIAL_ASKS.map((a, idx) => ({
      id: `ask_${idx + 1}`,
      side: "SELL",
      type: "LIMIT",
      price: a.price,
      qty: a.qty,
      remainingQty: a.qty,
      traderName: `Trader_A${idx + 1}`,
      timestamp: new Date(now.getTime() - (10 - idx) * 1000),
      timeInForce: "GTC",
    }));

    newBids.sort(
      (a, b) =>
        b.price - a.price || a.timestamp.getTime() - b.timestamp.getTime(),
    );
    newAsks.sort(
      (a, b) =>
        a.price - b.price || a.timestamp.getTime() - b.timestamp.getTime(),
    );

    setBids(newBids);
    setAsks(newAsks);

    const initialHistoryPoint: PricePoint = {
      timestamp: now.toISOString(),
      timeLabel: now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      price: INITIAL_BASE_PRICE,
      volume: 0,
    };
    setPriceHistory([initialHistoryPoint]);
  }, []);

  React.useEffect(() => {
    resetBook();
  }, [resetBook]);

  // Matching Engine Implementation
  const placeOrder = useCallback(
    (inputOrder: {
      side: "BUY" | "SELL";
      type: "LIMIT" | "MARKET";
      price: number;
      qty: number;
      traderName?: string;
      timeInForce?: "GTC" | "IOC" | "FOK";
    }) => {
      const trader = inputOrder.traderName || "User";
      const tif = inputOrder.timeInForce || "GTC";
      const now = new Date();
      const newOrderId = `order_${orderIdCounterRef.current++}`;

      let remainingToFill = inputOrder.qty;
      let filledQty = 0;
      let totalCost = 0;

      const newTrades: Trade[] = [];

      setBids((prevBids) => {
        setAsks((prevAsks) => {
          let currentBids = [...prevBids];
          let currentAsks = [...prevAsks];

          if (inputOrder.side === "BUY") {
            if (tif === "FOK") {
              let availableQty = 0;
              for (const ask of currentAsks) {
                if (
                  inputOrder.type === "MARKET" ||
                  ask.price <= inputOrder.price
                ) {
                  availableQty += ask.remainingQty;
                }
              }
              if (availableQty < inputOrder.qty) {
                return currentAsks;
              }
            }

            const remainingAsks: Order[] = [];
            for (const ask of currentAsks) {
              const matchesPrice =
                inputOrder.type === "MARKET" || inputOrder.price >= ask.price;

              if (matchesPrice && remainingToFill > 0) {
                const matchQty = Math.min(remainingToFill, ask.remainingQty);
                remainingToFill -= matchQty;
                filledQty += matchQty;
                totalCost += matchQty * ask.price;

                newTrades.push({
                  id: `trade_${tradeIdCounterRef.current++}`,
                  price: ask.price,
                  qty: matchQty,
                  aggressor: "BUY",
                  buyer: trader,
                  seller: ask.traderName,
                  timestamp: now,
                });

                if (ask.remainingQty > matchQty) {
                  remainingAsks.push({
                    ...ask,
                    remainingQty: ask.remainingQty - matchQty,
                  });
                }
              } else {
                remainingAsks.push(ask);
              }
            }
            currentAsks = remainingAsks;

            if (
              remainingToFill > 0 &&
              inputOrder.type === "LIMIT" &&
              tif === "GTC"
            ) {
              const newBidOrder: Order = {
                id: newOrderId,
                side: "BUY",
                type: "LIMIT",
                price: inputOrder.price,
                qty: inputOrder.qty,
                remainingQty: remainingToFill,
                traderName: trader,
                timestamp: now,
                timeInForce: tif,
              };
              currentBids.push(newBidOrder);
              currentBids.sort(
                (a, b) =>
                  b.price - a.price ||
                  a.timestamp.getTime() - b.timestamp.getTime(),
              );
            }
          } else {
            if (tif === "FOK") {
              let availableQty = 0;
              for (const bid of currentBids) {
                if (
                  inputOrder.type === "MARKET" ||
                  bid.price >= inputOrder.price
                ) {
                  availableQty += bid.remainingQty;
                }
              }
              if (availableQty < inputOrder.qty) {
                return currentAsks;
              }
            }

            const remainingBids: Order[] = [];
            for (const bid of currentBids) {
              const matchesPrice =
                inputOrder.type === "MARKET" || inputOrder.price <= bid.price;

              if (matchesPrice && remainingToFill > 0) {
                const matchQty = Math.min(remainingToFill, bid.remainingQty);
                remainingToFill -= matchQty;
                filledQty += matchQty;
                totalCost += matchQty * bid.price;

                newTrades.push({
                  id: `trade_${tradeIdCounterRef.current++}`,
                  price: bid.price,
                  qty: matchQty,
                  aggressor: "SELL",
                  buyer: bid.traderName,
                  seller: trader,
                  timestamp: now,
                });

                if (bid.remainingQty > matchQty) {
                  remainingBids.push({
                    ...bid,
                    remainingQty: bid.remainingQty - matchQty,
                  });
                }
              } else {
                remainingBids.push(bid);
              }
            }
            currentBids = remainingBids;

            if (
              remainingToFill > 0 &&
              inputOrder.type === "LIMIT" &&
              tif === "GTC"
            ) {
              const newAskOrder: Order = {
                id: newOrderId,
                side: "SELL",
                type: "LIMIT",
                price: inputOrder.price,
                qty: inputOrder.qty,
                remainingQty: remainingToFill,
                traderName: trader,
                timestamp: now,
                timeInForce: tif,
              };
              currentAsks.push(newAskOrder);
              currentAsks.sort(
                (a, b) =>
                  a.price - b.price ||
                  a.timestamp.getTime() - b.timestamp.getTime(),
              );
            }
          }

          if (newTrades.length > 0) {
            const lastTrade = newTrades[newTrades.length - 1];
            const ltp = lastTrade.price;
            setLastTradedPrice(ltp);
            setHighPrice((prev) => (prev === null ? ltp : Math.max(prev, ltp)));
            setLowPrice((prev) => (prev === null ? ltp : Math.min(prev, ltp)));
            setTotalVolume((prev) => prev + filledQty);

            setTrades((prevTrades) =>
              [...newTrades.reverse(), ...prevTrades].slice(0, 100),
            );

            setPriceHistory((prevHist) => [
              ...prevHist,
              {
                timestamp: now.toISOString(),
                timeLabel: now.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
                price: ltp,
                volume: filledQty,
              },
            ]);
          }

          setBids(currentBids);
          return currentAsks;
        });

        return prevBids;
      });

      const avgPrice = filledQty > 0 ? totalCost / filledQty : 0;
      return {
        matched: filledQty > 0,
        filledQty,
        avgPrice: Number(avgPrice.toFixed(2)),
        remainingQty: remainingToFill,
      };
    },
    [],
  );

  const cancelOrder = useCallback((orderId: string) => {
    setBids((prev) => prev.filter((o) => o.id !== orderId));
    setAsks((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const cancelAllOrders = useCallback(() => {
    setBids([]);
    setAsks([]);
  }, []);

  const clearBook = useCallback(() => {
    setBids([]);
    setAsks([]);
    setTrades([]);
    setLastTradedPrice(null);
    setHighPrice(null);
    setLowPrice(null);
    setTotalVolume(0);
    setPriceHistory([]);
  }, []);

  return (
    <OrderBookContext.Provider
      value={{
        bids,
        asks,
        trades,
        priceHistory,
        lastTradedPrice,
        referencePrice,
        highPrice,
        lowPrice,
        totalVolume,
        placeOrder,
        cancelOrder,
        cancelAllOrders,
        clearBook,
        resetBook,
      }}
    >
      {children}
    </OrderBookContext.Provider>
  );
};

export const useOrderBook = () => {
  const context = useContext(OrderBookContext);
  if (!context) {
    throw new Error("useOrderBook must be used within an OrderBookProvider");
  }
  return context;
};
