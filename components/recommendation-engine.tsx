"use client"
import eventsData from "@/lib/events.json"

// Events generated from CSV files (see scripts/convert-events.ts)
const csvEvents = eventsData as Event[]

interface QuizData {
  role: string
}

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  attendees: number
  rating: number
  category: string
  price: "Free" | "Paid"
  priceAmount?: string
  image: string
  specialFeatures: string[]
  tags: string[]
  featured?: boolean
  trending?: boolean
  urgent?: boolean
  // Enhanced metadata for role-based personalization
  targetRoles: string[]
  primaryBenefit: string
  networkingLevel: "low" | "medium" | "high"
  learningIntensity: "light" | "moderate" | "intensive"
  timeCommitment: "short" | "medium" | "long"
  virtualOption: boolean
  roleSpecificValue: { [key: string]: string }
}

// Comprehensive event database optimized for role-based matching
const eventDatabase: Event[] = [
  {
    id: 1,
    title: "AI Founders Summit 2024",
    description:
      "Connect with AI startup founders and learn about the latest trends in artificial intelligence. Discover funding opportunities and partnership possibilities with leading VCs.",
    date: "Mar 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "San Francisco, CA",
    attendees: 500,
    rating: 4.9,
    category: "ai",
    price: "Paid",
    priceAmount: "$299",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Top VCs as judges", "Gourmet lunch included", "1-on-1 mentor sessions"],
    tags: ["AI", "Funding", "Networking"],
    featured: true,
    trending: true,
    targetRoles: ["founder", "investor"],
    primaryBenefit: "Funding & Strategic Partnerships",
    networkingLevel: "high",
    learningIntensity: "intensive",
    timeCommitment: "long",
    virtualOption: false,
    roleSpecificValue: {
      founder: "Connect with VCs actively investing in AI startups",
      investor: "Discover the next generation of AI companies",
      employee: "Learn about AI career opportunities",
      corporate: "Explore AI partnerships for enterprise",
      enthusiast: "Deep dive into AI startup ecosystem",
    },
  },
  {
    id: 2,
    title: "48-Hour FinTech Hackathon",
    description:
      "Build the future of finance in this intensive hackathon. Teams will compete to create innovative financial solutions with mentorship from industry experts.",
    date: "Mar 22-24, 2024",
    time: "Friday 6 PM - Sunday 8 PM",
    location: "New York, NY",
    attendees: 200,
    rating: 4.8,
    category: "hackathons",
    price: "Free",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["$50K prize pool", "Free meals & coffee", "Industry mentor support"],
    tags: ["FinTech", "Competition", "Prizes"],
    featured: true,
    urgent: true,
    targetRoles: ["founder", "employee", "enthusiast"],
    primaryBenefit: "Hands-on Building & Prizes",
    networkingLevel: "high",
    learningIntensity: "intensive",
    timeCommitment: "long",
    virtualOption: false,
    roleSpecificValue: {
      founder: "Validate your fintech idea and win funding",
      employee: "Showcase your skills and find co-founders",
      enthusiast: "Learn by building real fintech solutions",
      investor: "Scout emerging fintech talent",
      corporate: "Discover innovative financial solutions",
    },
  },
  {
    id: 3,
    title: "Startup Networking Mixer",
    description:
      "Connect with fellow entrepreneurs, investors, and startup enthusiasts in a relaxed evening setting. Great opportunity to find co-founders, advisors, or your next big opportunity.",
    date: "Mar 25, 2024",
    time: "6:00 PM - 9:00 PM",
    location: "Los Angeles, CA",
    attendees: 150,
    rating: 4.6,
    category: "networking",
    price: "Free",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Open bar", "Speed networking sessions", "Investor pitch corner"],
    tags: ["Networking", "Investors", "Social"],
    targetRoles: ["founder", "investor", "enthusiast", "employee"],
    primaryBenefit: "Pure Networking & Connections",
    networkingLevel: "high",
    learningIntensity: "light",
    timeCommitment: "short",
    virtualOption: false,
    roleSpecificValue: {
      founder: "Find co-founders, advisors, and early customers",
      investor: "Meet promising entrepreneurs and deal flow",
      employee: "Connect with startup founders and teams",
      enthusiast: "Meet like-minded startup community members",
      corporate: "Explore startup partnership opportunities",
    },
  },
  {
    id: 4,
    title: "SaaS Growth Masterclass",
    description:
      "Learn proven strategies to scale your SaaS business from $0 to $10M ARR. Industry leaders will share their playbooks and answer your burning questions.",
    date: "Mar 20, 2024",
    time: "10:00 AM - 4:00 PM",
    location: "Virtual Event",
    attendees: 300,
    rating: 4.9,
    category: "saas",
    price: "Paid",
    priceAmount: "$199",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Unicorn founder speakers", "Interactive workshops", "Lifetime access to recordings"],
    tags: ["SaaS", "Growth", "Masterclass"],
    trending: true,
    targetRoles: ["founder", "employee", "corporate"],
    primaryBenefit: "Actionable Growth Strategies",
    networkingLevel: "medium",
    learningIntensity: "intensive",
    timeCommitment: "medium",
    virtualOption: true,
    roleSpecificValue: {
      founder: "Scale your SaaS from idea to $10M ARR",
      employee: "Learn growth tactics for your SaaS role",
      corporate: "Understand SaaS business models",
      investor: "Evaluate SaaS investment opportunities",
      enthusiast: "Master SaaS fundamentals",
    },
  },
  {
    id: 5,
    title: "Corporate Innovation Lab",
    description:
      "How large corporations can foster innovation and work with startups. Learn intrapreneurship strategies and startup partnership models.",
    date: "Apr 12, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Chicago, IL",
    attendees: 200,
    rating: 4.4,
    category: "corporate",
    price: "Paid",
    priceAmount: "$450",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Fortune 500 case studies", "Innovation frameworks", "Partnership templates"],
    tags: ["Corporate", "Innovation", "Partnerships"],
    targetRoles: ["corporate", "founder"],
    primaryBenefit: "Corporate-Startup Collaboration",
    networkingLevel: "high",
    learningIntensity: "intensive",
    timeCommitment: "long",
    virtualOption: false,
    roleSpecificValue: {
      corporate: "Build innovation programs and startup partnerships",
      founder: "Learn to work with enterprise clients",
      investor: "Understand corporate venture capital",
      employee: "Transition from corporate to startup",
      enthusiast: "Learn about corporate innovation",
    },
  },
  {
    id: 6,
    title: "Investor Demo Day",
    description:
      "Watch promising startups pitch to a panel of top-tier investors. Learn what VCs look for and network with the investment community.",
    date: "Apr 5, 2024",
    time: "2:00 PM - 6:00 PM",
    location: "Austin, TX",
    attendees: 250,
    rating: 4.7,
    category: "investor",
    price: "Free",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Live pitch feedback", "Investor Q&A", "Startup showcase"],
    tags: ["Pitching", "Investment", "Demo"],
    targetRoles: ["investor", "founder", "enthusiast"],
    primaryBenefit: "Investment Insights & Deal Flow",
    networkingLevel: "high",
    learningIntensity: "moderate",
    timeCommitment: "medium",
    virtualOption: false,
    roleSpecificValue: {
      investor: "Discover new investment opportunities",
      founder: "Learn what investors want to see",
      enthusiast: "Understand the investment process",
      employee: "See how startups pitch and scale",
      corporate: "Scout acquisition targets",
    },
  },
  {
    id: 7,
    title: "Startup Employee Career Fair",
    description:
      "Connect with fast-growing startups looking for talented employees. From engineers to marketers, find your next career opportunity.",
    date: "Apr 8, 2024",
    time: "11:00 AM - 4:00 PM",
    location: "Seattle, WA",
    attendees: 400,
    rating: 4.5,
    category: "careers",
    price: "Free",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["On-site interviews", "Resume reviews", "Startup culture talks"],
    tags: ["Jobs", "Careers", "Hiring"],
    targetRoles: ["employee", "enthusiast"],
    primaryBenefit: "Career Opportunities & Job Matching",
    networkingLevel: "high",
    learningIntensity: "light",
    timeCommitment: "medium",
    virtualOption: false,
    roleSpecificValue: {
      employee: "Find your next startup role",
      enthusiast: "Break into the startup world",
      founder: "Scout talent for your team",
      corporate: "Understand startup hiring practices",
      investor: "Meet teams from portfolio companies",
    },
  },
  {
    id: 8,
    title: "VibeCoding: Chill & Code",
    description:
      "A relaxed coding session with great music and good vibes. Perfect for developers who want to work on side projects while networking casually.",
    date: "Mar 18, 2024",
    time: "2:00 PM - 8:00 PM",
    location: "Austin, TX",
    attendees: 80,
    rating: 4.7,
    category: "vibecoding",
    price: "Free",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Live DJ sets", "Free snacks & drinks", "Coworking space access"],
    tags: ["Coding", "Music", "Casual"],
    featured: true,
    targetRoles: ["employee", "founder", "enthusiast"],
    primaryBenefit: "Casual Networking & Side Projects",
    networkingLevel: "medium",
    learningIntensity: "light",
    timeCommitment: "medium",
    virtualOption: false,
    roleSpecificValue: {
      employee: "Work on side projects with fellow developers",
      founder: "Find technical co-founders in a relaxed setting",
      enthusiast: "Learn coding in a fun environment",
      investor: "Meet technical talent informally",
      corporate: "Understand developer culture",
    },
  },
  {
    id: 9,
    title: "First-Time Founder Bootcamp",
    description:
      "Essential knowledge for new entrepreneurs. Learn the fundamentals of starting a company, from idea validation to building your first team.",
    date: "Apr 10, 2024",
    time: "10:00 AM - 3:00 PM",
    location: "Virtual Event",
    attendees: 100,
    rating: 4.5,
    category: "entrepreneurship",
    price: "Free",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Founder toolkit", "Mentor matching", "Resource library access"],
    tags: ["Entrepreneurship", "Basics", "Mentorship"],
    targetRoles: ["enthusiast", "founder", "employee"],
    primaryBenefit: "Entrepreneurship Fundamentals",
    networkingLevel: "medium",
    learningIntensity: "moderate",
    timeCommitment: "medium",
    virtualOption: true,
    roleSpecificValue: {
      enthusiast: "Learn how to start your first company",
      founder: "Master the fundamentals you might have missed",
      employee: "Understand what it takes to be a founder",
      corporate: "Learn entrepreneurial thinking",
      investor: "Understand the founder journey",
    },
  },
  {
    id: 10,
    title: "Startup Enthusiast Meetup",
    description:
      "Monthly gathering for startup enthusiasts to discuss trends, share ideas, and connect with the community. Perfect for those curious about startups.",
    date: "Apr 15, 2024",
    time: "7:00 PM - 9:00 PM",
    location: "Denver, CO",
    attendees: 60,
    rating: 4.3,
    category: "community",
    price: "Free",
    image: "/placeholder.svg?height=200&width=400",
    specialFeatures: ["Casual discussions", "Startup book club", "Community building"],
    tags: ["Community", "Discussion", "Learning"],
    targetRoles: ["enthusiast", "employee"],
    primaryBenefit: "Community & Learning",
    networkingLevel: "medium",
    learningIntensity: "light",
    timeCommitment: "short",
    virtualOption: false,
    roleSpecificValue: {
      enthusiast: "Connect with fellow startup lovers",
      employee: "Stay updated on startup trends",
      founder: "Share your journey with the community",
      corporate: "Understand startup culture",
      investor: "Connect with the broader ecosystem",
    },
  },
]

