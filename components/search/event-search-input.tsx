"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { liveSearchEvents } from "@/lib/utils/event-filter";
import { SearchResultsDropdown } from "./search-results-dropdown";
import { Event } from "@/lib/utils/event-filter";
import { AnimatePresence } from "@/lib/animation";
import { Search } from "lucide-react";

// Debounce function to limit API calls
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function EventSearchInput() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Debounce search query to avoid excessive API calls
  const debouncedQuery = useDebounce(query, 300);

  // Fetch search results when debounced query changes
  const fetchResults = useCallback(async () => {
    if (debouncedQuery.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await liveSearchEvents({
        query: debouncedQuery,
        limit: 5 // Show top 5 results in dropdown
      });
      
      setResults(searchResults);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error searching events:", error);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.trim().length > 0) {
      setIsLoading(true);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  // Handle view all results
  const handleViewAll = () => {
    // Navigate to search results page with query
    router.push(`/search?q=${encodeURIComponent(query)}`);
    setShowDropdown(false);
  };

  // Handle register for event
  const handleRegister = (eventId: number) => {
    // Navigate to event registration page
    router.push(`/event/${eventId}/register`);
    setShowDropdown(false);
  };

  // Close dropdown
  const handleCloseDropdown = () => {
    setShowDropdown(false);
  };

  // Handle focus on input
  const handleFocus = () => {
    if (query.trim().length > 0 && results.length > 0) {
      setShowDropdown(true);
    }
  };

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search events, topics, or locations..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-purple-500 dark:bg-gray-800"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <SearchResultsDropdown
            results={results}
            query={query}
            isLoading={isLoading}
            onViewAll={handleViewAll}
            onRegister={handleRegister}
            onClose={handleCloseDropdown}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
