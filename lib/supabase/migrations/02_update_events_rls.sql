-- Drop the existing RLS policies
DROP POLICY IF EXISTS events_insert_policy ON events;
DROP POLICY IF EXISTS events_update_policy ON events;

-- Create a policy that allows inserts from both authenticated users and the anon key
CREATE POLICY events_insert_policy ON events
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows updates from both authenticated users and the anon key
CREATE POLICY events_update_policy ON events
  FOR UPDATE USING (true)
  WITH CHECK (true);
