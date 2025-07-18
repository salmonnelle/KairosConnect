"use client"

import { motion } from "@/lib/animation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import WaitlistModal from "./waitlist-modal"
import DynamicGradientBackground from "./dynamic-gradient-background"
import {
  Calendar,
  MapPin,
  Users,
  Home,
  ArrowRight,
  Star,

  Sparkles,
  X,
  Trophy,

  Target,
  TrendingUp,
  Zap,
  Brain,
  Clock,
  Award,
  CheckCircle,
  UserPlus,
  Mail,
  Bell,
  Heart,


} from "lucide-react"
import RecommendationEngine from "./recommendation-engine"
import { useAuth } from "./auth-context"

interface QuizData {
  role: string
}

interface QuizResultsProps {
  quizData: QuizData
  onStartOver: () => void
  onSignUp?: () => void
}

export default function QuizResults({ quizData, onStartOver, onSignUp }: QuizResultsProps) {
  const { isAuthenticated } = useAuth()

  // Initialize recommendation engine
  const recommendationEngine = new RecommendationEngine(quizData)
  const personalizedEvents = recommendationEngine.getRecommendations(6)
  const insights = recommendationEngine.getRoleInsights()

  const getRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      founder: "Founder/Co-founder",
      investor: "Investor/VC",
      employee: "Startup Employee",
      corporate: "Corporate Innovation",
      enthusiast: "Startup Enthusiast",
    }
    return roleMap[role] || role
  }

  const getRoleEmoji = (role: string) => {
    const emojiMap: { [key: string]: string } = {
      founder: "🚀",
      investor: "💰",
      employee: "👨‍💻",
      corporate: "🏢",
      enthusiast: "⭐",
    }
    return emojiMap[role] || "🎯"
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-emerald-400 bg-emerald-500/20 border-emerald-500/30"
    if (score >= 80) return "text-blue-400 bg-blue-500/20 border-blue-500/30"
    if (score >= 70) return "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
    return "text-orange-400 bg-orange-500/20 border-orange-500/30"
  }

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return "Perfect Match"
    if (score >= 80) return "Excellent Match"
    if (score >= 70) return "Good Match"
    return "Potential Match"
  }

  const avgMatchScore = Math.round(
    personalizedEvents.reduce((sum, event) => sum + event.matchScore, 0) / personalizedEvents.length,
  )

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xl z-50 overflow-y-auto">
      <DynamicGradientBackground />
      {/* Home Button */}
      <Link
        href="/"
        className="fixed top-6 right-16 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
        aria-label="Go to home page"
      >
        <Home className="h-5 w-5 text-white group-hover:text-white/80" />
      </Link>

      {/* Close Button - Resets quiz state */}
      <button
        onClick={onStartOver}
        className="fixed top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
        aria-label="Reset quiz"
      >
        <X className="h-5 w-5 text-white group-hover:text-white/80" />
      </button>
      
      {/* Circle with X Button - Back to Landing Page */}
      <Link
        href="/"
        className="fixed top-6 left-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
        aria-label="Return to landing page"
        onClick={(e) => {
          e.preventDefault();
          window.location.href = '/';
        }}
      >
        <X className="h-5 w-5 text-white group-hover:text-white/80" />
      </Link>

      <div className="min-h-screen p-4 pt-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header with Animation */}
          <motion.div
            className="text-center mb-6 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 text-center">
              <div>
                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-white mb-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Your AI-Powered Recommendations
                </motion.h1>
                <motion.p
                  className="text-white/70 text-lg flex items-center justify-center"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <span className="text-2xl mr-2">{getRoleEmoji(quizData.role)}</span>
                  Curated for <span className="text-purple-400 font-semibold ml-1">{getRoleLabel(quizData.role)}</span>
                </motion.p>
              </div>
            </div>

            {/* Enhanced Insights Cards */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-br from-purple-600/30 to-blue-600/30 border-purple-300/50 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 hover:border-purple-300/70">
                  <CardContent className="p-4 text-center bg-black/40 backdrop-blur-md border-t border-purple-200/20">
                    <div className="p-4 bg-purple-400/40 rounded-full w-fit mx-auto mb-4 border-2 border-purple-100/60 shadow-lg">
                      <Target className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-white font-black mb-3 text-lg drop-shadow-md">Your Profile</h3>
                    <p className="text-white font-semibold leading-relaxed drop-shadow-sm">
                      {insights.roleDescription}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 border-green-300/50 backdrop-blur-sm hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 hover:border-green-300/70">
                  <CardContent className="p-4 text-center bg-black/40 backdrop-blur-md border-t border-green-200/20">
                    <div className="p-4 bg-green-400/40 rounded-full w-fit mx-auto mb-4 border-2 border-green-100/60 shadow-lg">
                      <Brain className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-white font-black mb-3 text-lg drop-shadow-md">AI Strategy</h3>
                    <p className="text-white font-semibold leading-relaxed drop-shadow-sm">
                      {insights.recommendationStrategy}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <Card className="bg-gradient-to-br from-yellow-600/30 to-orange-600/30 border-yellow-300/50 backdrop-blur-sm hover:shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 hover:border-yellow-300/70">
                  <CardContent className="p-4 text-center bg-black/40 backdrop-blur-md border-t border-yellow-200/20">
                    <div className="p-4 bg-yellow-400/40 rounded-full w-fit mx-auto mb-4 border-2 border-yellow-100/60 shadow-lg">
                      <Trophy className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                    <h3 className="text-white font-black mb-3 text-lg drop-shadow-md">Key Benefits</h3>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {insights.topBenefits.map((benefit) => (
                        <Badge
                          key={benefit}
                          variant="outline"
                          className="text-xs bg-yellow-300/30 border-yellow-100/70 text-white hover:bg-yellow-300/40 transition-colors font-bold drop-shadow-sm"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Enhanced Stats Section */}
            <motion.div
              className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-white/10 shadow-2xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-emerald-400 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                  >
                    {avgMatchScore}%
                  </motion.div>
                  <p className="text-white/70 text-sm font-medium">Average Match Score</p>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <motion.div
                      className="bg-gradient-to-r from-emerald-500 to-green-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${avgMatchScore}%` }}
                      transition={{ delay: 1, duration: 1 }}
                    />
                  </div>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-blue-400 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.5, ease: "easeOut" }}
                  >
                    {personalizedEvents.length}
                  </motion.div>
                  <p className="text-white/70 text-sm font-medium">Curated Events</p>
                  <div className="flex justify-center mt-2">
                    {Array.from({ length: personalizedEvents.length }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-400 rounded-full mx-0.5"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1.1 + i * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <motion.div
                    className="text-4xl font-bold text-purple-400 mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
                  >
                    {personalizedEvents.filter((event) => event.matchScore >= 80).length}
                  </motion.div>
                  <p className="text-white/70 text-sm font-medium">High Matches</p>
                  <div className="flex justify-center mt-2 space-x-1">
                    <Star className="h-4 w-4 text-purple-400 fill-current" />
                    <Star className="h-4 w-4 text-purple-400 fill-current" />
                    <Star className="h-4 w-4 text-purple-400 fill-current" />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Compact Event Cards Section */}
          <div className="space-y-8 mb-12">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-yellow-400 mr-3 animate-pulse" />
                Perfect Events for You
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto text-lg">
                Each event is scored based on how well it matches your role and interests. Higher scores mean better
                alignment with your goals.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {personalizedEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-white/30 hover:border-purple-400/60 transition-all duration-500 overflow-hidden h-full shadow-2xl hover:shadow-purple-500/30 relative hover:from-gray-800/90 hover:to-gray-700/90">
                    {/* Header with Image and Badges */}
                    <div className="relative h-48">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                        <motion.div
                          className={`px-3 py-1 rounded-full border backdrop-blur-sm ${getMatchScoreColor(event.matchScore)} shadow-lg text-xs font-bold`}
                          whileHover={{ scale: 1.05 }}
                        >
                          {event.matchScore}% Match
                        </motion.div>
                        <Badge
                          className={`${
                            event.price === "Free"
                              ? "bg-emerald-500/90 text-white border-0"
                              : "bg-purple-500/90 text-white border-0"
                          } backdrop-blur-sm font-semibold text-xs`}
                        >
                          {event.price === "Free" ? "FREE" : event.priceAmount}
                        </Badge>
                      </div>

                      {/* Bottom Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                        <div
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getMatchScoreColor(event.matchScore)} backdrop-blur-sm`}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {getMatchScoreLabel(event.matchScore)}
                        </div>
                        <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-white text-xs font-medium">{event.rating}</span>
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-4 bg-black/60 backdrop-blur-md border-t-2 border-white/20">
                      {/* Event Title and Description */}
                      <div className="mb-4">
                        <h3 className="text-xl font-black text-white mb-3 line-clamp-2 group-hover:text-purple-100 transition-colors leading-tight drop-shadow-lg">
                          {event.title}
                        </h3>
                        <p className="text-white font-semibold leading-relaxed line-clamp-2 drop-shadow-sm">
                          {event.description}
                        </p>
                      </div>

                      {/* Key Event Details - Compact Grid */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-white bg-white/15 rounded-lg p-3 border border-white/20">
                          <div className="p-2 bg-purple-400/50 rounded-lg mr-3 border-2 border-purple-100/50 shadow-md">
                            <Calendar className="h-4 w-4 text-white drop-shadow-sm" />
                          </div>
                          <span className="truncate font-bold drop-shadow-sm">{event.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-white bg-white/15 rounded-lg p-3 border border-white/20">
                          <div className="p-2 bg-blue-400/50 rounded-lg mr-3 border-2 border-blue-100/50 shadow-md">
                            <MapPin className="h-4 w-4 text-white drop-shadow-sm" />
                          </div>
                          <span className="truncate font-bold drop-shadow-sm">{event.location}</span>
                        </div>
                        <div className="flex items-center text-sm text-white bg-white/15 rounded-lg p-3 border border-white/20">
                          <div className="p-2 bg-green-400/50 rounded-lg mr-3 border-2 border-green-100/50 shadow-md">
                            <Users className="h-4 w-4 text-white drop-shadow-sm" />
                          </div>
                          <span className="font-bold drop-shadow-sm">{event.attendees} attendees</span>
                        </div>
                      </div>

                      {/* Personalized Tags - Compact */}
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {event.personalizedTags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs bg-purple-300/30 border-purple-100/60 text-white hover:bg-purple-300/40 transition-all duration-300 font-bold drop-shadow-sm"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* AI Insight - Compact */}
                      <div className="bg-emerald-400/30 border-2 border-emerald-100/50 rounded-lg p-4 mb-4 backdrop-blur-sm shadow-lg">
                        <div className="flex items-start space-x-3">
                          <Brain className="h-5 w-5 text-white flex-shrink-0 mt-0.5 drop-shadow-lg" />
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-black text-xs mb-2 uppercase tracking-wide drop-shadow-md">
                              AI Insight
                            </p>
                            <p className="text-white text-sm leading-relaxed line-clamp-2 font-bold drop-shadow-sm">
                              {event.matchReason}
                            </p>
                          </div>
                          <div className="text-center flex-shrink-0">
                            <div className="w-10 h-10 bg-emerald-300/40 rounded-lg flex items-center justify-center border-2 border-emerald-100/60 shadow-md">
                              <span className="text-white font-black text-sm drop-shadow-sm">{event.matchScore}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Special Features - Compact */}
                      <div className="mb-5">
                        <p className="text-white text-sm font-black mb-3 flex items-center drop-shadow-md">
                          <Award className="h-4 w-4 mr-2 text-yellow-200 drop-shadow-sm" />
                          What's Included:
                        </p>
                        <div className="space-y-2">
                          {event.specialFeatures.slice(0, 2).map((feature, idx) => (
                            <div
                              key={idx}
                              className="flex items-center text-sm text-white bg-white/15 rounded-lg p-3 border border-white/20"
                            >
                              <div className="w-3 h-3 bg-gradient-to-r from-purple-200 to-blue-200 rounded-full mr-3 flex-shrink-0 shadow-sm" />
                              <span className="line-clamp-1 font-bold drop-shadow-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Button */}
                      {(() => {
                        const url = (event as any).url as string | undefined
                        const hasLink = !!url && url.startsWith("http")
                        return (
                          <Button
                            asChild={hasLink}
                            disabled={!hasLink}
                            size="sm"
                            className={`flex-1 h-9 font-bold text-sm rounded-md ${hasLink ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white shadow-lg hover:shadow-purple-500/25" : "bg-gray-500/40 text-white/60 cursor-not-allowed"}`}
                          >
                            {hasLink ? (
                              <a href={url} target="_blank" rel="noopener noreferrer">
                                Visit Event Page
                              </a>
                            ) : (
                              "No Link Available"
                            )}
                          </Button>
                        )
                      })()}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enhanced Call-to-Action Section */}
          <motion.div
            className="text-center space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Enhanced Stats Grid */}
            <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-12">
              {[
                {
                  icon: TrendingUp,
                  value: personalizedEvents.filter((e) => e.matchScore >= 90).length,
                  label: "Perfect Matches",
                  color: "text-emerald-400",
                  bg: "bg-emerald-500/10",
                },
                {
                  icon: Clock,
                  value: personalizedEvents.filter((e) => e.price === "Free").length,
                  label: "Free Events",
                  color: "text-blue-400",
                  bg: "bg-blue-500/10",
                },
                {
                  icon: Zap,
                  value: personalizedEvents.filter((e) => e.virtualOption).length,
                  label: "Virtual Options",
                  color: "text-yellow-400",
                  bg: "bg-yellow-500/10",
                },
                {
                  icon: Users,
                  value: Math.round(
                    personalizedEvents.reduce((sum, e) => sum + e.attendees, 0) / personalizedEvents.length,
                  ),
                  label: "Avg Attendees",
                  color: "text-purple-400",
                  bg: "bg-purple-500/10",
                },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className={`${stat.bg} backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ y: -2 }}
                >
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                  <div className={`text-2xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-white/60 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Enhanced Main CTA */}
            {isAuthenticated ? (
              <motion.div
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-white/20 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-yellow-400 mr-3 animate-pulse" />
                  Your Recommendations Are Ready!
                </h3>
                <p className="text-white/70 mb-8 text-lg max-w-2xl mx-auto">
                  These events are perfectly matched to your profile. Start connecting with your startup community today
                  and unlock new opportunities!
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200 hover:scale-105"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Explore All Events
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onStartOver}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-200"
                  >
                    Retake Quiz
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-8 max-w-4xl mx-auto border border-purple-400/30 shadow-2xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 }}
              >
                <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
                  <UserPlus className="h-8 w-8 text-purple-400 mr-3" />
                  Want More Personalized Recommendations?
                </h3>
                <p className="text-white/70 mb-8 text-lg max-w-2xl mx-auto">
                  Create a free KAIROS account to get ongoing personalized event recommendations, save your favorites,
                  and never miss the perfect networking opportunity.
                </p>

                {/* Enhanced Benefits Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8 justify-center">
                  {[
                    {
                      icon: Bell,
                      title: "Smart Notifications",
                      description: "Get notified about new events that match your profile",
                      color: "text-blue-400",
                      bg: "bg-blue-500/10",
                    },
                    {
                      icon: Mail,
                      title: "Weekly Digest",
                      description: "Receive curated event recommendations via email",
                      color: "text-green-400",
                      bg: "bg-green-500/10",
                    },
                  ].map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      className={`text-center p-6 ${benefit.bg} rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                      whileHover={{ y: -2, scale: 1.02 }}
                    >
                      <benefit.icon className={`h-10 w-10 ${benefit.color} mx-auto mb-3`} />
                      <h4 className="text-white font-semibold mb-2">{benefit.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <WaitlistModal />
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={onStartOver}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 text-lg font-medium hover:scale-105 transition-all duration-200"
                  >
                    Retake Quiz
                  </Button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-white/50 text-sm flex items-center justify-center">
                    <Heart className="h-4 w-4 mr-2 text-red-400" />
                    Your recommendations will get even better as we learn your preferences
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
