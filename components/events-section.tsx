"use client"

import { useEffect, useState } from "react"
import { loadCsvEvents } from "@/lib/loadCsvEvents"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

const PREDEFINED_CATEGORIES = ["fintech", "ai", "hackathon", "design"] as const
const CATEGORY_LABELS: Record<string,string> = {
  fintech: "FinTech",
  ai: "AI",
  hackathon: "Hackathons",
  design: "Design",
}

// Manual mapping of event titles to categories as per strict assignment
const CATEGORY_EVENTS: Record<PredefinedCategory, string[]> = {
  fintech: [
    "FinTech Future Forum",
    "Digital Finance Summit",
    "Web3 DevCon 2025",
    "Crypto Business Expo 2025",
  ],
  ai: [
    "AI Strategy Conference 2025",
    "SaaS Growth Masterclass",
    "AI for Startups Bootcamp",
    "TechnoCon AI Demo Day",
  ],
  hackathon: [
    "Hack the Future 2025",
    "Startup Hack Fest",
    "Web3 DevCon 2025",
    "Code Sprint Asia 2025",
  ],
  design: [
    "The MarTech Summit Manila 2025",
    "UXPH 2025",
    "Creative Leadership Forum",
    "Product Jam: Design x Dev",
  ],
}

type PredefinedCategory = typeof PREDEFINED_CATEGORIES[number]

function classifyCategory(raw: string): PredefinedCategory | "general" {
  const v = raw.toLowerCase()
  if (/(fintech|finance|financial|bank|banking|payment|payments|web3|blockchain|crypto|cryptocurrency|defi|investment|investor|fund|vc|venture)/i.test(v)) return "fintech"
  if (/(^|\b)(ai|a\.i\.|artificial intelligence|machine learning|ml|genai|data science|data analytics|data|saas)(\b|$)/i.test(v)) return "ai"
  if (/(hackathon|\bhack\b|devcon|developer|coding|code|build|sprint|bootcamp|competition)/i.test(v)) return "hackathon"
  if (/(design|ux|ui|user experience|martech|branding|creative|graphic|product design)/i.test(v)) return "design"
  return "general"
}
import { Flame } from "lucide-react"
import EventCard from "@/components/event-card"

interface Event {
  id: number
  title: string
  description: string
  date: string
  location: string
  attendees: number
  category: string
  price: "Free" | "Paid"
  priceAmount?: string
  url?: string
  speakers?: string
  bestFor?: string
  attendeeProfile?: string
  tags: string[]
}

interface Props {
  searchQuery?: string
}

const placeholderImg = "/placeholder.svg?height=200&width=400"

export default function EventsSection({ searchQuery = "" }: Props) {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [displayed, setDisplayed] = useState<Event[]>([])
  const [loadingMore, setLoadingMore] = useState(false)

  const [hasMore, setHasMore] = useState(false)

  // load CSVs once on mount
  useEffect(() => {
    ;(async () => {
      const raw = await loadCsvEvents(["/data/startup_events.csv", "/data/event_planner_events.csv"])
      const mapped: Event[] = raw.map((r, i) => {
        const rec: Record<string, string> = {}
        for (const [k, v] of Object.entries(r)) {
          rec[k.toLowerCase()] = String(v ?? "")
        }
        return {
        id: i + 1,
        title: rec["event name"] || rec["title"] || rec["event_name"] || "Untitled",
        description: (r["Description"] ?? r["focus"] ?? "").toString(),
        date: (r["Date"] ?? r["date"] ?? "TBD").toString(),
        
        location: (r["Location"] ?? r["location"] ?? "").toString(),
        attendees: parseInt((r["Expected Attendees"] ?? r["attendees"] ?? "0").replace(/[^0-9]/g, "")) || 0,
        
        category: classifyCategory(String(r["Category"] ?? r["focus"] ?? r["Description"] ?? r["title"])),
        price: /free/i.test(String(r["Cost"] ?? r["price"])) ? "Free" : "Paid",
        priceAmount: r["Cost"]?.toString(),
        
        speakers: (r["Speakers"] ?? "").toString(),
        bestFor: (r["Best For"] ?? "").toString(),
        attendeeProfile: (r["Attendee Profile"] ?? "").toString(),
        tags: (r["Tags"] ?? "").toString().split(/[,;]+/).filter(Boolean),
        url: (r["URL"] ?? r["url"] ?? "").toString(),
              }
      })
      setEvents(mapped)
      setDisplayed(mapped.slice(0, 6))
      setHasMore(mapped.length > 6)

    })()
  }, [])

  const loadMore = () => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    setTimeout(() => {
      setDisplayed((prev) => {
        const next = events.slice(prev.length, prev.length + 6)
        return [...prev, ...next]
      })
      setHasMore(events.length > displayed.length + 6)
      setLoadingMore(false)
    }, 400)
  }

  // derive filtered list based on search and category
  const baseList = searchQuery || selectedCategory !== "all" ? events : displayed

  const filteredBase = searchQuery
    ? events.filter((e) => {
        const q = searchQuery.toLowerCase()
        return (
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
        )
      })
    : baseList

  const filtered = selectedCategory === "all"
    ? filteredBase
    : (() => {
        const allowed = new Set(
          CATEGORY_EVENTS[selectedCategory as PredefinedCategory].map((t) => t.toLowerCase().trim())
        )
        const byTitle = filteredBase.filter((e) => allowed.has(e.title.toLowerCase().trim()))
        if (byTitle.length > 0) return byTitle
        // fallback #1: use precomputed category
        const byPrecomput = filteredBase.filter((e) => e.category === selectedCategory)
        if (byPrecomput.length > 0) return byPrecomput
        // fallback #2: on-the-fly keyword classify title + description
        return filteredBase.filter((e) => {
          const guess = classifyCategory(`${e.title} ${e.description}`)
          return guess === selectedCategory
        })
      })()

  return (
    <section id="events" className="py-16 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Category Heading */}
        <motion.h3
          key={searchQuery || "all"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-2xl md:text-3xl font-extrabold mb-4 bg-gradient-to-r from-purple-300 via-blue-300 to-teal-300 bg-clip-text text-transparent drop-shadow-lg"
        >
          {selectedCategory === "all" ? "All Categories" : `${CATEGORY_LABELS[selectedCategory] ?? selectedCategory}` + " Events"}
        </motion.h3>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button
            key="all"
            onClick={() => setSelectedCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 backdrop-blur border  ${selectedCategory === "all" ? "border-transparent bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg" : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"}`}
          >
            All
          </button>
          {PREDEFINED_CATEGORIES.map((cat) => (
            <button
              key={CATEGORY_LABELS[cat]}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 backdrop-blur border  ${selectedCategory === cat ? "border-transparent bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg" : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"}`}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-center mb-12">
          <Flame className="h-8 w-8 text-orange-400 mr-3" />
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-transparent">
            Upcoming Events
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid lg:grid-cols-3 gap-6" style={{ gridAutoRows: '1fr' }}>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <p className="col-span-full text-center text-white/60 italic">No events in this category yet</p>
            ) : (
              filtered.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </AnimatePresence>
        </div>

        {hasMore && (
          <div className="text-center mt-12">
            <Button onClick={loadMore} disabled={loadingMore} variant="outline" className="bg-white/10 backdrop-blur text-white">
              {loadingMore ? "Loading…" : "Load more"}
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}
