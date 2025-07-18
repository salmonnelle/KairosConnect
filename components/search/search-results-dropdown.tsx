"use client";

import { useState, useEffect, useRef } from "react";
import { Event } from "@/lib/utils/event-filter";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/lib/animation";

interface SearchResultsDropdownProps {
  results: Event[];
  query: string;
  isLoading: boolean;
  onViewAll: () => void;
  onRegister: (eventId: number) => void;
  onClose: () => void;
}

export function SearchResultsDropdown({
  results,
  query,
  isLoading,
  onViewAll,
  onRegister,
  onClose,
}: SearchResultsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  // Highlight matching text in a string
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    
    return (
      <>
        {parts.map((part, index) => 
          part.toLowerCase() === query.toLowerCase() ? 
            <span key={index} className="font-bold bg-purple-100/20">{part}</span> : 
            part
        )}
      </>
    );
  };

  // Format date to readable format
  const formatEventDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  if (results.length === 0 && !isLoading) {
    return null;
  }

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="absolute z-50 w-full md:max-w-2xl mx-auto left-0 right-0 bg-white/10 dark:bg-gray-900/10 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-xl shadow-xl mt-2 overflow-hidden transition-all duration-300 ease-in-out"
    >
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-transparent">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse flex justify-center items-center space-x-2">
              <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce delay-150"></div>
              <div className="h-3 w-3 bg-purple-400 rounded-full animate-bounce delay-300"></div>
            </div>
            <p className="mt-3 text-white/70 text-sm">Searching events...</p>
          </div>
        ) : (
          <>
            {results.map((event) => (
              <motion.div 
                key={event.id} 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-4 border-b border-white/5 hover:bg-white/5 dark:hover:bg-white/5 transition-all duration-200 group"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-white group-hover:text-purple-200 transition-colors duration-200">
                      {highlightMatch(event.title, query)}
                    </h4>
                    <div className="flex items-center text-sm text-white/70 mt-1">
                      <svg className="w-4 h-4 mr-1 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {highlightMatch(event.location, query)}
                    </div>
                    <div className="flex items-center text-sm text-white/70 mt-1">
                      <svg className="w-4 h-4 mr-1 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatEventDate(event.date)}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {event.tags && event.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="bg-white/10 text-purple-200 border-purple-300/30 hover:bg-white/20 transition-colors duration-200">
                          {highlightMatch(tag, query)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onRegister(event.id)}
                    className="sm:ml-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white transform transition-transform duration-200 hover:scale-105 shadow-lg hover:shadow-purple-500/25 w-full sm:w-auto"
                  >
                    Register
                  </Button>
                </div>
              </motion.div>
            ))}
          </>
        )}
      </div>
      
      {results.length > 0 && !isLoading && (
        <div className="p-4 border-t border-white/10">
          <Button 
            onClick={onViewAll} 
            variant="outline" 
            className="w-full bg-white/5 hover:bg-white/10 border-purple-300/30 text-white hover:text-purple-200 transition-all duration-300 group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              View All Results
              <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-blue-500/20 transform scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"></span>
          </Button>
        </div>
      )}
    </motion.div>
  );
}
