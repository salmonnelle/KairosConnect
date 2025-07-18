import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { loadCsvEvents, RawEventRecord } from "@/lib/loadCsvEvents";
import { CSV_SOURCES } from "@/lib/csvSources";

// Define PostgrestFilterBuilder type to fix TypeScript error
type PostgrestFilterBuilder = any;

// Define the search parameters interface
export interface EventSearchParams {
  keyword?: string;
  type?: string;
  topic?: string;
  startDate?: Date;
  endDate?: Date;
}

// Interface for live search parameters
export interface LiveSearchParams {
  query: string;
  limit?: number;
  type?: string;
  location?: string;
  date?: string;
}

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

/**
 * Fetch events from Supabase based on search parameters
 * @param params Search parameters
 * @returns Array of events
 */
export async function fetchFilteredEvents(params: EventSearchParams): Promise<Event[]> {
  try {
    // Start building the query
    let query = supabase
      .from("events")
      .select("*");

    // Apply filters based on provided parameters
    query = applyFilters(query, params);

    // Execute the query
    const { data, error } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return [];
  }
}

/**
 * Apply filters to the Supabase query based on search parameters
 * @param query Initial Supabase query
 * @param params Search parameters
 * @returns Updated query with filters applied
 */
function applyFilters(
  query: any,
  params: EventSearchParams
): any {
  const { keyword, type, topic, startDate, endDate } = params;

  // Apply keyword filter (search in title and description)
  if (keyword && keyword.trim() !== "") {
    // Use .or to search in both title and description
    const searchTerm = `%${keyword.trim()}%`;
    query = query.or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`);
  }

  // Apply type filter
  if (type && type.trim() !== "") {
    query = query.eq("type", type);
  }

  // Apply topic filter
  if (topic && topic.trim() !== "") {
    query = query.eq("topic", topic);
  }

  // Apply date range filters
  if (startDate) {
    const formattedStartDate = format(startDate, "yyyy-MM-dd");
    query = query.gte("date", formattedStartDate);
  }

  if (endDate) {
    const formattedEndDate = format(endDate, "yyyy-MM-dd");
    query = query.lte("date", formattedEndDate);
  }

  // Order by date (ascending)
  query = query.order("date", { ascending: true });

  return query;
}

/**
 * Fetch featured events
 * @param limit Maximum number of events to fetch
 * @returns Array of featured events
 */
export async function fetchFeaturedEvents(limit: number = 6): Promise<Event[]> {
  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("is_featured", true)
      .order("date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured events:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch featured events:", error);
    return [];
  }
}

/**
 * Fetch upcoming events
 * @param limit Maximum number of events to fetch
 * @returns Array of upcoming events
 */
export async function fetchUpcomingEvents(limit: number = 10): Promise<Event[]> {
  try {
    const today = new Date();
    const formattedDate = format(today, "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .gte("date", formattedDate)
      .order("date", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching upcoming events:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Failed to fetch upcoming events:", error);
    return [];
  }
}

/**
 * Live search for events based on user input
 * Performs smart matching on title, description, tags, type, and topic fields
 * Returns top matching events immediately as user types
 * 
 * @param params Search parameters including query string and result limit
 * @returns Promise with array of matching events
 */
export async function liveSearchEvents(params: LiveSearchParams): Promise<Event[]> {
  try {
    const { query, type, location, date, limit = 6 } = params;
    console.log('%c[SUPABASE INTEGRATION] Search params:', 'background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;', { query, type, location, date, limit });
    
    // Try to fetch events from Supabase first
    try {
      const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
      if (!USE_SUPABASE) {
        console.log('%c[SUPABASE INTEGRATION] USE_SUPABASE=false, skipping Supabase and using CSV fallback','background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;');
        throw { isFallbackSignal: true };
      }

      console.log('%c[SUPABASE INTEGRATION] Attempting to fetch events from Supabase...','background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;');
      
      // TEMPORARY: Skip Supabase and go straight to CSV fallback
      // This ensures the app works while we debug Supabase issues
      console.log('%c[SUPABASE INTEGRATION] Temporarily skipping Supabase to use CSV fallback', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;');
      // Use a controlled flag instead of throwing an error
      const useCsvFallback = true;
      if (useCsvFallback) {
        // Skip the rest of the Supabase code and use CSV directly
        // We'll handle this in the catch block to keep the code clean
        throw { isFallbackSignal: true };
      }
      
      /* Commented out for now to ensure app works
      // Use Supabase to fetch events
      let supabaseQuery = supabase.from('events').select('*');
      
      // Apply filters based on search parameters
      if (type && type !== 'All Types') {
        console.log('%c[SUPABASE INTEGRATION] Applying type filter:', 'background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;', type);
        supabaseQuery = supabaseQuery.eq('type', type);
      }
      
      if (location) {
        console.log('%c[SUPABASE INTEGRATION] Applying location filter:', 'background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;', location);
        supabaseQuery = supabaseQuery.ilike('location', `%${location}%`);
      }
      
      if (date) {
        console.log('%c[SUPABASE INTEGRATION] Applying date filter:', 'background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;', date);
        supabaseQuery = supabaseQuery.eq('date', date);
      }
      
      // Execute the query
      console.log('%c[SUPABASE INTEGRATION] Executing Supabase query...', 'background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;');
      const { data: supabaseEvents, error } = await supabaseQuery.limit(limit);
      
      if (error) {
        console.error('%c[SUPABASE INTEGRATION] Supabase query error:', 'background: #FF4747; color: white; padding: 2px 4px; border-radius: 2px;', error);
        throw error;
      }
      */
      
      /* This section is commented out as part of the temporary fix
      if (supabaseEvents && supabaseEvents.length > 0) {
        console.log('%c[SUPABASE INTEGRATION] Successfully fetched events from Supabase:', 'background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;', supabaseEvents);
        // Process Supabase events to ensure they match our Event interface
        const events: Event[] = supabaseEvents.map((event: any) => ({
          ...event,
          // Ensure tags is an array
          tags: Array.isArray(event.tags) ? event.tags : []
        }));
        
        // Apply keyword search if query is provided
        if (query && query.trim().length >= 2) {
          console.log('%c[SUPABASE INTEGRATION] Applying keyword search to Supabase results', 'background: #3ECF8E; color: white; padding: 2px 4px; border-radius: 2px;');
          return filterEventsByKeyword(events, query);
        }
        
        return events;
      } else {
        console.log('%c[SUPABASE INTEGRATION] No events found in Supabase, falling back to CSV', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;');
      }
      */
    } catch (supabaseError) {
      // Check if this is our intentional fallback signal
      if (supabaseError && typeof supabaseError === 'object' && 'isFallbackSignal' in supabaseError) {
        console.log('%c[SUPABASE INTEGRATION] Using CSV fallback as configured', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;');
      } else {
        // This is an actual error
        console.error('%c[SUPABASE INTEGRATION] Error fetching events from Supabase:', 'background: #FF4747; color: white; padding: 2px 4px; border-radius: 2px;', supabaseError);
        console.log('%c[SUPABASE INTEGRATION] Falling back to CSV data due to Supabase error', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;');
      }
      // Continue to CSV fallback
    }
    
    // Fallback to CSV if Supabase query fails or returns no results
    console.log('%c[CSV FALLBACK] Falling back to CSV data source', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;');
    const csvPaths = CSV_SOURCES;
    console.log('%c[CSV FALLBACK] Loading from CSV paths:', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;', csvPaths);
    
    const rawEvents = await loadCsvEvents(csvPaths);
    console.log('%c[CSV FALLBACK] Loaded raw events from CSV:', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;', rawEvents.length);
    
    // Convert raw CSV records to Event objects and ensure unique IDs
    const allEvents: Event[] = rawEvents.map((record: RawEventRecord, index: number) => {
      // Ensure unique ID by using index as a fallback if ID is missing or 0
      const rawIdStr = (record.id ?? record.ID ?? record["Event ID"] ?? record["event_id"]) as string | undefined;
      let eventId: number;
      const parsedId = rawIdStr ? parseInt(rawIdStr) : NaN;
      if (!isNaN(parsedId) && parsedId > 0) {
        eventId = parsedId;
      } else {
        // Derive stable numeric ID based on csv + row index
        const csvIdx = record.__csvIndex ?? 0;
        const rowIdx = record.__rowIndex ?? index;
        eventId = csvIdx * 10000 + rowIdx + 1;
      }
      
      // Helper to fetch first non-empty field by possible header names
      const getField = (...keys: string[]): string => {
        for (const key of keys) {
          if (record[key] && record[key].trim()) return record[key].trim();
        }
        return "";
      };

      const rawTags = getField("tags", "topics", "Focus");

      return {
        id: eventId,
        title: getField("title", "name", "event_title", "Event Name") || "Untitled Event",
        description: getField("description", "summary", "overview", "Focus"),
        location: getField("location", "city", "venue", "Location"),
        type: getField("type", "category", "Focus"),
        topic: getField("topic", "track", "Focus"),
        date: getField("date", "event_date", "Date"),
        url: (() => {
           const raw = getField("url", "link", "URL", "website", "registration", "event_url", "source").trim();
           if (!raw || /^(na|n\/a|-|#)$/i.test(raw)) return null;
           let cleaned = raw;
           if (!/^https?:\/\//i.test(cleaned)) {
             cleaned = `https://${cleaned}`;
           }
           try {
             const u = new URL(cleaned);
             // Require at least one dot in hostname to avoid "n/a" etc.
             if (!u.hostname.includes('.')) return null;
             return cleaned;
           } catch {
             return null;
           }
         })(),
        tags: rawTags ? rawTags.split(",").map(tag => tag.trim()) : [],
        is_featured: [getField("is_featured", "featured")].some(v => v.toLowerCase() === "true"),
        created_at: record.created_at || new Date().toISOString(),
        updated_at: record.updated_at || new Date().toISOString()
      };
    });
    
    console.log('%c[CSV FALLBACK] Processed CSV events:', 'background: #FF9800; color: white; padding: 2px 4px; border-radius: 2px;', allEvents.length);
    
    // First apply type and location filters if provided
    let filteredEvents = [...allEvents];
    
    // Apply type filter
    if (type && type !== 'All Types') {
      console.log('%c[SEARCH] Applying type filter to CSV results:', 'background: #3F51B5; color: white; padding: 2px 4px; border-radius: 2px;', type);
      filteredEvents = filteredEvents.filter(event => {
        const eventType = event.type.toLowerCase().trim();
        const filterType = type.toLowerCase().trim();
        
        // More flexible matching - check if event type contains filter type or vice versa
        const exactMatch = eventType === filterType;
        const eventContainsFilter = eventType.includes(filterType);
        const filterContainsEvent = filterType.includes(eventType);
        
        console.log(`Event type: "${eventType}", Filter: "${filterType}", Match: ${exactMatch || eventContainsFilter || filterContainsEvent}`);
        
        return exactMatch || eventContainsFilter || filterContainsEvent;
      });
      console.log('%c[SEARCH] After type filter:', 'background: #3F51B5; color: white; padding: 2px 4px; border-radius: 2px;', filteredEvents.length);
    }
    
    // Apply location/topic filter
    if (location && location !== 'Topic') {
      console.log('%c[SEARCH] Applying topic filter to CSV results:', 'background: #3F51B5; color: white; padding: 2px 4px; border-radius: 2px;', location);
      filteredEvents = filteredEvents.filter(event => {
        const eventTopic = event.topic.toLowerCase().trim();
        const filterTopic = location.toLowerCase().trim();
        
        // More flexible matching - check if event topic contains filter topic or vice versa
        const exactMatch = eventTopic === filterTopic;
        const eventContainsFilter = eventTopic.includes(filterTopic);
        const filterContainsEvent = filterTopic.includes(eventTopic);
        
        console.log(`Event topic: "${eventTopic}", Filter: "${filterTopic}", Match: ${exactMatch || eventContainsFilter || filterContainsEvent}`);
        
        return exactMatch || eventContainsFilter || filterContainsEvent;
      });
      console.log('%c[SEARCH] After topic filter:', 'background: #3F51B5; color: white; padding: 2px 4px; border-radius: 2px;', filteredEvents.length);
    }
    
    // Apply keyword search if query is provided
    if (query && query.trim().length >= 2) {
      console.log('%c[SEARCH] Applying keyword search to CSV results:', 'background: #3F51B5; color: white; padding: 2px 4px; border-radius: 2px;', query);
      filteredEvents = filterEventsByKeyword(filteredEvents, query);
      console.log('%c[SEARCH] Keyword search results:', 'background: #3F51B5; color: white; padding: 2px 4px; border-radius: 2px;', filteredEvents.length);
    }
    
    console.log('%c[SEARCH] Returning filtered events:', 'background: #3F51B5; color: white; padding: 2px 4px; border-radius: 2px;', filteredEvents.length);
    return filteredEvents;
  } catch (error) {
    console.error('Error in liveSearchEvents:', error);
    return [];
  }
}

