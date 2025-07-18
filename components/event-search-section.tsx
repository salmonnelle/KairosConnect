"use client";

import { useState, useEffect } from "react";
// Import from our custom animation library
import { motion, AnimatePresence } from "@/lib/animation";
import { EventSearchForm } from "./event-search-form";
import EventCard from "./event-card";

// Define the event interface based on our Supabase table
export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  type: string;
  topic: string;
  date: string;
  url: string | null;
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// Define the search parameters interface
export interface EventSearchParams {
  keyword?: string;
  type?: string;
  topic?: string;
  startDate?: Date;
  endDate?: Date;
}

export function EventSearchSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Load initial events on component mount
  useEffect(() => {
    const loadInitialEvents = async () => {
      setIsLoading(true);
      try {
        // Fetch upcoming events from our server-side API route
        const response = await fetch('/api/events');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Successfully loaded events:", data.events ? data.events.length : 0);
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error loading initial events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialEvents();
  }, []);

  // Handle search form submission
  const handleSearch = async (params: EventSearchParams) => {
    setIsLoading(true);
    setHasSearched(true);
    
    try {
      // Build URL with search parameters
      const searchParams = new URLSearchParams();
      
      // Add parameters to URL search params
      if (params.keyword && params.keyword.trim() !== "") {
        searchParams.append('keyword', params.keyword.trim());
      }
      
      if (params.type && params.type !== "any") {
        searchParams.append('type', params.type);
      }
      
      if (params.topic && params.topic !== "any") {
        searchParams.append('topic', params.topic);
      }
      
      if (params.startDate) {
        searchParams.append('startDate', params.startDate.toISOString().split('T')[0]);
      }
      
      if (params.endDate) {
        searchParams.append('endDate', params.endDate.toISOString().split('T')[0]);
      }
      
      // Fetch from our server-side API route
      const response = await fetch(`/api/events?${searchParams.toString()}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched events:', data);
      
      // Extract events from the response structure
      setEvents(data.events || []);
      console.log('Successfully loaded events:', data.events ? data.events.length : 0);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative py-8 md:py-12">
      <motion.div 
        className="container mx-auto max-w-7xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold mb-4 text-center text-white tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          Find Events That Match Your Interests
        </motion.h2>
        
        <motion.p 
          className="text-lg text-center text-white/70 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          Filter by keyword, type, topic, or date to discover your perfect event
        </motion.p>
        
        {/* Search Form with glass effect */}
        <motion.div 
          className="mb-12 p-6 md:p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg shadow-black/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Event search filters</legend>
            <EventSearchForm onSearch={handleSearch} isLoading={isLoading} />
          </fieldset>
        </motion.div>
        
        {/* Search Results */}
        <AnimatePresence>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            </div>
          ) : hasSearched && events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center py-12"
            >
              <p className="text-xl">No events found. Try adjusting your search criteria.</p>
            </motion.div>
          ) : events.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {events.map((event, index) => (
                <EventCard 
                  key={event.id} 
                  event={event} 
                  index={index} 
                />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
