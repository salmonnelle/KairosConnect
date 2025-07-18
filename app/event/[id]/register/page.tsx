"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Event } from "@/lib/utils/event-filter";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "@/lib/animation";

// Toggle Supabase usage (default false for demo stability)
const USE_SUPABASE = process.env.NEXT_PUBLIC_USE_SUPABASE === 'true';
import { format } from "date-fns";
import Link from "next/link";

export default function EventRegistrationPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: ""
  });

  useEffect(() => {
    async function fetchEvent() {
      if (!eventId) {
        setIsLoading(false);
        setError("Event ID is missing");
        return;
      }

      setIsLoading(true);
      try {
        // Attempt numeric conversion for robust matching
        const numericId = Number(eventId);
        const idValue: string | number = isNaN(numericId) ? eventId : numericId;

        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", idValue)
          .maybeSingle();
        
        if (error) {
          if (error && Object.keys(error).length) {
          console.warn("[SUPABASE] query error", error);
        }
        }

        if (data) {
          setEvent(data as Event);
         if (data && (data as Event).url) {
           try {
             const valid = new URL((data as Event).url!);
             window.location.replace(valid.href);
             return;
           } catch {}
         }
        } else {
          // Fallback to CSV lookup if Supabase fails
          try {
            const { CSV_SOURCES } = await import("@/lib/csvSources");
            const rawRecords = await (await import("@/lib/loadCsvEvents")).loadCsvEvents(CSV_SOURCES);

            const mappedEvents: Event[] = rawRecords.map((record: any, idx: number) => {
              const getField = (...keys: string[]) => {
                for (const k of keys) {
                  if (record[k] && record[k].trim()) return record[k].trim();
                }
                return "";
              };
              const rawId = (record.id ?? record.ID ?? record["Event ID"] ?? record["event_id"]) as string | undefined;
              const eventIdNum = rawId && parseInt(rawId) > 0 ? parseInt(rawId) : idx + 1;
              return {
                id: eventIdNum,
                title: getField("title", "name", "event_title", "Event Name") || "Untitled Event",
                description: getField("description", "summary", "overview", "Focus"),
                location: getField("location", "city", "venue", "Location"),
                type: getField("type", "category", "Focus"),
                topic: getField("topic", "track", "Focus"),
                date: getField("date", "event_date", "Date"),
                url: getField("url", "link", "URL") || null,
                tags: (getField("tags", "topics", "Focus") || "").split(",").map((t: string) => t.trim()).filter(Boolean),
                is_featured: [getField("is_featured", "featured")].some(v => v.toLowerCase() === "true"),
                created_at: record.created_at || new Date().toISOString(),
                updated_at: record.updated_at || new Date().toISOString()
              };
            });

            const targetId = parseInt(eventId);
            const found = mappedEvents.find(e => e.id === targetId);
            if (found) {
              setEvent(found);
            // If a valid external URL exists, redirect immediately
            if (found && found.url) {
              try {
                const valid = new URL(found.url);
                window.location.replace(valid.href);
                return; // Stop further processing
              } catch {}
            }
            } else {
              setError("Event not found");
            }
          } catch (csvErr) {
            console.error("CSV fallback failed", csvErr);
            setError("Unable to load event details.");
          }
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would submit this to your backend
    // For now, we'll just simulate a successful registration
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      setFormSubmitted(true);
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        company: "",
        role: ""
      });
      
      // In a real app, you might redirect to a confirmation page
      // or show a modal with confirmation details
    } catch (err) {
      console.error("Error submitting registration:", err);
      setError("Failed to submit registration. Please try again.");
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
            <p className="mt-4 text-gray-400">Loading registration form...</p>
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

  if (formSubmitted) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        <Container className="py-16">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden p-8 text-center"
            >
              <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Registration Successful!</h1>
              <p className="text-gray-300 mb-6">
                You have successfully registered for <span className="text-purple-400 font-semibold">{event.title}</span>.
                <br />
                We've sent a confirmation email with all the details.
              </p>
              
              <div className="bg-white/5 rounded-lg p-6 mb-8 inline-block">
                <div className="text-left">
                  <p className="text-gray-400 mb-1">Event</p>
                  <p className="text-white font-medium mb-4">{event.title}</p>
                  
                  <p className="text-gray-400 mb-1">Date</p>
                  <p className="text-white font-medium mb-4">{formatEventDate(event.date)}</p>
                  
                  <p className="text-gray-400 mb-1">Location</p>
                  <p className="text-white font-medium">{event.location}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/event/${event.id}`}>
                  <Button variant="outline" className="border-purple-300/30 text-white hover:bg-white/10">
                    Event Details
                  </Button>
                </Link>
                <Link href="/search">
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    Browse More Events
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Container className="py-16">
        <div className="max-w-4xl mx-auto">
          <Link href={`/event/${event.id}`} className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Event Details
          </Link>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
              >
                <div className="p-8">
                  <h1 className="text-2xl md:text-3xl font-bold mb-6">Register for Event</h1>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Enter your email address"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-1">
                          Company / Organization
                        </label>
                        <Input
                          id="company"
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Enter your company or organization"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                          Job Title / Role
                        </label>
                        <Input
                          id="role"
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="bg-white/5 border-white/10 text-white"
                          placeholder="Enter your job title or role"
                        />
                      </div>
                      
                      <div className="pt-4">
                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-6"
                        >
                          Complete Registration
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
            
            <div>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden sticky top-8">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Event Summary</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-white">{event.title}</h3>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-300">{formatEventDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-300">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span className="text-gray-300">{event.type}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-sm text-gray-400 mb-4">
                      By registering for this event, you agree to receive communications about this and similar events.
                    </p>
                    <Link href={`/event/${event.id}`}>
                      <Button variant="outline" className="w-full border-purple-300/30 text-white hover:bg-white/10">
                        View Event Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
