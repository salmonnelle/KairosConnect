"use client";

import { useState, useEffect } from "react";
import { Event } from "@/lib/utils/event-filter";
import { format } from "date-fns";
import Link from "next/link";

interface SplitPaneEventsProps {
  events: Event[];
}

export default function SplitPaneEvents({ events }: SplitPaneEventsProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Select first event by default on desktop
  useEffect(() => {
    if (events.length && typeof window !== "undefined" && window.innerWidth >= 1024) {
      setSelectedEvent(events[0]);
    }
  }, [events]);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;

  // Helper to format date
  const formatEventDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return dateStr;
    }
  };

  if (!events.length) {
    return <p className="text-center text-gray-400">No events to display.</p>;
  }

  // Mobile fallback – list only; tap navigates to dedicated event page
  if (isMobile) {
    return (
      <div className="space-y-3">
        {events.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`}>
            <div className="cursor-pointer rounded-lg p-4 bg-[#1A1A2B] hover:bg-[#23233D] transition-all">
              <h4 className="text-base font-semibold text-white mb-1 line-clamp-1">{event.title}</h4>
              <p className="text-xs text-gray-400 truncate">{event.location}</p>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  // Desktop split-pane
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[80vh]">
      {/* Left: list */}
      <div className="col-span-1 overflow-y-auto border-r border-gray-800 p-3 pr-1">
        {events.map((event) => {
          const isActive = selectedEvent?.id === event.id;
          return (
            <div
              key={event.id}
              className={`cursor-pointer rounded-lg p-4 mb-2 bg-[#1A1A2B] hover:bg-[#23233D] transition-all ${
                isActive ? "ring-2 ring-violet-500" : ""
              }`}
              onClick={() => setSelectedEvent(event)}
            >
              <h4 className="text-sm font-semibold text-white mb-0.5 line-clamp-1">{event.title}</h4>
              <p className="text-xs text-gray-400 truncate">{event.location}</p>
              <p className="text-xs text-gray-500 mt-0.5">{formatEventDate(event.date)}</p>
            </div>
          );
        })}
      </div>

      {/* Right: detail */}
      <div className="col-span-2 overflow-y-auto bg-[#1C1B29] p-6 rounded-lg shadow-inner">
        {selectedEvent ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1 line-clamp-2">
                  {selectedEvent.title}
                </h2>
                {selectedEvent.topic && (
                  <p className="text-sm text-gray-400">{selectedEvent.topic}</p>
                )}
              </div>
              {selectedEvent.url ? (
                <a
                  href={selectedEvent.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 rounded-md text-white shadow-md hover:opacity-90 transition inline-block text-center"
                >
                  Register Now
                </a>
              ) : (
                <Link
                  href={`/event/${selectedEvent.id}/register`}
                  prefetch={false}
                  className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-blue-500 rounded-md text-white shadow-md hover:opacity-90 transition inline-block text-center"
                >
                  Register Now
                </Link>
              )}
            </div>

            {/* Metadata */}
            <div className="grid sm:grid-cols-3 gap-6 mt-4 text-sm">
              <div className="space-y-1">
                <span className="block text-sm font-semibold text-violet-300 mb-1">📅 Date</span>
                <p className="font-semibold">{formatEventDate(selectedEvent.date)}</p>
              </div>
              <div className="space-y-1">
                <span className="block text-sm font-semibold text-violet-300 mb-1">📍 Location</span>
                <p className="font-semibold">{selectedEvent.location}</p>
              </div>
              <div className="space-y-1">
                <span className="block text-sm font-semibold text-violet-300 mb-1">🗂️ Type</span>
                <p className="font-medium leading-snug text-gray-200 capitalize">{selectedEvent.type}</p>
              </div>
            </div>

            {/* Description */}
            <section className="mt-6 space-y-2">
              <h3 className="text-md font-semibold text-white flex items-center gap-2">📌 About This Event</h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {selectedEvent.description}
              </p>
            </section>

            {/* Tags */}
            {selectedEvent.tags && selectedEvent.tags.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-400">🏷️ Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedEvent.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-violet-900/40 text-violet-200 px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap truncate max-w-[160px]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500 italic h-full flex items-center justify-center">
            Select an event to view its details.
          </div>
        )}
      </div>
    </div>
  );
}