export class RecommendationEngine {
  private quizData: QuizData
  private events: Event[]

  constructor(quizData: QuizData, events: Event[] = csvEvents) {
    this.quizData = quizData
    this.events = events
  }

  // Calculate personalization score for each event based on role
  private calculateEventScore(event: Event): number {
    let score = 0

    // Primary role matching (60% weight)
    if (event.targetRoles.includes(this.quizData.role)) {
      score += 60
    } else if (event.targetRoles.length > 3) {
      // Events targeting many roles get partial credit
      score += 30
    }

    // Event quality factors (40% weight)
    // Rating bonus (15%)
    score += (event.rating - 4.0) * 15

    // Attendance size bonus (10%)
    if (event.attendees >= 200) score += 10
    else if (event.attendees >= 100) score += 7
    else if (event.attendees >= 50) score += 5

    // Special features bonus (10%)
    score += Math.min(event.specialFeatures.length * 2, 10)

    // Featured/trending bonus (5%)
    if (event.featured) score += 3
    if (event.trending) score += 2

    return Math.min(Math.round(score), 100)
  }

  // Generate role-specific match reason
  private generateMatchReason(event: Event): string {
    const roleSpecificValue = event.roleSpecificValue[this.quizData.role]
    if (roleSpecificValue) {
      return roleSpecificValue
    }

    // Fallback reasons based on role
    const fallbackReasons: { [key: string]: string } = {
      founder: "Great networking and learning opportunity for founders",
      investor: "Excellent for discovering investment opportunities",
      employee: "Perfect for career growth and skill development",
      corporate: "Ideal for understanding startup innovation",
      enthusiast: "Perfect introduction to the startup ecosystem",
    }

    return fallbackReasons[this.quizData.role] || "Relevant to your startup journey"
  }

