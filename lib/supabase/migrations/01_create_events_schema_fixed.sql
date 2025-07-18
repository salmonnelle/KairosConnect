-- Create events table with appropriate metadata fields
CREATE TABLE IF NOT EXISTS events (
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

-- Create an index on the tags array for faster searching
CREATE INDEX IF NOT EXISTS events_tags_idx ON events USING GIN (tags);

-- Create an index on type for filtering
CREATE INDEX IF NOT EXISTS events_type_idx ON events (type);

-- Create an index on topic for filtering
CREATE INDEX IF NOT EXISTS events_topic_idx ON events (topic);

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

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows all users to read events
CREATE POLICY events_select_policy ON events
  FOR SELECT USING (true);

-- Create a policy that allows authenticated users to insert events
-- Fixed: Use WITH CHECK for INSERT policy
CREATE POLICY events_insert_policy ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create a policy that allows authenticated users to update events
-- Fixed: Use USING and WITH CHECK for UPDATE policy
CREATE POLICY events_update_policy ON events
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
