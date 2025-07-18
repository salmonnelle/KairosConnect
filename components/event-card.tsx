import React from 'react';
import { motion } from '@/lib/animation';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, ExternalLinkIcon } from 'lucide-react';
// Define Event interface locally to avoid import conflicts
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  url: string | null;
  tags: string[];
  type?: string;
  topic?: string;
  is_featured?: boolean;
  created_at?: string;
  updated_at?: string;
  // Additional fields that may be present
  attendees?: number;
  category?: string;
  price?: string;
  priceAmount?: string;
  speakers?: string;
  bestFor?: string;
  attendeeProfile?: string;
}

interface EventCardProps {
  event: Event;
  index?: number; // For staggered animation
}

const EventCard: React.FC<EventCardProps> = ({ event, index = 0 }) => {
  // Format the date for display with robust error handling
  let formattedDate = 'Date TBD';
  try {
    if (event.date) {
      // Validate date string before parsing
      const dateValue = event.date.trim();
      
      // Check if it's a valid date string
      const timestamp = Date.parse(dateValue);
      if (!isNaN(timestamp)) {
        const dateObj = new Date(timestamp);
        formattedDate = format(dateObj, 'PPP');
      } else {
        console.warn('Invalid date format:', dateValue);
      }
    }
  } catch (error) {
    console.error('Error formatting date:', error, event.date);
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white shadow-md rounded-2xl p-5 border border-gray-100 flex flex-col gap-3 h-full hover:shadow-lg transition-all duration-300"
    >
      {/* Event title */}
      <div className="text-xl font-semibold text-gray-900 line-clamp-2">{event.title}</div>
      
      {/* Location with icon */}
      <div className="flex items-center text-sm text-gray-600">
        <MapPinIcon className="mr-2 h-4 w-4 text-purple-500" />
        <span className="truncate">{event.location}</span>
      </div>
      
      {/* Date with icon */}
      <div className="flex items-center text-sm text-gray-500">
        <CalendarIcon className="mr-2 h-4 w-4 text-purple-500" />
        <span>{formattedDate}</span>
      </div>

      {/* Event tags */}
      <div className="flex flex-wrap gap-2 mt-2 overflow-hidden">
        {/* Type badge */}
        {event.type && (
          <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-medium">
            {event.type}
          </span>
        )}
        
        {/* Topic badge */}
        {event.topic && (
          <span className="bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full font-medium">
            {event.topic}
          </span>
        )}
        
        {/* Featured badge if applicable */}
        {event.is_featured && (
          <span className="bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-medium">
            Featured
          </span>
        )}
        
        {/* Regular tags */}
        {event.tags && event.tags.length > 0 && event.tags.slice(0, 2).map((tag, i) => (
          <span
            key={i}
            className="bg-gray-100 text-xs text-gray-700 px-2.5 py-1 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Action button - pushed to bottom with mt-auto */}
      <div className="mt-auto pt-3">
        <a 
          href={event.url || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full"
        >
          <Button 
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 flex items-center justify-center gap-2"
          >
            View Details
            <ExternalLinkIcon className="h-4 w-4" />
          </Button>
        </a>
      </div>
    </motion.div>
  );
};

export default EventCard;
