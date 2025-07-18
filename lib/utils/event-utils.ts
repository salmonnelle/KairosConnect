import { z } from 'zod'
import { eventSchema, eventTagSchema, EVENT_TYPES, EVENT_TOPICS } from '../schema/event'

/**
 * Validates event data using Zod schema
 * @param eventData Raw event data to validate
 * @returns Validated event data or throws ZodError
 */
export function validateEvent(eventData: unknown) {
  return eventSchema.parse(eventData)
}

/**
 * Validates a single tag against the controlled vocabulary
 * @param tag Tag to validate
 * @returns Boolean indicating if tag is valid
 */
export function isValidTag(tag: string): boolean {
  try {
    eventTagSchema.parse(tag)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Validates an array of tags against the controlled vocabulary
 * @param tags Array of tags to validate
 * @returns Array containing only valid tags
 */
export function validateTags(tags: string[]): string[] {
  return tags.filter(isValidTag)
}

/**
 * Suggests tags based on event title and description
 * @param title Event title
 * @param description Event description
 * @returns Array of suggested tags
 */
export function suggestTags(title: string, description: string): string[] {
  const combinedText = `${title} ${description}`.toLowerCase()
  const suggestedTags: string[] = []
  
  const keywordMap: Record<string, string[]> = {
    'Web3': ['web3', 'blockchain', 'crypto', 'nft', 'token'],
    'Networking': ['networking', 'connect', 'connection', 'meet', 'mixer'],
    'Tech': ['tech', 'technology', 'software', 'digital'],
    'Pitch': ['pitch', 'pitching', 'demo day', 'showcase'],
    'Startup': ['startup', 'founder', 'entrepreneurship', 'venture'],
    'Funding': ['funding', 'investor', 'investment', 'venture capital', 'vc'],
    'Workshop': ['workshop', 'hands-on', 'training'],
    'Conference': ['conference', 'summit', 'convention', 'forum'],
    'Hackathon': ['hackathon', 'hack', 'code fest'],
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml'],
    'Design': ['design', 'ux', 'ui', 'user experience'],
    'Marketing': ['marketing', 'growth', 'branding'],
    'Business': ['business', 'entrepreneurship', 'enterprise']
  }

  for (const [tag, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      suggestedTags.push(tag)
    }
  }
  
  return validateTags(suggestedTags)
}

/**
 * Suggests the most appropriate event type based on title and description
 * @param title Event title
 * @param description Event description
 * @returns Suggested event type
 */
export function suggestEventType(title: string, description: string): string {
  const combined = `${title} ${description}`.toLowerCase()
  
  const typeMap: Record<string, string[]> = {
    'Conference': ['conference', 'summit', 'convention', 'forum'],
    'Workshop': ['workshop', 'hands-on', 'training', 'class'],
    'Meetup': ['meetup', 'meet-up', 'gathering', 'community'],
    'Webinar': ['webinar', 'online seminar', 'virtual event', 'live stream'],
    'Hackathon': ['hackathon', 'hack', 'code fest', 'coding challenge'],
    'Competition': ['competition', 'contest', 'challenge', 'tournament'],
    'Summit': ['summit', 'leadership', 'executive'],
    'Panel': ['panel', 'discussion', 'roundtable', 'fireside chat'],
    'Networking': ['networking', 'mixer', 'social', 'connect'],
    'Training': ['training', 'course', 'bootcamp', 'certification'],
    'Exhibition': ['exhibition', 'expo', 'showcase', 'fair', 'tradeshow']
  }
  
  for (const [type, keywords] of Object.entries(typeMap)) {
    if (keywords.some(keyword => combined.includes(keyword))) {
      return type
    }
  }
  
  return 'Other'
}

/**
 * Suggests the most appropriate event topic based on title and description
 * @param title Event title
 * @param description Event description
 * @returns Suggested event topic
 */
export function suggestEventTopic(title: string, description: string): string {
  const combined = `${title} ${description}`.toLowerCase()
  
  const topicMap: Record<string, string[]> = {
    'Technology': ['tech', 'technology', 'software', 'digital', 'coding'],
    'Business': ['business', 'corporate', 'company', 'enterprise'],
    'Design': ['design', 'ux', 'ui', 'user experience', 'creative'],
    'Marketing': ['marketing', 'growth', 'branding', 'advertising'],
    'Finance': ['finance', 'financial', 'money', 'investment', 'banking'],
    'Education': ['education', 'learning', 'teaching', 'academic'],
    'Health': ['health', 'healthcare', 'medical', 'wellness'],
    'Social Impact': ['social impact', 'nonprofit', 'sustainability', 'community'],
    'Innovation': ['innovation', 'innovative', 'disruption', 'breakthrough'],
    'Web3': ['web3', 'blockchain', 'crypto', 'nft', 'token'],
    'AI': ['ai', 'artificial intelligence', 'machine learning', 'ml'],
    'Blockchain': ['blockchain', 'distributed ledger', 'smart contract'],
    'Product': ['product', 'product management', 'product development'],
    'Entrepreneurship': ['entrepreneur', 'startup', 'founder', 'venture'],
    'Investment': ['investment', 'investor', 'funding', 'venture capital']
  }
  
  for (const [topic, keywords] of Object.entries(topicMap)) {
    if (keywords.some(keyword => combined.includes(keyword))) {
      return topic
    }
  }
  
  return 'Other'
}
