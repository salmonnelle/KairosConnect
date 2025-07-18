"use client";

import { PremiumSearchPage } from "./premium-page";

interface PremiumSearchPageWrapperProps {
  searchParams: { 
    [key: string]: string | string[] | undefined 
  };
}

// Client component wrapper that receives searchParams from server component
export default function PremiumSearchPageWrapper({ searchParams }: PremiumSearchPageWrapperProps) {
  // Extract search parameters
  const q = typeof searchParams.q === 'string' ? searchParams.q : '';
  const type = typeof searchParams.type === 'string' ? searchParams.type : '';
  const location = typeof searchParams.location === 'string' ? searchParams.location : '';
  const date = typeof searchParams.date === 'string' ? searchParams.date : '';
  
  // Pass extracted parameters to the PremiumSearchPage component
  return (
    <PremiumSearchPage 
      query={q}
      type={type}
      location={location}
      date={date}
    />
  );
}
