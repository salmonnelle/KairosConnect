"use client"

import type React from "react"

import { motion, AnimatePresence } from "@/lib/animation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Users, Calendar, Sparkles, Search, Zap, Target, TrendingUp, Plus, LogOut } from "lucide-react"
import { useState } from "react"
import PersonalizationQuiz from "@/components/personalization-quiz"
import QuizResults from "@/components/quiz-results"
import EventsSection from "@/components/events-section"
import ReferralProgram from "@/components/referral-program"
import DynamicGradientBackground from "@/components/dynamic-gradient-background"
import { AuthProvider, useAuth } from "@/components/auth-context"
import WaitlistModal from "@/components/waitlist-modal"
// import SignInModal from "@/components/sign-in-modal"
import EventUpload from "@/components/event-upload"
import SparkleAnimation from "@/components/sparkle-animation"
import ContactForm from "@/components/contact-form"
import { EventSearchInput } from "@/components/search/event-search-input"

function KairosLandingContent() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizData, setQuizData] = useState(null)
  // Removed referral program state
  const [searchQuery, setSearchQuery] = useState("")
  // const [showSignIn, setShowSignIn] = useState(false)
  const [activeTab, setActiveTab] = useState<"discover" | "upload">("discover")
  const [showContact, setShowContact] = useState(false)
  const [eventType, setEventType] = useState<string>("All Types")
  const [eventLocation, setEventLocation] = useState<string>("Topic")
  const [eventDate, setEventDate] = useState<string>("")
  // Contact form handling is now in the ContactForm component

  const { user, isAuthenticated, signOut } = useAuth()

  const handleQuizComplete = (data: any) => {
    setQuizData(data)
    setShowQuiz(false)
    setShowResults(true)
  }

  const handleStartOver = () => {
    setShowResults(false)
    setShowQuiz(false)
    setQuizData(null)
  }

  const handleJoinCommunity = () => {
    const eventsSection = document.getElementById("events")
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Log search parameters for debugging
    console.log({
      query: searchQuery,
      type: eventType,
      location: eventLocation,
      date: eventDate
    })
    
    // Build query parameters object
    const params = new URLSearchParams();
    
    // Only add parameters that have values
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    }
    
    if (eventType !== "All Types") {
      params.set("type", eventType);
    }
    
    if (eventLocation !== "Topic") {
      params.set("location", eventLocation);
    }
    
    if (eventDate) {
      params.set("date", eventDate);
    }
    
    // Navigate to search page if we have any parameters
    if (params.toString()) {
      window.location.href = `/search?${params.toString()}`;
    } else {
      // If no parameters at all, just scroll to events section
      const eventsSection = document.getElementById("events")
      if (eventsSection) {
        eventsSection.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleQuizStart = () => {
    setShowQuiz(true)
  }

  const handleSignUpFromQuiz = () => {
    // TODO: open waitlist modal instead of sign-in
  }

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      <SparkleAnimation />
      {/* Refined Dynamic Gradient Background */}
      <DynamicGradientBackground />

      {/* Enhanced Navigation with Search */}
      <motion.nav
        className="relative z-50 flex items-center justify-between px-6 py-4 lg:px-12 backdrop-blur-content bg-black/20 border-b border-white/5"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="flex items-center"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <span className="text-4xl font-bold tracking-tight text-shadow-subtle">KAIROS</span>
        </motion.div>

        {/* Spacer div to maintain layout */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          {/* Search removed as requested */}
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* Contact Us */}
            <Button
              onClick={() => setShowContact(true)}
              className="bg-white hover:bg-gray-100 px-6 py-2 text-base font-medium rounded-md shadow-md transition-all duration-200 hover:scale-105 h-[45px] w-[140px]"
            >
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">Contact Us</span>
            </Button>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-1">
            {isAuthenticated && (
              <button
                onClick={() => setActiveTab("upload")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center ${
                  activeTab === "upload"
                    ? "bg-white/20 text-white shadow-lg"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Event
              </button>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  <img
                    src={user?.avatar || "/placeholder.svg?height=24&width=24"}
                    alt={user?.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-white text-sm font-medium">{user?.name}</span>
                </div>
                <Button
                  onClick={signOut}
                  variant="ghost"
                  size="sm"
                  className="text-white/90 hover:text-white hover:bg-white/10 text-sm font-medium backdrop-blur-sm transition-smooth"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <WaitlistModal />
            )}
          </div>
        </div>
      </motion.nav>

      {/* Contact Form */}
      <AnimatePresence>
        {showContact && <ContactForm isOpen={showContact} onClose={() => setShowContact(false)} />}
      </AnimatePresence>

      {/* Mobile Navigation Tabs */}
      {isAuthenticated && (
        <div className="lg:hidden relative z-40 px-6 py-3 bg-black/10 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-1">

            <button
              onClick={() => setActiveTab("upload")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center ${
                activeTab === "upload"
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Event
            </button>
          </div>
        </div>
      )}

      {/* Content based on active tab */}
      {activeTab === "upload" && isAuthenticated ? (
        <div className="relative z-10 px-6 lg:px-12 py-16">
          <EventUpload />
        </div>
      ) : (
        <>
          {/* Hero Section - Reduced Height */}
          <div className="relative z-10 px-6 lg:px-12 pt-32 pb-12">
            <div className="max-w-6xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Badge className="mb-3 bg-black/30 backdrop-blur-content border-white/20 text-white hover:bg-black/40 px-4 py-2 glow-purple-subtle transition-smooth whitespace-normal max-w-none">
                  <Zap className="h-4 w-4 mr-2" />
                  AI-Powered Event Discovery
                </Badge>

                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight text-shadow-subtle transition-transform duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.02] hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  whileHover={{ cursor: 'default' }}
                >
                  The all-in-one <span className="animate-gradient-text-subtle">professional events</span> platform for
                  founders
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed font-light backdrop-blur-content bg-black/20 rounded-2xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Connect with professional events that count. KAIROS creates the difference with smart recommendations,
                  premium networking opportunities, and curated experiences.
                </motion.p>

                {/* Enhanced Search Bar with Filters */}
                <motion.div
                  className="max-w-4xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <div className="rounded-xl overflow-hidden border border-white/20 shadow-lg shadow-purple-500/10 bg-black/40 backdrop-blur-content">
                    <form onSubmit={handleSearch}>
                      <div className="flex flex-col md:flex-row py-3 px-3 md:py-2 md:px-4">
                        {/* Main Search Input */}
                        <div className="relative flex-grow mb-2 md:mb-0 md:mr-3">
                          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/60" />
                          <input
                            type="text"
                            placeholder="Search events, topics, or locations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 bg-transparent border border-white/20 rounded-md pl-12 pr-4 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 transition-smooth text-sm leading-tight"
                          />
                        </div>
                        
                        {/* Filter Dropdowns */}
                        <div className="flex flex-col md:flex-row gap-y-2 md:gap-x-3">
                          {/* Event Type Filter */}
                          <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="h-10 bg-transparent border border-white/20 rounded-md px-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-400 text-sm leading-tight"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22white%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M7 10l5 5 5-5z%22/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', paddingRight: '28px' }}
                          >
                            <option value="All Types" className="bg-gray-900 text-white">All Types</option>
                            <option value="Conference" className="bg-gray-900 text-white">Conference</option>
                            <option value="Meetup" className="bg-gray-900 text-white">Meetup</option>
                            <option value="Workshop" className="bg-gray-900 text-white">Workshop</option>
                            <option value="Hackathon" className="bg-gray-900 text-white">Hackathon</option>
                            <option value="Networking" className="bg-gray-900 text-white">Networking</option>
                          </select>
                          
                          {/* Topics Filter */}
                          <select
                            value={eventLocation}
                            onChange={(e) => setEventLocation(e.target.value)}
                            className="h-10 bg-transparent border border-white/20 rounded-md px-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-400 text-sm leading-tight"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22white%22 viewBox=%220 0 24 24%22%3E%3Cpath d=%22M7 10l5 5 5-5z%22/%3E%3C/svg%3E")', backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', paddingRight: '28px' }}
                          >
                            <option value="Topic" className="bg-gray-900 text-white">Topic</option>
                            <option value="Tech" className="bg-gray-900 text-white">Tech</option>
                            <option value="Business" className="bg-gray-900 text-white">Business</option>
                            <option value="Design" className="bg-gray-900 text-white">Design</option>
                            <option value="Marketing" className="bg-gray-900 text-white">Marketing</option>
                            <option value="Finance" className="bg-gray-900 text-white">Finance</option>
                          </select>
                          
                          {/* Search Button */}
                          <Button
                            type="submit"
                            className="h-10 rounded-md border-0 px-4 text-white font-medium text-sm flex items-center justify-center bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:shadow-purple-500/25"
                          >
                            Find Events
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <motion.div className="h-[60px] w-[280px] invisible opacity-0" aria-hidden="true">
                    {/* Invisible placeholder for "Get Personalized Events" button */}
                  </motion.div>

                  <motion.div className="h-[60px] w-[200px] invisible opacity-0" aria-hidden="true">
                    {/* Invisible placeholder for "Explore Events" button */}
                  </motion.div>
                </motion.div>

                {/* Removed Feature Pills Section */}
              </motion.div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="md:hidden relative z-10 px-6 mb-8">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 backdrop-blur-content border border-white/20 rounded-xl pl-11 pr-4 py-3 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 transition-smooth"
              />
            </form>
          </div>

          {/* Events Section Removed */}
        </>
      )}

      {/* Modals */}
      {/* <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} /> */}
      {showQuiz && <PersonalizationQuiz onComplete={handleQuizComplete} onBack={() => setShowQuiz(false)} />}
      {showResults && quizData && (
        <QuizResults quizData={quizData} onStartOver={handleStartOver} />
      )}
      {/* Removed Referral Program modal */}
    </div>
  )
}

export default function KairosLanding() {
  return (
    <AuthProvider>
      <KairosLandingContent />
    </AuthProvider>
  )
}
