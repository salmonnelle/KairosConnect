const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const { enrichEvent } = require('../lib/utils/eventEnricher');

// Path to our sample CSV file
const sampleFilePath = path.resolve(__dirname, './sample-events.csv');

/**
 * Processes the sample CSV file and shows enriched events
 */
function processSampleFile() {
  console.log('Processing sample events CSV file...\n');
  
  try {
    // Read and parse CSV file
    const file = fs.readFileSync(sampleFilePath, 'utf8');
    const results = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (results.errors.length > 0) {
      console.error('CSV parsing errors:', results.errors);
      return;
    }
    
    console.log(`Found ${results.data.length} events in the CSV file.\n`);
    console.log('='.repeat(100));
    console.log('ENRICHED EVENT DATA (READY FOR SUPABASE IMPORT)');
    console.log('='.repeat(100));
    
    // Process each event
    results.data.forEach((raw, index) => {
      const eventName = raw["Event Name"];
      const date = raw["Date"];
      const location = raw["Location"];
      const eventUrl = raw["Event URL"];
      
      // Skip rows with missing essential data
      if (!eventName || !date || !location) {
        console.warn('Skipping incomplete record:', raw);
        return;
      }
      
      // Enrich the event with additional metadata
      const { type, topic, tags } = enrichEvent(eventName);
      
      // Create the enriched event object that would be inserted into Supabase
      const enrichedEvent = {
        title: eventName,
        description: `Event: ${eventName}`, // Default description
        date: date,
        location: location,
        url: eventUrl || null,
        type,
        topic,
        tags,
        is_featured: false // Default to not featured
      };
      
      // Display the enriched event
      console.log(`Event #${index + 1}: ${eventName}`);
      console.log(`  Date: ${date}`);
      console.log(`  Location: ${location}`);
      console.log(`  URL: ${eventUrl || 'N/A'}`);
      console.log(`  Type: ${type}`);
      console.log(`  Topic: ${topic}`);
      console.log(`  Tags: ${tags.join(', ')}`);
      console.log('---');
    });
    
    console.log('\nSample processing complete!');
    console.log('\nIn a real import, these enriched events would be inserted into your Supabase database.');
    console.log('To perform the actual import, run: node scripts/importEvents.js');
    
  } catch (error) {
    console.error(`Error processing sample file:`, error);
  }
}

// Run the sample processor
processSampleFile();
