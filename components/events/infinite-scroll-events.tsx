"use client";

import { useRef } from "react";
import { PremiumEventCard } from "@/components/search/premium-event-card";
import { Event } from "@/lib/utils/event-filter";

interface InfiniteScrollEventsProps {
  events: Event[];
  className?: string;
}

export default function InfiniteScrollEvents({ events, className = "" }: InfiniteScrollEventsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Ensure we have enough events to scroll through by duplicating if needed
  // Add unique identifiers to duplicated events to avoid key conflicts
  const displayEvents = events.length >= 4 
    ? events 
    : [
        ...events,
        ...events.map((e, dupIdx) => ({ ...e, _dup: 1, keyId: `${e.id}-d1-${dupIdx}` })),
        ...events.map((e, dupIdx) => ({ ...e, _dup: 2, keyId: `${e.id}-d2-${dupIdx}` }))
      ];

  return (
    <div 
      className={`relative ${className} max-w-[1200px] mx-auto`}
    >
      {/* Horizontal gradient overlays for smooth fade effect */}
      <div className="absolute top-0 bottom-0 left-0 w-20 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute top-0 bottom-0 right-0 w-20 bg-gradient-to-l from-black/80 via-black/40 to-transparent z-10 pointer-events-none"></div>
      
      {/* Horizontally Scrollable Event List */}
      <div 
        ref={scrollRef} 
        className="overflow-x-auto whitespace-nowrap scroll-smooth hide-scrollbar py-4 bg-transparent"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', height: 'auto' }}
      >
        {/* First set of events */}
        <div className="inline-flex space-x-6 px-4">
          {displayEvents.map((event, eventIdx) => (
            <div 
              key={`original-${event.id}-${eventIdx}`}
              className="animate-fade-in inline-block w-[350px]"
            >
              <PremiumEventCard 
                event={event}
                index={eventIdx}
              />
            </div>
          ))}
        </div>
        
        {/* Duplicate content for infinite illusion */}
        <div className="inline-flex space-x-6 px-4">
          {displayEvents.map((event, eventIdx) => (
            <div
              key={`duplicate-${event.id}-${eventIdx}`}
              className="inline-block w-[350px]"
            >
              <PremiumEventCard 
                event={event}
                index={eventIdx}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Control buttons removed */}
      
      {/* Hover indicator removed */}
    </div>
  );
}
