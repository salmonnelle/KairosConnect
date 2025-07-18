const Papa = require('papaparse');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { enrichEvent } = require('../lib/utils/eventEnricher');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
dotenv.config();

// Initialize Supabase client with direct connection to the specified project
let supabase;
try {
  // Connect directly to the specified project
  const supabaseUrl = 'https://dcafwtbvminkdcwurdrl.supabase.co';
  // Note: You'll need to provide your anon key when running the script
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseKey) {
    console.error('Missing Supabase anon key. Please set NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment.');
    process.exit(1);
  }

  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  console.log('Running in test mode without Supabase connection.');
  // Mock supabase for testing without actual connection
  supabase = {
    from: () => ({
      insert: async (data) => {
        console.log('Would insert into Supabase:', data);
        return { data: true, error: null };
      }
    })
  };
}

/**
 * Processes a single CSV file and imports events to Supabase
 * @param {string} filePath Path to the CSV file
 */
async function processFile(filePath) {
  console.log(`Processing ${filePath}...`);
  
  try {
    // Read and parse CSV file
    const file = fs.readFileSync(filePath, 'utf8');
    const results = Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
    });
    
    if (results.errors.length > 0) {
      console.error('CSV parsing errors:', results.errors);
      return 0;
    }
    
    let successCount = 0;
    
    // Process each event
    for (const raw of results.data) {
      // Map CSV columns to our expected format
      // Handle different possible column names
      const eventName = raw["Event Name"] || raw["Title"] || raw["Name"];
      const date = raw["Date"] || raw["Date and Time"] || raw["Event Date"];
      const location = raw["Location"] || raw["Venue"] || raw["Place"];
      const eventUrl = raw["Event URL"] || raw["URL"] || raw["Link"];
      
      // Skip rows with missing essential data
      if (!eventName || !date || !location) {
        console.warn('Skipping incomplete record:', raw);
        continue;
      }
      
      // Enrich the event with additional metadata
      const { type, topic, tags } = enrichEvent(eventName);
      
      // Insert into Supabase
      const { error } = await supabase.from('events').insert([
        {
          title: eventName,
          description: `Event: ${eventName}`, // Default description
          date: date,
          location: location,
          url: eventUrl || null,
          type,
          topic,
          tags,
          is_featured: false // Default to not featured
        },
      ]);
      
      if (error) {
        console.error('Insert error for event:', eventName, error);
      } else {
        successCount++;
        console.log(`Imported: ${eventName}`);
      }
    }
    
    return successCount;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return 0;
  }
}

/**
 * Main function to process all CSV files in directories
 */
async function main() {
  // Define directories containing CSV files
  const directories = [
    path.resolve(__dirname, '../csvfiles-1'),
    path.resolve(__dirname, '../csvfiles-2')
  ];
  
  let totalImported = 0;
  
  for (const directory of directories) {
    try {
      const files = fs.readdirSync(directory);
      
      for (const file of files) {
        if (file.endsWith('.csv')) {
          const filePath = path.join(directory, file);
          const importedCount = await processFile(filePath);
          totalImported += importedCount;
          console.log(`Imported ${importedCount} events from ${file}`);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${directory}:`, error);
    }
  }
  
  console.log(`Total events imported: ${totalImported}`);
}

// Run the import
main().catch(error => {
  console.error('Import failed:', error);
  process.exit(1);
});
