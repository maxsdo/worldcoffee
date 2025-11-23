-- Coffee messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT NOT NULL,
  to_username TEXT NOT NULL,
  from_username TEXT NOT NULL,
  from_profile_picture_url TEXT,
  message TEXT,
  amount TEXT NOT NULL,
  transaction_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on to_username for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_to_username ON messages(to_username);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Profile descriptions table
CREATE TABLE IF NOT EXISTS profile_descriptions (
  username TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