  // Get personalized recommendations
  getRecommendations(
    limit = 6,
  ): Array<Event & { matchScore: number; matchReason: string; personalizedTags: string[] }> {
    const scoredEvents = this.events.map((event) => {
      const score = this.calculateEventScore(event)
      const matchReason = this.generateMatchReason(event)
      const personalizedTags = this.generatePersonalizedTags(event)

      return {
        ...event,
        matchScore: score,
        matchReason,
        personalizedTags,
      }
    })

    // Sort by score and return top recommendations
    return scoredEvents.sort((a, b) => b.matchScore - a.matchScore).slice(0, limit)
  }

  // Generate personalized tags based on user role
  private generatePersonalizedTags(event: Event): string[] {
    const tags: string[] = []

    // Add role-specific tags
    const roleMap: { [key: string]: string } = {
      founder: "👨‍💼 For Founders",
      investor: "💰 Investor Focus",
      employee: "🚀 Career Growth",
      corporate: "🏢 Enterprise",
      enthusiast: "🌟 Community",
    }

    if (event.targetRoles.includes(this.quizData.role)) {
      tags.push(roleMap[this.quizData.role])
    }

    // Add benefit-specific tags
    if (event.primaryBenefit.includes("Funding")) tags.push("💸 Funding")
    if (event.primaryBenefit.includes("Networking")) tags.push("🤝 Networking")
    if (event.primaryBenefit.includes("Learning")) tags.push("📚 Learning")
    if (event.primaryBenefit.includes("Career")) tags.push("📈 Career")

    // Add practical tags
    if (event.price === "Free") tags.push("🆓 Free")
    if (event.virtualOption) tags.push("💻 Virtual")
    if (event.timeCommitment === "short") tags.push("⚡ Quick")
    if (event.networkingLevel === "high") tags.push("🎯 High Impact")

    return tags.slice(0, 3)
  }

