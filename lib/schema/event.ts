import { z } from 'zod'

// Define the controlled tag system
export const EVENT_TAGS = [
  'Web3',
  'Networking',
  'Tech',
  'Pitch',
  'Startup',
  'Funding',
  'Workshop',
  'Conference',
  'Hackathon',
  'AI',
  'Blockchain',
  'Design',
  'Marketing',
  'Product',
  'Finance',
  'Business',
  'Education',
  'Health',
  'Social Impact',
  'Innovation',
  'Remote',
  'In-Person',
  'Hybrid'
] as const

// Define the event types
export const EVENT_TYPES = [
  'Conference',
  'Workshop',
  'Meetup',
  'Webinar',
  'Hackathon',
  'Competition',
  'Summit',
  'Panel',
  'Networking',
  'Training',
  'Exhibition',
  'Other'
] as const

// Define the event topics
export const EVENT_TOPICS = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Finance',
  'Education',
  'Health',
  'Social Impact',
  'Innovation',
  'Web3',
  'AI',
  'Blockchain',
  'Product',
  'Entrepreneurship',
  'Investment',
  'Other'
] as const

// Zod schema for event tags validation
export const eventTagSchema = z.enum(EVENT_TAGS)
export const eventTagsArraySchema = z.array(eventTagSchema)

// Zod schema for event type validation
export const eventTypeSchema = z.enum(EVENT_TYPES)

// Zod schema for event topic validation
export const eventTopicSchema = z.enum(EVENT_TOPICS)

// Zod schema for event validation
export const eventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location must be at least 2 characters'),
  type: eventTypeSchema,
  topic: eventTopicSchema,
  date: z.string(), // Could be refined with a date parser
  tags: eventTagsArraySchema,
  isFeatured: z.boolean().default(false)
})

// TypeScript type derived from the Zod schema
export type EventSchema = z.infer<typeof eventSchema>

// Type for the database table
export interface EventTable extends EventSchema {
  id: number
  created_at: string
  updated_at: string
}
