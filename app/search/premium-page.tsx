"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { liveSearchEvents, Event, EventSearchParams, LiveSearchParams } from "@/lib/utils/event-filter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "@/lib/animation";
import { Search, ArrowRight, Filter, ChevronDown, ChevronUp, X, Loader2 } from "lucide-react";
import Link from "next/link";
import { PremiumEventCard } from "@/components/search/premium-event-card";
import SplitPaneEvents from "@/components/events/split-pane-events";
import { BackgroundEffects } from "@/components/search/background-effects";
import InfiniteScrollEvents from "@/components/events/infinite-scroll-events";

interface PremiumSearchPageProps {
  query: string;
  type: string;
  location: string;
  date: string;
}

export function PremiumSearchPage({ query, type, location, date }: PremiumSearchPageProps) {
  const router = useRouter();

  // State for filtered events
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleEvents, setVisibleEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(1);
  const eventsPerPage = 6;
  const [selectedType, setSelectedType] = useState(type || "All Types");
  const [selectedTopic, setSelectedTopic] = useState(location || "Topic");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  // Load events on mount and when search params change
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      setError(null);
      setPage(1); // Reset to first page when search params change

      try {
        // Build search params
        const params: LiveSearchParams = {
          query: query || ""
        };
        if (type && type !== "All Types") params.type = type;
        if (location && location !== "Topic") params.location = location;
        if (date) params.date = date;

        const results = await liveSearchEvents(params);
        console.log("[DEBUG] liveSearchEvents results", results);
        // expose globally for quick inspection
        if (typeof window !== 'undefined') {
          // @ts-ignore
          window.__VISIBLE_EVENTS = results;
        }
        setEvents(results);
        setVisibleEvents(results.slice(0, eventsPerPage));
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setEvents([]);
        setVisibleEvents([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
    // Set form state based on URL params
    setSelectedType(type || "All Types");
    setSelectedTopic(location || "Topic");
    setSearchInput(query || "");
  }, [query, type, location, date]);

  // Load more events when page changes
  useEffect(() => {
    setVisibleEvents(events.slice(0, page * eventsPerPage));
  }, [page, events]);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query params
    const params = new URLSearchParams();
    if (searchInput) params.set("q", searchInput);
    if (selectedType !== "All Types") params.set("type", selectedType);
    if (selectedTopic !== "Topic") params.set("topic", selectedTopic);
    
    // Navigate to search page with params
    router.push(`/search?${params.toString()}`);
  };

  // Handle filter changes
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  const handleTopicChange = (topic: string) => {
    setSelectedTopic(topic);
  };

  const clearFilters = () => {
    setSelectedType("All Types");
    setSelectedTopic("Topic");
    setSearchInput("");
    router.push("/search");
  };

  // Handle load more
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Check if there are active filters
  const hasActiveFilters = selectedType !== "All Types" || selectedTopic !== "Topic" || searchInput;

  // Featured events (first 2 events or random ones)
  // If no events are explicitly marked as featured, use the first 2 events
  let featuredEvents = events.filter(event => event.is_featured).slice(0, 2);
  
  // If no featured events are found, use the first 2 events from the list
  if (featuredEvents.length === 0 && events.length > 0) {
    featuredEvents = events.slice(0, 2);
  }
  
  return (
    <div className="min-h-screen w-full text-white">
      <BackgroundEffects />
      
      {/* Back to Home button */}
      <div className="absolute top-6 right-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-black/40 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 px-4 py-2"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Home
        </Link>
      </div>
      
      <main className="min-h-screen pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
          >
            Professional Events
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg text-white/70 max-w-3xl"
          >
            Discover curated professional events and networking opportunities tailored to your interests.
          </motion.p>
        </div>

        {/* Search form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-emerald-500/20 rounded-2xl blur-lg opacity-50"></div>
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                    <input
                      type="text"
                      placeholder="Search events, topics, or locations..."
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      className="w-full h-12 bg-white/5 border-0 rounded-2xl pl-10 pr-4 py-2 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[#9945FF]/30"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      type="submit"
                      className="h-12 px-6 rounded-2xl text-white font-medium bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:shadow-purple-500/25"
                    >
                      Find Events
                    </Button>
                    
                    <Button 
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                      variant="ghost" 
                      className="h-12 text-white/80 hover:text-white flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                    >
                      <Filter size={16} />
                      Advanced Filters
                      {showAdvancedFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </Button>
                  </div>
                </div>
                
                {/* Advanced filters panel */}
                {showAdvancedFilters && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm text-white/70 mb-2">Event Type</h4>
                        <div className="flex flex-wrap gap-2">
                          {["All Types", "Workshop", "Conference", "Meetup", "Webinar", "Hackathon"].map((type) => (
                            <Badge
                              key={type}
                              variant={selectedType === type ? "default" : "outline"}
                              className={`cursor-pointer ${selectedType === type ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}
                              onClick={() => handleTypeChange(type)}
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm text-white/70 mb-2">Topic</h4>
                        <div className="flex flex-wrap gap-2">
                          {["Topic", "AI", "Blockchain", "Web3", "Design", "Product", "Marketing"].map((topic) => (
                            <Badge
                              key={topic}
                              variant={selectedTopic === topic ? "default" : "outline"}
                              className={`cursor-pointer ${selectedTopic === topic ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}
                              onClick={() => handleTopicChange(topic)}
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {(selectedType !== "All Types" || selectedTopic !== "Topic") && (
                      <div className="mt-4 flex justify-end">
                        <Button 
                          onClick={clearFilters}
                          variant="ghost" 
                          className="text-white/80 hover:text-white flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                        >
                          <X size={16} />
                          Clear Filters
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </motion.div>
        
        {/* Active filters display */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-8 flex flex-wrap items-center gap-2"
          >
            <span className="text-white/60 text-sm">Active filters:</span>
            {searchInput && (
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-xl text-sm flex items-center gap-1">
                "{searchInput}"
              </span>
            )}
            {selectedType !== "All Types" && (
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-xl text-sm flex items-center gap-1">
                {selectedType}
              </span>
            )}
            {selectedTopic !== "Topic" && (
              <span className="bg-white/10 text-white/80 px-3 py-1 rounded-xl text-sm flex items-center gap-1">
                {selectedTopic}
              </span>
            )}
          </motion.div>
        )}

        {/* Featured events section (if any) */}
        {featuredEvents.length > 0 && !isLoading && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-white mb-6">Featured Events</h2>
            <div className="relative h-auto">
              <InfiniteScrollEvents 
                events={featuredEvents} 
                className=""
              />
            </div>
          </div>
        )}



        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">
              {isLoading ? "Loading events..." : `${events.length} Events Found`}
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-white/50" size={40} />
            </div>
          ) : error ? (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center">
              <p className="text-red-400 mb-4">{error}</p>
              <Button onClick={() => router.push("/search")} variant="outline">
                Reset Search
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 text-center">
              <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
              <p className="text-white/70 mb-6">
                Try adjusting your search criteria or browse all events.
              </p>
              <Button onClick={clearFilters} variant="outline" className="text-white border-white/20">
                Clear Filters
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop split-pane; fallback grid for mobile */}
              <div className="hidden lg:block">
                <SplitPaneEvents events={events} />
              </div>
              <div className="block lg:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {visibleEvents.map((event, index) => (
                    <PremiumEventCard 
                      key={event.id} 
                      event={event}
                      searchQuery={query}
                      index={index + (featuredEvents.length > 0 ? 2 : 0)}
                    />
                  ))}
                </div>
                {/* Load more for mobile */}
                {visibleEvents.length < events.length && (
                  <div className="mt-10 flex justify-center">
                    <Button 
                      onClick={handleLoadMore}
                      className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center gap-2"
                    >
                      Load More <ArrowRight size={16} />
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
