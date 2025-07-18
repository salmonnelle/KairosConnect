import fs from 'fs'
import path from 'path'
import Papa from 'papaparse'
import { supabase } from '../lib/supabaseClient'
import { eventSchema, eventTagSchema, EVENT_TYPES, EVENT_TOPICS } from '../lib/schema/event'
import { z } from 'zod'

// Define the structure of CSV rows (flexible to accommodate different CSV formats)
interface CsvRow {
  [key: string]: string
}

// Map CSV columns to our schema fields
interface ColumnMapping {
  title: string
  description: string
  date: string
  location: string
  url?: string
  tags?: string
  type?: string
  topic?: string
}

// Function to determine the best column mapping based on CSV headers
function determineColumnMapping(headers: string[]): ColumnMapping {
  // Default mapping
  const mapping: ColumnMapping = {
    title: 'Event Name',
    description: 'Focus',
    date: 'Date',
    location: 'Location',
    url: 'URL',
    tags: 'Tags',
    type: 'Type',
    topic: 'Topic'
  }

  // Check for alternative column names
  if (headers.includes('Event Name')) {
    mapping.title = 'Event Name'
  } else if (headers.includes('Title')) {
    mapping.title = 'Title'
  }

  if (headers.includes('Description')) {
    mapping.description = 'Description'
  } else if (headers.includes('Focus')) {
    mapping.description = 'Focus'
  } else if (headers.includes('About')) {
    mapping.description = 'About'
  }

  if (headers.includes('Date and Time')) {
    mapping.date = 'Date and Time'
  } else if (headers.includes('Date')) {
    mapping.date = 'Date'
  }

  if (headers.includes('Venue')) {
    mapping.location = 'Venue'
  } else if (headers.includes('Location')) {
    mapping.location = 'Location'
  }

  return mapping
}

// Function to extract tags from various CSV fields
function extractTags(row: CsvRow, mapping: ColumnMapping): string[] {
  const tags: string[] = []

  // Extract from dedicated tags field if it exists
  if (mapping.tags && row[mapping.tags]) {
    const tagString = row[mapping.tags]
    const extractedTags = tagString.split(/[,;|]/).map(tag => tag.trim())
    tags.push(...extractedTags)
  }

  // Extract from description if no tags field
  if (tags.length === 0 && row[mapping.description]) {
    const description = row[mapping.description].toLowerCase()
    
    // Check for keywords in description
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
      if (keywords.some(keyword => description.includes(keyword))) {
        tags.push(tag)
      }
    }
  }

  // Validate tags against our controlled vocabulary
  return tags.filter(tag => {
    try {
      eventTagSchema.parse(tag)
      return true
    } catch (e) {
      console.warn(`Invalid tag: ${tag}`)
      return false
    }
  })
}

// Function to determine the event type from CSV data
function determineEventType(row: CsvRow, mapping: ColumnMapping): string {
  // If we have a dedicated type field, use it
  if (mapping.type && row[mapping.type]) {
    const type = row[mapping.type]
    
    // Try to map to our controlled vocabulary
    for (const validType of EVENT_TYPES) {
      if (type.toLowerCase().includes(validType.toLowerCase())) {
        return validType
      }
    }
  }
  
  // Otherwise infer from title or description
  const title = row[mapping.title]?.toLowerCase() || ''
  const description = row[mapping.description]?.toLowerCase() || ''
  const combined = title + ' ' + description
  
  if (combined.includes('conference')) return 'Conference'
  if (combined.includes('workshop')) return 'Workshop'
  if (combined.includes('meetup')) return 'Meetup'
  if (combined.includes('webinar')) return 'Webinar'
  if (combined.includes('hackathon')) return 'Hackathon'
  if (combined.includes('competition')) return 'Competition'
  if (combined.includes('summit')) return 'Summit'
  if (combined.includes('panel')) return 'Panel'
  if (combined.includes('networking')) return 'Networking'
  if (combined.includes('training')) return 'Training'
  if (combined.includes('exhibition')) return 'Exhibition'
  
  // Default
  return 'Other'
}

