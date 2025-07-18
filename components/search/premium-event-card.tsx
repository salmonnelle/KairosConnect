"use client";

import { useEffect, useState } from "react";
import { Event } from "@/lib/utils/event-filter";
import { format } from "date-fns";
import Link from "next/link";
import { Calendar, MapPin, Users, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PremiumEventCardProps {
  event: Event;
  searchQuery?: string;
  index: number;
}

export function PremiumEventCard({ event, searchQuery, index }: PremiumEventCardProps) {
  const isFeatured = event.is_featured;
  let formattedDate = "TBA";
  if (event.date) {
    const parsed = new Date(event.date);
    if (!isNaN(parsed.getTime())) {
      formattedDate = format(parsed, "MMM d, yyyy");
    }
  }
  const attendees = Math.floor(Math.random() * 150) + 50; // Random number for demo purposes

  // Native fade-in + slide on mount
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100 + index * 50);
    return () => clearTimeout(timeout);
  }, [index]);

  return (
    <div
      className={`group relative transition-transform duration-500 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      } hover:scale-[1.03] hover:shadow-lg`}
    >
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-emerald-600/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
      
      <Link href={`/event/${event.id}`} className="block relative">
        <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full overflow-hidden transition-all duration-300 group-hover:bg-black/50 group-hover:border-white/20 group-hover:shadow-lg group-hover:shadow-purple-500/10">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-emerald-900/10 opacity-30"></div>
          
          {/* Mesh gradient accent */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            {/* Featured badge */}
            {isFeatured && (
              <div className="absolute -top-2 -right-2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Star size={12} className="fill-white" />
                  Featured
                </Badge>
              </div>
            )}
            
            {/* Event type */}
            <Badge className="bg-white/10 text-white/90 mb-3 px-2.5 py-1 text-xs rounded-lg">
              {event.type}
            </Badge>
            
            {/* Title with gradient hover effect */}
            <h3 className="text-xl font-semibold mb-2 text-white tracking-tight transition-all duration-300 bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-emerald-400">
              {event.title}
            </h3>
            
            {/* Description */}
            <p className="text-white/70 text-sm mb-4 line-clamp-2">
              {event.description}
            </p>
            
            {/* Meta info */}
            <div className="flex flex-col gap-2 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{formattedDate}</span>
              </div>
              
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  <span>{event.location}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <Users size={14} />
                <span>{attendees} attending</span>
              </div>
            </div>
            
            {/* Tags */}
            {event.tags && event.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {event.tags.slice(0, 3).map((tag, i) => (
                  <Badge 
                    key={i} 
                    className="bg-white/5 hover:bg-white/10 text-white/80 text-xs px-2 py-0.5 rounded-lg whitespace-nowrap truncate max-w-[120px]"
                  >
                    {tag}
                  </Badge>
                ))}
                {event.tags.length > 3 && (
                  <Badge className="bg-white/5 text-white/80 text-xs px-2 py-0.5 rounded-lg whitespace-nowrap">
                    +{event.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
