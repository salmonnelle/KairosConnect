import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { enrichEvent } from '../lib/utils/enrichEvent';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define the structure of our raw CSV data
type RawEvent = {
  Date: string;
  "Event Name": string;
  Location: string;
  "Event URL": string;
};

/**
 * Processes a single CSV file and imports events to Supabase
 * @param filePath Path to the CSV file
 */
async function processFile(filePath: string): Promise<number> {
  console.log(`Processing ${filePath}...`);
  
  try {
    // Read and parse CSV file
    const file = fs.readFileSync(filePath, 'utf8');
    const results = Papa.parse<RawEvent>(file, {
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
      // Skip rows with missing essential data
      if (!raw["Event Name"] || !raw.Date || !raw.Location) {
        console.warn('Skipping incomplete record:', raw);
        continue;
      }
      
      // Enrich the event with additional metadata
      const { type, topic, tags } = enrichEvent(raw["Event Name"]);
      
      // Insert into Supabase
      const { data, error } = await supabase.from('events').insert([
        {
          title: raw["Event Name"],
          description: `Event: ${raw["Event Name"]}`, // Default description
          date: raw.Date,
          location: raw.Location,
          url: raw["Event URL"] || null,
          type,
          topic,
          tags,
          is_featured: false // Default to not featured
        },
      ]);
      
      if (error) {
        console.error('Insert error for event:', raw["Event Name"], error);
      } else {
        successCount++;
        console.log(`Imported: ${raw["Event Name"]}`);
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