// Function to determine the event topic from CSV data
function determineEventTopic(row: CsvRow, mapping: ColumnMapping): string {
  // If we have a dedicated topic field, use it
  if (mapping.topic && row[mapping.topic]) {
    const topic = row[mapping.topic]
    
    // Try to map to our controlled vocabulary
    for (const validTopic of EVENT_TOPICS) {
      if (topic.toLowerCase().includes(validTopic.toLowerCase())) {
        return validTopic
      }
    }
  }
  
  // Otherwise infer from title or description
  const title = row[mapping.title]?.toLowerCase() || ''
  const description = row[mapping.description]?.toLowerCase() || ''
  const combined = title + ' ' + description
  
  if (combined.includes('tech') || combined.includes('technology')) return 'Technology'
  if (combined.includes('business')) return 'Business'
  if (combined.includes('design')) return 'Design'
  if (combined.includes('marketing')) return 'Marketing'
  if (combined.includes('finance')) return 'Finance'
  if (combined.includes('education')) return 'Education'
  if (combined.includes('health')) return 'Health'
  if (combined.includes('social impact')) return 'Social Impact'
  if (combined.includes('innovation')) return 'Innovation'
  if (combined.includes('web3') || combined.includes('blockchain')) return 'Web3'
  if (combined.includes('ai') || combined.includes('artificial intelligence')) return 'AI'
  if (combined.includes('product')) return 'Product'
  if (combined.includes('entrepreneur')) return 'Entrepreneurship'
  if (combined.includes('invest')) return 'Investment'
  
  // Default
  return 'Other'
}

// Function to process a single CSV file and convert to events
async function processCsvFile(filePath: string): Promise<number> {
  console.log(`Processing ${filePath}...`)
  
  // Read and parse the CSV file
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, errors, meta } = Papa.parse<CsvRow>(fileContent, {
    header: true,
    skipEmptyLines: true
  })
  
  if (errors.length > 0) {
    console.error(`Errors parsing ${filePath}:`, errors)
    return 0
  }
  
  if (data.length === 0) {
    console.warn(`No data found in ${filePath}`)
    return 0
  }
  
  // Determine column mapping based on headers
  const headers = meta.fields || []
  const mapping = determineColumnMapping(headers)
  
  // Process each row
  let successCount = 0
  for (const row of data) {
    try {
      // Skip rows with missing essential data
      if (!row[mapping.title] || !row[mapping.date] || !row[mapping.location]) {
        continue
      }
      
      // Extract and validate tags
      const tags = extractTags(row, mapping)
      
      // Determine event type and topic
      const type = determineEventType(row, mapping)
      const topic = determineEventTopic(row, mapping)
      
      // Create event object
      const event = {
        title: row[mapping.title],
        description: row[mapping.description] || `Event: ${row[mapping.title]}`,
        location: row[mapping.location],
        date: row[mapping.date],
        type,
        topic,
        tags,
        isFeatured: false // Default to false
      }
      
      // Validate with Zod schema
      const validatedEvent = eventSchema.parse(event)
      
      // Insert into Supabase
      const { data: insertedEvent, error } = await supabase
        .from('events')
        .insert([{
          title: validatedEvent.title,
          description: validatedEvent.description,
          location: validatedEvent.location,
          date: validatedEvent.date,
          type: validatedEvent.type,
          topic: validatedEvent.topic,
          tags: validatedEvent.tags,
          is_featured: validatedEvent.isFeatured
        }])
      
      if (error) {
        console.error(`Error inserting event "${event.title}":`, error)
      } else {
        successCount++
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error(`Validation error for row:`, row, error.errors)
      } else {
        console.error(`Error processing row:`, row, error)
      }
    }
  }
  
  return successCount
}

// Main function to process all CSV files in directories
async function importEvents() {
  const directories = [
    path.resolve(__dirname, '../csvfiles-1'),
    path.resolve(__dirname, '../csvfiles-2')
  ]
  
  let totalImported = 0
  
  for (const directory of directories) {
    const files = fs.readdirSync(directory)
    
    for (const file of files) {
      if (file.endsWith('.csv')) {
        const filePath = path.join(directory, file)
        const importedCount = await processCsvFile(filePath)
        totalImported += importedCount
        console.log(`Imported ${importedCount} events from ${file}`)
      }
    }
  }
  
  console.log(`Total events imported: ${totalImported}`)
}

// Run the import
importEvents().catch(error => {
  console.error('Import failed:', error)
  process.exit(1)
})
