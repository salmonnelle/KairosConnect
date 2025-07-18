# Kairos Event Import System

This document explains how to use the event enrichment and import system for Kairos.

## Overview

The system automatically enriches minimal CSV event data with additional metadata (type, topic, tags) before inserting them into Supabase. This allows you to work with simple CSV files while still having rich event data in your database.

## CSV Format

Your CSV files should have the following columns:
- `Date` - The date of the event
- `Event Name` - The name of the event
- `Location` - Where the event takes place
- `Event URL` - Link to the event website (optional)

Example:
```
Date,Event Name,Location,Event URL
2025-07-15,Web3 Summit Manila 2025,SMX Convention Center Manila,https://web3summitmanila.com
```

## Enrichment Process

The system automatically analyzes the event name to determine:
1. **Event Type** (e.g., Conference, Workshop, Hackathon)
2. **Event Topic** (e.g., Web3, AI, Marketing)
3. **Tags** (e.g., flagship, networking, tech, in-person)

This enriched data is then stored in Supabase along with the original CSV data.

## Database Schema

The Supabase events table has the following structure:

```sql
CREATE TABLE events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  location TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Other',
  topic TEXT NOT NULL DEFAULT 'General',
  date TEXT NOT NULL,
  url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## How to Use

### 1. Set Up Environment Variables

Create a `.env` file in the project root with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Test the Enrichment Logic

Run the test script to see how events are enriched:

```bash
node scripts/testEnrichment.js
```

### 3. Test with Sample CSV

Process the sample CSV file to see how the import would work:

```bash
node scripts/testImport.js
```

### 4. Run the Full Import

Import all CSV files from the csvfiles-1 and csvfiles-2 directories:

```bash
node scripts/importEvents.js
```

## Customizing the Enrichment Logic

The event enrichment logic is defined in `lib/utils/eventEnricher.js`. You can modify this file to adjust how events are categorized and tagged.

## Files

- `lib/utils/eventEnricher.js` - Core logic for enriching events
- `scripts/importEvents.js` - Main script for importing CSV files to Supabase
- `scripts/testEnrichment.js` - Test script for the enrichment logic
- `scripts/testImport.js` - Test script for CSV processing
- `lib/supabase/migrations/01_create_events_schema.sql` - SQL schema for the events table