// Helper function to filter events by keyword
function filterEventsByKeyword(events: Event[], query: string): Event[] {
  const normalizedQuery = query.toLowerCase().trim();
  console.log('%c[KEYWORD SEARCH] Filtering events with query:', 'background: #673AB7; color: white; padding: 2px 4px; border-radius: 2px;', normalizedQuery);
  console.log('%c[KEYWORD SEARCH] Total events before filtering:', 'background: #673AB7; color: white; padding: 2px 4px; border-radius: 2px;', events.length);
  
  const matchCounts = {
    title: 0,
    description: 0,
    type: 0,
    topic: 0,
    location: 0,
    tags: 0
  };
  
  const filteredEvents = events.filter(event => {
    // Check if query matches any of these fields
    const titleMatch = event.title.toLowerCase().includes(normalizedQuery);
    const descMatch = event.description.toLowerCase().includes(normalizedQuery);
    const typeMatch = event.type.toLowerCase().includes(normalizedQuery);
    const topicMatch = event.topic.toLowerCase().includes(normalizedQuery);
    const locationMatch = event.location.toLowerCase().includes(normalizedQuery);
    
    // Check if query matches any tag
    const tagMatch = event.tags.some(tag => 
      tag.toLowerCase().includes(normalizedQuery)
    );
    
    // Update match counts for analytics
    if (titleMatch) matchCounts.title++;
    if (descMatch) matchCounts.description++;
    if (typeMatch) matchCounts.type++;
    if (topicMatch) matchCounts.topic++;
    if (locationMatch) matchCounts.location++;
    if (tagMatch) matchCounts.tags++;
    
    return titleMatch || descMatch || typeMatch || topicMatch || locationMatch || tagMatch;
  });
  
  console.log('%c[KEYWORD SEARCH] Match counts by field:', 'background: #673AB7; color: white; padding: 2px 4px; border-radius: 2px;', matchCounts);
  console.log('%c[KEYWORD SEARCH] Total events after filtering:', 'background: #673AB7; color: white; padding: 2px 4px; border-radius: 2px;', filteredEvents.length);
  
  return filteredEvents;
}