  // Get role-specific insights
  getRoleInsights(): {
    roleDescription: string
    recommendationStrategy: string
    topBenefits: string[]
  } {
    const roleInsights: {
      [key: string]: {
        description: string
        strategy: string
        benefits: string[]
      }
    } = {
      founder: {
        description: "Entrepreneur building or leading a startup",
        strategy: "Prioritizing funding opportunities, founder networking, and growth strategies",
        benefits: ["Funding Opportunities", "Founder Network", "Growth Strategies"],
      },
      investor: {
        description: "Professional investing in startups and scale-ups",
        strategy: "Focusing on deal flow, portfolio insights, and industry trends",
        benefits: ["Deal Flow", "Market Insights", "Portfolio Support"],
      },
      employee: {
        description: "Professional working at an early-stage company",
        strategy: "Emphasizing career growth, skill development, and networking",
        benefits: ["Career Growth", "Skill Building", "Professional Network"],
      },
      corporate: {
        description: "Innovation professional within established companies",
        strategy: "Highlighting startup partnerships, innovation strategies, and market trends",
        benefits: ["Innovation Insights", "Startup Partnerships", "Market Trends"],
      },
      enthusiast: {
        description: "Individual passionate about the startup ecosystem",
        strategy: "Curating learning experiences, community events, and ecosystem insights",
        benefits: ["Learning Opportunities", "Community Building", "Ecosystem Insights"],
      },
    }

    const insights = roleInsights[this.quizData.role] || roleInsights.enthusiast

    return {
      roleDescription: insights.description,
      recommendationStrategy: insights.strategy,
      topBenefits: insights.benefits,
    }
  }
}

export default RecommendationEngine
