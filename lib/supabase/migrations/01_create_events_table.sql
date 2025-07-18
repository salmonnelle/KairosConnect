-- Create events table with appropriate metadata fields
CREATE TABLE IF NOT EXISTS events (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  topic TEXT NOT NULL,
  date TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on the tags array for faster searching
CREATE INDEX IF NOT EXISTS events_tags_idx ON events USING GIN (tags);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a table for storing the controlled tag system
CREATE TABLE IF NOT EXISTS event_tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial tags
INSERT INTO event_tags (name, category) VALUES
('Web3', 'Technology'),
('Networking', 'Activity'),
('Tech', 'Industry'),
('Pitch', 'Activity'),
('Startup', 'Industry'),
('Funding', 'Topic'),
('Workshop', 'Format'),
('Conference', 'Format'),
('Hackathon', 'Format'),
('AI', 'Technology'),
('Blockchain', 'Technology'),
('Design', 'Field'),
('Marketing', 'Field'),
('Product', 'Field'),
('Finance', 'Field'),
('Business', 'Field'),
('Education', 'Field'),
('Health', 'Field'),
('Social Impact', 'Category'),
('Innovation', 'Category'),
('Remote', 'Location'),
('In-Person', 'Location'),
('Hybrid', 'Location')
ON CONFLICT (name) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to read events
CREATE POLICY events_select_policy ON events
  FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert events
CREATE POLICY events_insert_policy ON events
  FOR INSERT TO authenticated USING (true);

-- Create a policy that allows authenticated users to update their own events
-- This would need to be updated if you add a user_id column to events
CREATE POLICY events_update_policy ON events
  FOR UPDATE TO authenticated USING (true);
