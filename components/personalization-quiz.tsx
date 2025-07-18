"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "@/lib/animation";
import { Button } from "@/components/ui/button"
import { ArrowRight, CheckCircle, Users, Lightbulb, TrendingUp, Building, Rocket, X, Sparkles } from "lucide-react"

interface QuizData {
  role: string
}

interface PersonalizationQuizProps {
  onComplete: (data: QuizData) => void
  onBack: () => void
}

export default function PersonalizationQuiz({ onComplete, onBack }: PersonalizationQuizProps) {
  const [selectedRole, setSelectedRole] = useState("")

  const roleOptions = [
    {
      value: "founder",
      label: "Founder/Co-founder",
      icon: Rocket,
      description: "Building or leading a startup",
      color: "from-purple-500 to-pink-500",
      bgGlow: "bg-purple-500/10",
    },
    {
      value: "investor",
      label: "Investor/VC",
      icon: TrendingUp,
      description: "Investing in startups and scale-ups",
      color: "from-green-500 to-emerald-500",
      bgGlow: "bg-green-500/10",
    },
    {
      value: "employee",
      label: "Startup Employee",
      icon: Users,
      description: "Working at an early-stage company",
      color: "from-blue-500 to-cyan-500",
      bgGlow: "bg-blue-500/10",
    },
    {
      value: "corporate",
      label: "Corporate Innovation",
      icon: Building,
      description: "Innovation within established companies",
      color: "from-orange-500 to-red-500",
      bgGlow: "bg-orange-500/10",
    },
    {
      value: "enthusiast",
      label: "Startup Enthusiast",
      icon: Lightbulb,
      description: "Passionate about the startup world",
      color: "from-yellow-500 to-orange-500",
      bgGlow: "bg-yellow-500/10",
    },
  ]

  const handleRoleSelect = (value: string) => {
    setSelectedRole(value)
  }

  const handleSubmit = () => {
    if (selectedRole) {
      onComplete({ role: selectedRole })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
      {/* Close Button */}
      <button
        onClick={onBack}
        className="absolute top-6 right-6 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 group"
      >
        <X className="h-5 w-5 text-white group-hover:text-white/80" />
      </button>

      <div className="w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Question Header - Updated as requested */}
            <div className="text-center mb-12">
              <motion.div
                className="flex items-center justify-center mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl mr-4 shadow-lg shadow-purple-500/25">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-bold text-white mb-1">Get Personalized Recommendations</h1>
                  <p className="text-white/70">Just one quick question to get started</p>
                </div>
              </motion.div>

              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                What kind of user are you?
              </motion.h2>
              <motion.p
                className="text-lg text-white/80 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Tell us about yourself so we can find the perfect events for you
              </motion.p>
            </div>

            {/* Role Options - Enhanced Design */}
            <div className="grid gap-4 md:gap-6 mb-8 max-w-3xl mx-auto">
              {roleOptions.map((option, index) => {
                const Icon = option.icon
                const selected = selectedRole === option.value

                return (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <button
                      onClick={() => handleRoleSelect(option.value)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left group relative overflow-hidden ${
                        selected
                          ? "border-purple-400 bg-white/15 shadow-xl shadow-purple-500/20 transform scale-[1.02]"
                          : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10 hover:shadow-lg"
                      }`}
                    >
                      {/* Background Gradient for Selected */}
                      {selected && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${option.color} opacity-10 rounded-2xl`} />
                      )}

                      {/* Subtle background glow */}
                      <div
                        className={`absolute inset-0 ${option.bgGlow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                      />

                      <div className="relative flex items-start space-x-4">
                        {/* Icon */}
                        <div
                          className={`flex-shrink-0 p-4 rounded-xl transition-all duration-300 ${
                            selected
                              ? `bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-110`
                              : "bg-white/10 text-white/70 group-hover:bg-white/20 group-hover:text-white group-hover:scale-105"
                          }`}
                        >
                          <Icon className="h-7 w-7" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="text-xl font-semibold text-white group-hover:text-white/90 transition-colors">
                              {option.label}
                            </h3>
                            {selected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.3 }}
                              >
                                <CheckCircle className="h-6 w-6 text-purple-400 flex-shrink-0" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-white/70 leading-relaxed group-hover:text-white/80 transition-colors">
                            {option.description}
                          </p>
                        </div>
                      </div>

                      {/* Selection indicator */}
                      {selected && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-b-2xl"
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Continue Button - Enhanced */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={!selectedRole}
                className={`px-12 py-4 text-lg font-semibold transition-all duration-300 shadow-lg ${
                  selectedRole
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 hover:shadow-purple-500/25 hover:scale-105"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
                size="lg"
              >
                {selectedRole ? "Get My Recommendations" : "Select Your Role"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Quick Info - Enhanced */}
            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1 }}
            >
              <div className="inline-flex items-center space-x-2 text-white/50 text-sm bg-white/5 rounded-full px-6 py-3 border border-white/10">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>⚡ Get instant recommendations in seconds</span>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
