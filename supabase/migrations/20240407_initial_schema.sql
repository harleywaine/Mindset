-- Create enum for content types
CREATE TYPE content_type AS ENUM ('switch', 'foundation', 'emotional_control', 'visualization');

-- Create enum for version types
CREATE TYPE version_type AS ENUM ('short', 'medium', 'long');

-- Create enum for training types
CREATE TYPE training_type AS ENUM ('maintenance', 'basic_training');

-- Create switches table
CREATE TABLE switches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create switch versions table
CREATE TABLE switch_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    switch_id UUID REFERENCES switches(id) ON DELETE CASCADE,
    version_type version_type NOT NULL,
    audio_url TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(switch_id, version_type)
);

-- Create foundations table
CREATE TABLE foundations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lesson_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(lesson_number)
);

-- Create emotional control table
CREATE TABLE emotional_control (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    training_type training_type NOT NULL,
    lesson_number INTEGER, -- NULL for maintenance sessions
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(training_type, lesson_number)
);

-- Create visualization table
CREATE TABLE visualization (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    training_type training_type NOT NULL,
    lesson_number INTEGER, -- NULL for maintenance sessions
    title TEXT NOT NULL,
    audio_url TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in seconds
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(training_type, lesson_number)
);

-- Insert initial switches data
INSERT INTO switches (name) VALUES
    ('Switch On'),
    ('Switch Off'),
    ('Take Control');

-- Insert switch versions (placeholder URLs - you'll need to replace these with actual audio URLs)
INSERT INTO switch_versions (switch_id, version_type, audio_url, duration) 
SELECT 
    s.id,
    v.version_type::version_type,
    'https://storage.googleapis.com/your-bucket/placeholder.mp3',
    CASE 
        WHEN v.version_type = 'short' THEN 300  -- 5 minutes
        WHEN v.version_type = 'medium' THEN 600 -- 10 minutes
        WHEN v.version_type = 'long' THEN 900   -- 15 minutes
    END
FROM switches s
CROSS JOIN (VALUES ('short'), ('medium'), ('long')) AS v(version_type);

-- Insert foundations lessons
INSERT INTO foundations (lesson_number, title, audio_url, duration)
SELECT 
    generate_series(1, 7),
    'Lesson ' || generate_series(1, 7),
    'https://storage.googleapis.com/your-bucket/placeholder.mp3',
    600; -- 10 minutes each

-- Insert emotional control maintenance sessions
INSERT INTO emotional_control (training_type, title, audio_url, duration)
VALUES 
    ('maintenance'::training_type, 'Short Version', 'https://storage.googleapis.com/your-bucket/placeholder.mp3', 300),
    ('maintenance'::training_type, 'Medium Version', 'https://storage.googleapis.com/your-bucket/placeholder.mp3', 600),
    ('maintenance'::training_type, 'Long Version', 'https://storage.googleapis.com/your-bucket/placeholder.mp3', 900);

-- Insert emotional control basic training
INSERT INTO emotional_control (training_type, lesson_number, title, audio_url, duration)
SELECT 
    'basic_training'::training_type,
    generate_series(1, 7),
    'Lesson ' || generate_series(1, 7),
    'https://storage.googleapis.com/your-bucket/placeholder.mp3',
    600;

-- Insert visualization maintenance sessions
INSERT INTO visualization (training_type, title, audio_url, duration)
VALUES 
    ('maintenance'::training_type, 'Short Version', 'https://storage.googleapis.com/your-bucket/placeholder.mp3', 300),
    ('maintenance'::training_type, 'Medium Version', 'https://storage.googleapis.com/your-bucket/placeholder.mp3', 600),
    ('maintenance'::training_type, 'Long Version', 'https://storage.googleapis.com/your-bucket/placeholder.mp3', 900);

-- Insert visualization basic training
INSERT INTO visualization (training_type, lesson_number, title, audio_url, duration)
SELECT 
    'basic_training'::training_type,
    generate_series(1, 7),
    'Lesson ' || generate_series(1, 7),
    'https://storage.googleapis.com/your-bucket/placeholder.mp3',
    600;

-- Create RLS policies
ALTER TABLE switches ENABLE ROW LEVEL SECURITY;
ALTER TABLE switch_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE foundations ENABLE ROW LEVEL SECURITY;
ALTER TABLE emotional_control ENABLE ROW LEVEL SECURITY;
ALTER TABLE visualization ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Allow authenticated users to read switches"
    ON switches FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read switch versions"
    ON switch_versions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read foundations"
    ON foundations FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read emotional control"
    ON emotional_control FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to read visualization"
    ON visualization FOR SELECT
    TO authenticated
    USING (true); 