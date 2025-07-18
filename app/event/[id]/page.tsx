"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Event } from "@/lib/utils/event-filter";
import { loadCsvEvents, RawEventRecord } from "@/lib/loadCsvEvents";
import { CSV_SOURCES } from "@/lib/csvSources";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";

import { format } from "date-fns";
import Link from "next/link";


export default function EventPage() {
  const params = useParams();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) {
        setIsLoading(false);
        setError("Event ID is missing");
        return;
      }

      setIsLoading(true);
      try {
        // Optionally fetch from Supabase first
        const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
        if (USE_SUPABASE) {
          const numericId = Number(eventId);
          const idValue: string | number = isNaN(numericId) ? eventId : numericId;
          try {
            const { data: supaData } = await (await import("@/lib/supabaseClient")).supabase
              .from("events")
              .select("*")
              .eq("id", idValue)
              .maybeSingle();
            if (supaData) {
              setEvent(supaData as unknown as Event);
              return; // done
            }
          } catch (supaErr) {
            console.warn('[SUPABASE] query error, falling back to CSV', supaErr);
          }
        }

        // CSV fallback
        const rawRecords = await loadCsvEvents(CSV_SOURCES);

        const mappedEvents: Event[] = rawRecords.map((record: RawEventRecord, idx: number) => {
          const getField = (...keys: string[]): string => {
            for (const key of keys) {
              if (record[key] && record[key].trim()) return record[key].trim();
            }
            return "";
          };

          const rawIdStr = (record.id ?? record.ID ?? record["Event ID"] ?? record["event_id"]) as string | undefined;
          let eventIdNum: number;
          const parsedId = rawIdStr ? parseInt(rawIdStr) : NaN;
          if (!isNaN(parsedId) && parsedId > 0) {
            eventIdNum = parsedId;
          } else {
            const csvIdx = record.__csvIndex ?? 0;
            const rowIdx = record.__rowIndex ?? idx;
            eventIdNum = csvIdx * 10000 + rowIdx + 1;
          }

          const rawTags = getField("tags", "topics", "Focus");

          return {
            id: eventIdNum,
            title: getField("title", "name", "event_title", "Event Name") || "Untitled Event",
            description: getField("description", "summary", "overview", "Focus"),
            location: getField("location", "city", "venue", "Location"),
            type: getField("type", "category", "Focus"),
            topic: getField("topic", "track", "Focus"),
            date: getField("date", "event_date", "Date"),
            url: getField("url", "link", "URL") || null,
            tags: rawTags ? rawTags.split(",").map(t => t.trim()) : [],
            is_featured: [getField("is_featured", "featured")].some(v => v.toLowerCase() === "true"),
            created_at: record.created_at || new Date().toISOString(),
            updated_at: record.updated_at || new Date().toISOString()
          };
        });

        console.log(`[DEBUG] Looking for event with ID: ${eventId} among ${mappedEvents.length} events`);

        const idNum = parseInt(eventId);
        const candidateIds: number[] = [];
        let tmp = idNum;
        const maxIter = 5;
        let iter = 0;
        while (tmp > 0 && iter < maxIter) {
          candidateIds.push(tmp);
          if (tmp <= mappedEvents.length) break;
          tmp -= 1000;
          iter++;
        }

        const foundEvent = mappedEvents.find(e => candidateIds.includes(e.id));

        if (foundEvent) {
          setEvent(foundEvent);
        } else {
          setError("Event not found");
        }
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchEvent();
  }, [eventId]);

  // Format date to readable format
  const formatEventDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMMM d, yyyy");
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Container className="py-16">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-100"></div>
              <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce delay-200"></div>
            </div>
            <p className="mt-4 text-gray-400">Loading event details...</p>
          </div>
        </Container>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Container className="py-16">
          <div className="max-w-3xl mx-auto">
            <Link href="/" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-8 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
            
            <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-6 text-center">
              <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-semibold mb-2">Event Not Found</h2>
              <p className="text-gray-400 mb-6">{error || "The event you're looking for doesn't exist or has been removed."}</p>
              <Link href="/search">
                <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                  Browse Events
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Container className="py-8">
        {/* Back link */}
        <Link href="/search" className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search Results
        </Link>

        {/* Main card */}
        <div className="max-w-5xl mx-auto px-6 py-10 bg-[#1A1A2E] rounded-xl shadow-lg text-white space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-1">{event.title}</h1>
              <p className="text-sm text-purple-300">{event.topic || "Discover the future of..."}</p>
            </div>
            {event.url ? (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-blue-500 px-5 py-2 rounded-md text-sm font-medium hover:opacity-90 inline-block text-center"
              >
                Register Now
              </a>
            ) : null}
          </div>

          {/* Core Info */}
          <div className="grid sm:grid-cols-3 gap-4 bg-[#23233D] rounded-md px-4 py-3 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 flex items-center gap-1">📅 <span>Date</span></span>
              <span className="font-medium text-white">{formatEventDate(event.date)}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 flex items-center gap-1">📍 <span>Location</span></span>
              <span className="font-medium text-white">{event.location}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-gray-400 flex items-center gap-1">📂 <span>Type</span></span>
              <span className="font-medium text-white leading-snug capitalize">{event.type}</span>
            </div>
          </div>

          {/* About Section */}
          <div>
            <h2 className="text-lg font-semibold mb-2">📌 About This Event</h2>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line">{event.description}</p>
          </div>

          {/* Tags (if any) */}
          {event.tags && event.tags.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-2">🏷️ Tags</h2>
              <div className="flex flex-wrap gap-2">
                {event.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs bg-[#2e2e3e] rounded-full text-white whitespace-nowrap truncate max-w-[160px]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
}
