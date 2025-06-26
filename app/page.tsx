"use client"

import type React from "react"

import { motion, AnimatePresence } from "framer-motion"
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

function KairosLandingContent() {
  const [showQuiz, setShowQuiz] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [quizData, setQuizData] = useState(null)
  const [showReferralProgram, setShowReferralProgram] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  // const [showSignIn, setShowSignIn] = useState(false)
  const [activeTab, setActiveTab] = useState<"discover" | "upload">("discover")
  const [showContact, setShowContact] = useState(false)
  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText("connect.kairos.ph@gmail.com")
    alert("Email copied to clipboard! ✨")
  }

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
    setActiveTab("discover")
    const eventsSection = document.getElementById("events")
    if (eventsSection) {
      eventsSection.scrollIntoView({ behavior: "smooth" })
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
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <span className="text-2xl font-bold tracking-tight text-shadow-subtle">KAIROS</span>
        </motion.div>

        {/* Integrated Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
            <input
              type="text"
              placeholder="Search events, topics, or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 backdrop-blur-content border border-white/20 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-white/60 focus:outline-none focus:border-purple-400 transition-smooth text-sm"
            />
            {searchQuery && (
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 h-8 px-3 text-xs"
              >
                Search
              </Button>
            )}
          </form>
        </div>

        <div className="flex items-center space-x-4 relative">
          {/* Contact Us */}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowContact(true)}
              className="px-4 py-2 text-sm"
            >
              Contact Us
            </Button>

          {/* Navigation Tabs */}
          <div className="hidden lg:flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab("discover")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "discover"
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Discover
            </button>
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

      {/* Global Contact Modal */}
      {showContact && (
        <AnimatePresence>
          <motion.div
            key="contactModal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowContact(false)}
          >
            <motion.div
              className="bg-gray-900 rounded-2xl border border-white/10 p-8 w-full max-w-lg text-center flex flex-col items-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Let’s Connect</h2>
              <p className="text-white/80 mb-6">Have questions or want to request a live demo? We’d love to chat.</p>
              <button
                onClick={handleCopyEmail}
                className="mx-auto mb-4 text-purple-400 hover:text-purple-300 underline select-all text-lg"
              >
                connect.kairos.ph@gmail.com
              </button>
              <Button className="mt-2" size="sm" onClick={() => setShowContact(false)}>Close</Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}


      {/* Mobile Navigation Tabs */}
      {isAuthenticated && (
        <div className="lg:hidden relative z-40 px-6 py-3 bg-black/10 backdrop-blur-sm border-b border-white/5">
          <div className="flex items-center space-x-1 bg-black/20 backdrop-blur-sm rounded-xl p-1">
            <button
              onClick={() => setActiveTab("discover")}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === "discover"
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              Discover
            </button>
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
                  className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 tracking-tight text-shadow-subtle"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  The all-in-one <span className="animate-gradient-text-subtle">startup events</span> platform for
                  founders
                </motion.h1>

                <motion.p
                  className="text-lg md:text-xl text-white/95 mb-8 max-w-3xl mx-auto leading-relaxed font-light backdrop-blur-content bg-black/20 rounded-2xl p-6 border border-white/10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  Connect with startup events that count. KAIROS creates the difference with smart recommendations,
                  premium networking opportunities, and curated experiences.
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-purple-500/20 transition-smooth group border-0 glow-purple-subtle backdrop-blur-sm"
                      onClick={handleQuizStart}
                    >
                      Get Personalized Events
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outline"
                      size="lg"
                      className="bg-black/25 backdrop-blur-content border-white/25 text-white hover:bg-white/15 px-8 py-4 text-lg font-semibold transition-smooth glow-blue-subtle"
                      onClick={handleJoinCommunity}
                    >
                      Explore Events
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Feature Pills */}
                <motion.div
                  className="flex flex-wrap justify-center gap-3"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                >
                  {[
                    { icon: Target, label: "AI Matching" },
                    { icon: Users, label: "Premium Network" },
                    { icon: Calendar, label: "Smart Calendar" },
                    { icon: TrendingUp, label: "Growth Events" },
                  ].map((feature, index) => (
                    <motion.div
                      key={feature.label}
                      className="flex items-center space-x-2 bg-black/25 backdrop-blur-content border border-white/15 rounded-full px-4 py-2 text-sm font-medium glow-purple-subtle transition-smooth"
                      whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.35)" }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                    >
                      <feature.icon className="h-4 w-4 text-purple-300" />
                      <span>{feature.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
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

          {/* Events Section with Search Query */}
          {!showQuiz && !showResults && <EventsSection searchQuery={searchQuery} />}
        </>
      )}

      {/* Promotional Button - Floating */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-6 py-3 font-semibold shadow-2xl hover:shadow-yellow-500/20 transition-smooth group border-0 relative overflow-hidden rounded-full backdrop-blur-content"
          onClick={() => setShowReferralProgram(true)}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/15 to-orange-400/15 animate-pulse" />
          <span className="relative flex items-center">
            🏆 Win Consultation
            <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full animate-bounce">NEW</span>
          </span>
        </Button>
      </motion.div>

      {/* Modals */}
      {/* <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} /> */}
      {showQuiz && <PersonalizationQuiz onComplete={handleQuizComplete} onBack={() => setShowQuiz(false)} />}
      {showResults && quizData && (
        <QuizResults quizData={quizData} onStartOver={handleStartOver} />
      )}
      <ReferralProgram isOpen={showReferralProgram} onClose={() => setShowReferralProgram(false)} />
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
