import React, { createContext, useContext, useState, ReactNode, useMemo } from "react";

interface RatingsBasedPredictorContextType {
  averageRating: number;
  setAverageRating: (val: number) => void;
  numRatings: number;
  setNumRatings: (val: number) => void;
  trueRating: number;
}

const RatingsBasedPredictorContext = createContext<RatingsBasedPredictorContextType | undefined>(undefined);

export const RatingsBasedPredictorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [averageRating, setAverageRating] = useState<number>(4);
  const [numRatings, setNumRatings] = useState<number>(10);

  const trueRating = useMemo(() => {
    // Formula: (n * R + 15) / (n + 5)
    // 15 comes from adding 1, 2, 3, 4, 5 (1 rating of each star)
    return (numRatings * averageRating + 15) / (numRatings + 5);
  }, [averageRating, numRatings]);

  return (
    <RatingsBasedPredictorContext.Provider
      value={{
        averageRating,
        setAverageRating,
        numRatings,
        setNumRatings,
        trueRating,
      }}
    >
      {children}
    </RatingsBasedPredictorContext.Provider>
  );
};

export const useRatingsBasedPredictor = () => {
  const context = useContext(RatingsBasedPredictorContext);
  if (!context) {
    throw new Error("useRatingsBasedPredictor must be used within a RatingsBasedPredictorProvider");
  }
  return context;
};
