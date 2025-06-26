"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  ImageIcon,
  Plus,
  X,
  FileText,
  Save,
  Eye,
  Mic,
  Link,
  Target,
  UserCheck,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface EventFormData {
  eventName: string
  date: string
  location: string
  focus: string
  cost: "free" | "paid"
  costAmount: string
  speakers: string[]
  url: string
  expectedAttendees: number
  bestFor: string
  attendeeProfile: string
  description: string
  image: string
}

interface ValidationErrors {
  [key: string]: string
}

export default function EventUpload() {
  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    date: "",
    location: "",
    focus: "",
    cost: "free",
    costAmount: "",
    speakers: [],
    url: "",
    expectedAttendees: 50,
    bestFor: "",
    attendeeProfile: "",
    description: "",
    image: "",
  })

  const [newSpeaker, setNewSpeaker] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const focusOptions = [
    { value: "workshop", label: "Workshop" },
    { value: "conference", label: "Conference" },
    { value: "seminar", label: "Seminar" },
    { value: "networking", label: "Networking Event" },
    { value: "hackathon", label: "Hackathon" },
    { value: "meetup", label: "Meetup" },
    { value: "webinar", label: "Webinar" },
    { value: "panel", label: "Panel Discussion" },
    { value: "demo", label: "Demo Day" },
    { value: "other", label: "Other" },
  ]

  const bestForOptions = [
    { value: "beginners", label: "Beginners" },
    { value: "intermediate", label: "Intermediate" },
    { value: "professionals", label: "Professionals" },
    { value: "experts", label: "Experts" },
    { value: "students", label: "Students" },
    { value: "entrepreneurs", label: "Entrepreneurs" },
    { value: "investors", label: "Investors" },
    { value: "all-levels", label: "All Levels" },
  ]

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const addSpeaker = () => {
    if (newSpeaker.trim() && !formData.speakers.includes(newSpeaker.trim())) {
      setFormData((prev) => ({
        ...prev,
        speakers: [...prev.speakers, newSpeaker.trim()],
      }))
      setNewSpeaker("")
    }
  }

  const removeSpeaker = (speakerToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      speakers: prev.speakers.filter((speaker) => speaker !== speakerToRemove),
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}

    // Required field validation
    if (!formData.eventName.trim()) {
      newErrors.eventName = "Event name is required"
    } else if (formData.eventName.length < 3) {
      newErrors.eventName = "Event name must be at least 3 characters"
    } else if (formData.eventName.length > 100) {
      newErrors.eventName = "Event name must be less than 100 characters"
    }

    if (!formData.date) {
      newErrors.date = "Event date is required"
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = "Event date cannot be in the past"
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required"
    } else if (formData.location.length < 3) {
      newErrors.location = "Location must be at least 3 characters"
    }

    if (!formData.focus) {
      newErrors.focus = "Event focus is required"
    }

    if (formData.cost === "paid") {
      if (!formData.costAmount || Number.parseFloat(formData.costAmount) <= 0) {
        newErrors.costAmount = "Valid cost amount is required for paid events"
      } else if (Number.parseFloat(formData.costAmount) > 10000) {
        newErrors.costAmount = "Cost amount seems too high (max $10,000)"
      }
    }

    if (formData.url && !isValidUrl(formData.url)) {
      newErrors.url = "Please enter a valid URL (including http:// or https://)"
    }

    if (formData.expectedAttendees < 1) {
      newErrors.expectedAttendees = "Expected attendees must be at least 1"
    } else if (formData.expectedAttendees > 10000) {
      newErrors.expectedAttendees = "Expected attendees seems too high (max 10,000)"
    }

    if (!formData.bestFor) {
      newErrors.bestFor = "Target audience is required"
    }

    if (!formData.attendeeProfile.trim()) {
      newErrors.attendeeProfile = "Attendee profile is required"
    } else if (formData.attendeeProfile.length < 10) {
      newErrors.attendeeProfile = "Attendee profile must be at least 10 characters"
    } else if (formData.attendeeProfile.length > 500) {
      newErrors.attendeeProfile = "Attendee profile must be less than 500 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Event description is required"
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters"
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be less than 1000 characters"
    }

    if (formData.speakers.length === 0) {
      newErrors.speakers = "At least one speaker is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0]
      const element = document.querySelector(`[name="${firstErrorField}"]`)
      element?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store event in localStorage (in real app, this would be an API call)
      const existingEvents = JSON.parse(localStorage.getItem("user-events") || "[]")
      const newEvent = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        status: "published",
        rating: 4.5 + Math.random() * 0.5, // Mock rating
        attendees: Math.floor(formData.expectedAttendees * (0.3 + Math.random() * 0.4)), // Mock current attendees
      }

      existingEvents.push(newEvent)
      localStorage.setItem("user-events", JSON.stringify(existingEvents))

      setSubmitSuccess(true)

      // Reset form after success
      setTimeout(() => {
        setFormData({
          eventName: "",
          date: "",
          location: "",
          focus: "",
          cost: "free",
          costAmount: "",
          speakers: [],
          url: "",
          expectedAttendees: 50,
          bestFor: "",
          attendeeProfile: "",
          description: "",
          image: "",
        })
        setSubmitSuccess(false)
      }, 3000)
    } catch (error) {
      console.error("Event submission failed:", error)
      alert("Failed to create event. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitSuccess) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
          <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Event Created Successfully! 🎉</h2>
          <p className="text-white/80 mb-6">
            Your event has been published and is now visible on the events page. Attendees can discover and register for
            your event.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
          >
            Create Another Event
          </Button>
        </div>
      </div>
    )
  }

  if (previewMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Event Preview</h2>
          <Button
            onClick={() => setPreviewMode(false)}
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <FileText className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>
        </div>

        {/* Event Preview Card */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden">
          <div className="relative h-64 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            {formData.image ? (
              <img
                src={formData.image || "/placeholder.svg"}
                alt={formData.eventName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <ImageIcon className="h-16 w-16 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">No image uploaded</p>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge className={`${formData.cost === "free" ? "bg-green-500" : "bg-purple-500"} text-white`}>
                {formData.cost === "free" ? "FREE" : `$${formData.costAmount}`}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <Badge className="bg-orange-500 text-white">{formData.focus.toUpperCase()}</Badge>
            </div>
          </div>

          <CardContent className="p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-4">{formData.eventName || "Event Name"}</h3>
              <p className="text-white/80 leading-relaxed mb-4">
                {formData.description || "Event description will appear here..."}
              </p>
              <div className="flex items-center space-x-2 text-sm text-white/70">
                <Target className="h-4 w-4" />
                <span>Best for: {formData.bestFor || "Not specified"}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                <Calendar className="h-5 w-5 text-purple-400" />
                <span className="text-white/90">{formData.date || "Date not set"}</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                <MapPin className="h-5 w-5 text-blue-400" />
                <span className="text-white/90">{formData.location || "Location not set"}</span>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                <Users className="h-5 w-5 text-green-400" />
                <span className="text-white/90">{formData.expectedAttendees} expected attendees</span>
              </div>
              {formData.url && (
                <div className="flex items-center space-x-3 bg-white/5 rounded-xl p-3">
                  <Link className="h-5 w-5 text-orange-400" />
                  <a
                    href={formData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/90 hover:text-white underline"
                  >
                    Event Website
                  </a>
                </div>
              )}
            </div>

            {formData.speakers.length > 0 && (
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3 flex items-center">
                  <Mic className="h-4 w-4 mr-2" />
                  Speakers:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {formData.speakers.map((speaker) => (
                    <Badge key={speaker} variant="outline" className="bg-blue-500/10 border-blue-400/30 text-blue-300">
                      {speaker}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {formData.attendeeProfile && (
              <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Ideal Attendee Profile:
                </h4>
                <p className="text-white/80 text-sm">{formData.attendeeProfile}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Upload Your Event</h2>
        <p className="text-lg text-white/70 max-w-2xl mx-auto">
          Share your event with the KAIROS community. Fill out the form below with accurate details to help attendees
          discover and join your event.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <FileText className="mr-3 h-5 w-5 text-purple-400" />
              Event Details
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Event Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={(e) => handleInputChange("eventName", e.target.value)}
                  placeholder="Enter your event name"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors ${
                    errors.eventName ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-purple-400"
                  }`}
                  maxLength={100}
                />
                {errors.eventName && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.eventName}
                  </p>
                )}
                <p className="text-white/50 text-xs mt-1">{formData.eventName.length}/100 characters</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Event Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe your event, what attendees will learn, and why they should join..."
                  rows={4}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors resize-none ${
                    errors.description
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-purple-400"
                  }`}
                  maxLength={1000}
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.description}
                  </p>
                )}
                <p className="text-white/50 text-xs mt-1">{formData.description.length}/1000 characters</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Date <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                      errors.date ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-purple-400"
                    }`}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.date && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">
                    Focus <span className="text-red-400">*</span>
                  </label>
                  <select
                    name="focus"
                    value={formData.focus}
                    onChange={(e) => handleInputChange("focus", e.target.value)}
                    className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                      errors.focus ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-purple-400"
                    }`}
                  >
                    <option value="">Select event focus</option>
                    {focusOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-gray-800">
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.focus && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.focus}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Enter venue address or 'Virtual Event'"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors ${
                    errors.location ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-purple-400"
                  }`}
                />
                {errors.location && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Attendance */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <DollarSign className="mr-3 h-5 w-5 text-yellow-400" />
              Pricing & Attendance
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Cost <span className="text-red-400">*</span>
                </label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cost"
                      value="free"
                      checked={formData.cost === "free"}
                      onChange={(e) => handleInputChange("cost", e.target.value)}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600"
                    />
                    <span className="text-white">Free Event</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="cost"
                      value="paid"
                      checked={formData.cost === "paid"}
                      onChange={(e) => handleInputChange("cost", e.target.value)}
                      className="w-4 h-4 text-purple-600 bg-gray-800 border-gray-600"
                    />
                    <span className="text-white">Paid Event</span>
                  </label>
                </div>

                {formData.cost === "paid" && (
                  <div className="mt-4">
                    <input
                      type="number"
                      name="costAmount"
                      value={formData.costAmount}
                      onChange={(e) => handleInputChange("costAmount", e.target.value)}
                      placeholder="Enter price (USD)"
                      className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors ${
                        errors.costAmount
                          ? "border-red-400 focus:border-red-400"
                          : "border-white/20 focus:border-purple-400"
                      }`}
                      min="0"
                      max="10000"
                      step="0.01"
                    />
                    {errors.costAmount && (
                      <p className="text-red-400 text-sm mt-1 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.costAmount}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Expected Attendees <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="expectedAttendees"
                  value={formData.expectedAttendees}
                  onChange={(e) => handleInputChange("expectedAttendees", Number.parseInt(e.target.value))}
                  placeholder="50"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors ${
                    errors.expectedAttendees
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-purple-400"
                  }`}
                  min="1"
                  max="10000"
                />
                {errors.expectedAttendees && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.expectedAttendees}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Speakers */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Mic className="mr-3 h-5 w-5 text-blue-400" />
              Speakers <span className="text-red-400">*</span>
            </h3>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.speakers.map((speaker) => (
                  <Badge key={speaker} variant="outline" className="bg-blue-500/10 border-blue-400/30 text-blue-300">
                    {speaker}
                    <button type="button" onClick={() => removeSpeaker(speaker)} className="ml-2 hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSpeaker}
                  onChange={(e) => setNewSpeaker(e.target.value)}
                  placeholder="Add speaker name"
                  className="flex-1 bg-black/30 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpeaker())}
                />
                <Button
                  type="button"
                  onClick={addSpeaker}
                  size="sm"
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.speakers && (
                <p className="text-red-400 text-sm flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.speakers}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Target Audience */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Target className="mr-3 h-5 w-5 text-green-400" />
              Target Audience
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Best For <span className="text-red-400">*</span>
                </label>
                <select
                  name="bestFor"
                  value={formData.bestFor}
                  onChange={(e) => handleInputChange("bestFor", e.target.value)}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white focus:outline-none transition-colors ${
                    errors.bestFor ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-purple-400"
                  }`}
                >
                  <option value="">Select target audience</option>
                  {bestForOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800">
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.bestFor && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.bestFor}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Attendee Profile <span className="text-red-400">*</span>
                </label>
                <textarea
                  name="attendeeProfile"
                  value={formData.attendeeProfile}
                  onChange={(e) => handleInputChange("attendeeProfile", e.target.value)}
                  placeholder="Describe the ideal attendee for this event (e.g., startup founders looking to scale, developers interested in AI, etc.)"
                  rows={3}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors resize-none ${
                    errors.attendeeProfile
                      ? "border-red-400 focus:border-red-400"
                      : "border-white/20 focus:border-purple-400"
                  }`}
                  maxLength={500}
                />
                {errors.attendeeProfile && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.attendeeProfile}
                  </p>
                )}
                <p className="text-white/50 text-xs mt-1">{formData.attendeeProfile.length}/500 characters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="bg-white/10 backdrop-blur-xl border-white/20">
          <CardContent className="p-8">
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Link className="mr-3 h-5 w-5 text-orange-400" />
              Additional Information
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Event URL (Optional)</label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={(e) => handleInputChange("url", e.target.value)}
                  placeholder="https://your-event-website.com"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none transition-colors ${
                    errors.url ? "border-red-400 focus:border-red-400" : "border-white/20 focus:border-purple-400"
                  }`}
                />
                {errors.url && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.url}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Event Image URL (Optional)</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  placeholder="https://example.com/event-image.jpg"
                  className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            type="button"
            onClick={() => setPreviewMode(true)}
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-8 py-4"
          >
            <Eye className="mr-2 h-5 w-5" />
            Preview Event
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-4 font-semibold shadow-lg hover:shadow-purple-500/25 transition-all duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                Uploading Event...
              </>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Upload Event
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
