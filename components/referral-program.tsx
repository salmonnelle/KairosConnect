"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "@/lib/animation";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Copy, Trophy, Users, Calendar, ExternalLink, Target, Zap } from "lucide-react"

interface ReferralProgramProps {
  isOpen: boolean
  onClose: () => void
}

export default function ReferralProgram({ isOpen, onClose }: ReferralProgramProps) {
  const [referralLink, setReferralLink] = useState("https://kairos.app/ref/your-unique-code")
  const [currentReferrals, setCurrentReferrals] = useState(0)
  const [daysLeft, setDaysLeft] = useState(15)
  const [hasGeneratedLink, setHasGeneratedLink] = useState(false)

  useEffect(() => {
    // Calculate days left in current month
    const now = new Date()
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    const calculatedDaysLeft = Math.ceil((lastDayOfMonth.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    setDaysLeft(calculatedDaysLeft)
  }, [])

  const generateReferralLink = () => {
    const userId = "USER" + Math.random().toString(36).substr(2, 9).toUpperCase()
    const newReferralLink = `https://kairos.app/ref/${userId}`
    setReferralLink(newReferralLink)
    setHasGeneratedLink(true)
  }

  const copyReferralLink = async () => {
    if (!hasGeneratedLink) {
      alert("Please generate your referral link first!")
      return
    }

    try {
      await navigator.clipboard.writeText(referralLink)
      alert("Referral link copied to clipboard! 📋")
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = referralLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      alert("Referral link copied to clipboard! 📋")
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 rounded-2xl" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
          >
            <X className="h-5 w-5 text-gray-300" />
          </button>

          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="text-2xl font-bold tracking-tight mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                KAIROS
              </motion.div>
              <motion.h1
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Win a Consultation
                <br />
                with Bowei
              </motion.h1>
              <motion.p
                className="text-gray-300 text-lg max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Refer 5 startup founders to Kairos and get entered into our monthly raffle for a chance to win a
                30-minute consultation with our Silicon Valley mentor.
              </motion.p>
            </div>

            {/* Steps */}
            <div className="space-y-6 mb-8">
              {[
                {
                  number: 1,
                  title: "Refer 5 Startup Founders",
                  description:
                    "Share your unique referral link with startup founders in your network. Each person who signs up and creates a Kairos account counts toward your goal.",
                  icon: Users,
                },
                {
                  number: 2,
                  title: "Get Automatically Entered",
                  description:
                    "Once 5 founders have successfully signed up through your link, you're automatically entered into the monthly raffle. No additional steps required!",
                  icon: Target,
                },
                {
                  number: 3,
                  title: "Monthly Drawing & Results",
                  description:
                    "At the end of each month, we'll randomly select one winner from all qualified participants. We'll send you an email with the results.",
                  icon: Calendar,
                },
              ].map((step, index) => (
                <motion.div
                  key={step.number}
                  className="flex items-start space-x-4 p-6 bg-gray-800/30 rounded-xl border border-gray-700/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <step.icon className="h-5 w-5 text-purple-400" />
                      <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Prize Section */}
            <motion.div
              className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-6 mb-8 border border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-center mb-6">
                <Trophy className="h-12 w-12 text-yellow-400 mx-auto mb-3" />
                <h2 className="text-2xl font-bold text-purple-400 mb-2">The Prize</h2>
                <h3 className="text-xl font-semibold text-blue-400 mb-4">Meet Prof. Bowei Gai</h3>
              </div>

              <div className="space-y-4 text-sm text-gray-300">
                <div>
                  <strong className="text-purple-400">Silicon Valley Serial Entrepreneur:</strong> Bowei founded
                  CardMunch, a mobile business card transcription service that he sold to LinkedIn in 2011 for 7
                  figures. He previously worked at tech giants including Apple, Oracle, and AMD.
                </div>
                <div>
                  <strong className="text-blue-400">Global Startup Expert:</strong> Creator of the World Startup Report,
                  Bowei traveled to 29 countries documenting startup ecosystems worldwide. His reports became the
                  most-viewed startup content globally.
                </div>
                <div>
                  <strong className="text-green-400">Elite University Connector:</strong> Bowei organized the historic
                  Big 3 Startup Showdown, bringing together students from UP, Ateneo, and La Salle.{" "}
                  <a
                    href="https://mb.com.ph/2025/05/19/filipino-students-from-top-universities-battle-it-out-in-big-3-startup-showdown"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline inline-flex items-center"
                  >
                    Read the full story <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <p className="text-gray-300 text-sm">
                  <strong className="text-white">Your 30-minute consultation includes:</strong> Personalized startup
                  strategy, fundraising guidance, Silicon Valley insights, and direct feedback from someone who's built,
                  scaled, and successfully exited companies. This level of mentorship typically costs $500+/hour—win it
                  through referrals.
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-3 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="bg-gray-800/30 border-gray-700/50 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-400">{currentReferrals}</div>
                  <div className="text-xs text-gray-400">Your Referrals</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/30 border-gray-700/50 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-400">5</div>
                  <div className="text-xs text-gray-400">Needed to Enter</div>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/30 border-gray-700/50 text-center">
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-400">{daysLeft}</div>
                  <div className="text-xs text-gray-400">Days Left This Month</div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <div className="max-w-md mx-auto">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="w-full p-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white text-sm"
                  placeholder="Your referral link will appear here"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={copyReferralLink}
                  variant="outline"
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Referral Link
                </Button>
                <Button
                  onClick={generateReferralLink}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Get My Referral Link
                </Button>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-700/50">
              <p className="text-gray-400 text-xs">
                © 2025 Kairos. The referral program resets monthly. Terms and conditions apply.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
