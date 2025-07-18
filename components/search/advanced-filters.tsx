"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/lib/animation";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";

interface AdvancedFiltersProps {
  selectedType: string;
  selectedTopic: string;
  onTypeChange: (type: string) => void;
  onTopicChange: (topic: string) => void;
  onClearFilters: () => void;
  showAdvancedFilters: boolean;
  toggleAdvancedFilters: () => void;
}

export function AdvancedFilters({
  selectedType,
  selectedTopic,
  onTypeChange,
  onTopicChange,
  onClearFilters,
  showAdvancedFilters,
  toggleAdvancedFilters
}: AdvancedFiltersProps) {
  const eventTypes = ["All Types", "Workshop", "Conference", "Meetup", "Webinar", "Hackathon"];
  const topics = ["Topic", "AI", "Blockchain", "Web3", "Design", "Product", "Marketing"];

  return (
    <div className="w-full mt-6">
      <div className="flex items-center justify-between mb-4">
        <Button 
          onClick={toggleAdvancedFilters}
          variant="ghost" 
          className="text-white/80 hover:text-white flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
        >
          <Filter size={16} />
          Advanced Filters
          {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </Button>
        
        {(selectedType !== "All Types" || selectedTopic !== "Topic") && (
          <Button 
            onClick={onClearFilters}
            variant="ghost" 
            className="text-white/80 hover:text-white flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
          >
            <X size={16} />
            Clear Filters
          </Button>
        )}
      </div>
      
      {showAdvancedFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-6 border border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-white/80 mb-3 text-sm font-medium">Event Type</h3>
              <div className="flex flex-wrap gap-2">
                {eventTypes.map((eventType) => (
                  <Badge
                    key={eventType}
                    onClick={() => onTypeChange(eventType)}
                    className={`cursor-pointer px-3 py-1.5 rounded-xl text-sm ${
                      selectedType === eventType
                        ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white"
                        : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
                    }`}
                  >
                    {eventType}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white/80 mb-3 text-sm font-medium">Topic</h3>
              <div className="flex flex-wrap gap-2">
                {topics.map((topic) => (
                  <Badge
                    key={topic}
                    onClick={() => onTopicChange(topic)}
                    className={`cursor-pointer px-3 py-1.5 rounded-xl text-sm ${
                      selectedTopic === topic
                        ? "bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white"
                        : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
                    }`}
                  >
                    {topic}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
