"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Review {
  id: string;
  orderId: string;
  name: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
  productNames: string[];
}

interface ReviewContextType {
  reviews: Review[];
  addReview: (review: Omit<Review, "id" | "date">) => void;
  hasReviewedOrder: (orderId: string) => boolean;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

const initialMockReviews: Review[] = [
  {
    id: "REV-001",
    orderId: "KW-9812-2026",
    name: "Sir Samuel Ndegwa",
    rating: 5,
    comment: "Unmatched procurement speed. The Macallan Sherry Oak is sublime, and the concierge delivery was absolutely flawless. The secure vault confirmation process sets a new bar.",
    date: "2026-06-18",
    productNames: ["Macallan Sherry Oak 18 Years", "Clase Azul Reposado"],
  },
  {
    id: "REV-002",
    orderId: "KW-7291-2026",
    name: "Lady Wanjiku",
    rating: 5,
    comment: "Bespoke service at its finest. Picked up from the Muthaiga Road flagship vault cellar and was thoroughly impressed by the sommelier consultation. Highly recommended!",
    date: "2026-06-12",
    productNames: ["Hennessy VS Cognac"],
  },
  {
    id: "REV-003",
    orderId: "KW-5192-2026",
    name: "Dr. Kiprono",
    rating: 4,
    comment: "Prompt and secure delivery. A stellar addition to my reserve. Truly Nairobi's finest spirits boutique.",
    date: "2026-05-25",
    productNames: ["Don Julio Blanco Tequila"],
  },
];

export function ReviewProvider({ children }: { children: React.ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(initialMockReviews);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const storedReviews = localStorage.getItem("kwest_reviews");
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }
    } catch (error) {
      console.error("Error reading reviews from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  // Save reviews to localStorage when it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem("kwest_reviews", JSON.stringify(reviews));
      } catch (error) {
        console.error("Error saving reviews to localStorage", error);
      }
    }
  }, [reviews, isInitialized]);

  const addReview = (newReview: Omit<Review, "id" | "date">) => {
    const reviewToAdd: Review = {
      ...newReview,
      id: `REV-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
    };
    setReviews((prevReviews) => [reviewToAdd, ...prevReviews]);
  };

  const hasReviewedOrder = (orderId: string) => {
    return reviews.some((r) => r.orderId === orderId);
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        addReview,
        hasReviewedOrder,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
}

export function useReviews() {
  const context = useContext(ReviewContext);
  if (context === undefined) {
    throw new Error("useReviews must be used within a ReviewProvider");
  }
  return context;
}
