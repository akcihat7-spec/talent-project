-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE,
  bio TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('talent', 'client')) NOT NULL DEFAULT 'talent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Synthetic talents table
CREATE TABLE synthetic_talents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  persona_data JSONB NOT NULL DEFAULT '{}',
  daily_rate DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT CHECK (status IN ('active', 'inactive', 'pending')) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Jobs table
CREATE TABLE jobs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status TEXT CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')) NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Hires table
CREATE TABLE hires (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE NOT NULL,
  talent_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(job_id, talent_id)
);

-- Create indexes for better performance
CREATE INDEX profiles_username_idx ON profiles(username);
CREATE INDEX synthetic_talents_owner_id_idx ON synthetic_talents(owner_id);
CREATE INDEX synthetic_talents_status_idx ON synthetic_talents(status);
CREATE INDEX jobs_client_id_idx ON jobs(client_id);
CREATE INDEX jobs_status_idx ON jobs(status);
CREATE INDEX hires_job_id_idx ON hires(job_id);
CREATE INDEX hires_talent_id_idx ON hires(talent_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_synthetic_talents_updated_at BEFORE UPDATE ON synthetic_talents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hires_updated_at BEFORE UPDATE ON hires
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE synthetic_talents ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hires ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Synthetic talents policies
CREATE POLICY "Users can view all synthetic talents" ON synthetic_talents
    FOR SELECT USING (true);

CREATE POLICY "Users can manage own synthetic talents" ON synthetic_talents
    FOR ALL USING (auth.uid() = owner_id);

-- Jobs policies
CREATE POLICY "Users can view all jobs" ON jobs
    FOR SELECT USING (true);

CREATE POLICY "Clients can manage own jobs" ON jobs
    FOR ALL USING (auth.uid() = client_id);

-- Hires policies
CREATE POLICY "Users can view related hires" ON hires
    FOR SELECT USING (
        auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id) OR 
        auth.uid() = talent_id
    );

CREATE POLICY "Clients and talents can manage related hires" ON hires
    FOR ALL USING (
        auth.uid() IN (SELECT client_id FROM jobs WHERE id = job_id) OR 
        auth.uid() = talent_id
    );
