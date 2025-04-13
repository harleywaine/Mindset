-- Drop existing tables if they exist
DROP TABLE IF EXISTS user_progress;
DROP TABLE IF EXISTS tracks;

-- Drop existing function
DROP FUNCTION IF EXISTS update_track_completion;

-- Drop existing type if it exists
DROP TYPE IF EXISTS track_type;
DROP TYPE IF EXISTS content_type;

-- Create enum for track types
CREATE TYPE track_type AS ENUM ('switch', 'foundation', 'emotional_control', 'visualization', 'maintenance', 'training');

-- Create base tracks table
CREATE TABLE tracks (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER NOT NULL,
  type track_type NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user progress table
CREATE TABLE user_progress (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id BIGINT NOT NULL REFERENCES tracks(id) ON DELETE CASCADE,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Create function to update track completion
CREATE FUNCTION update_track_completion(p_user_id UUID, p_track_id BIGINT)
RETURNS void AS $$
BEGIN
  INSERT INTO user_progress (user_id, track_id, completed, completed_at)
  VALUES (p_user_id, p_track_id, TRUE, NOW())
  ON CONFLICT (user_id, track_id) 
  DO UPDATE SET 
    completed = TRUE,
    completed_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert foundation tracks
INSERT INTO tracks (id, title, description, duration, type, audio_url) VALUES
(1, 'Visualise the Race', 'Learn to visualize your perfect race', 1200, 'foundation', 'https://example.com/audio/visualise-race.mp3'),
(2, 'Confident Behaviour', 'Build unshakeable confidence', 1200, 'foundation', 'https://example.com/audio/confident-behaviour.mp3'),
(3, 'Training Breakthroughs', 'Break through your limits', 1200, 'foundation', 'https://example.com/audio/training-breakthroughs.mp3'),
(4, 'Overcoming Obstacles', 'Master any challenge', 1200, 'foundation', 'https://example.com/audio/overcoming-obstacles.mp3');

-- Insert switch tracks
INSERT INTO tracks (id, title, description, duration, type, audio_url) VALUES
-- Switch On
(5, 'Short Version', 'Quick focus session', 300, 'switch', 'https://example.com/audio/switch-on-short.mp3'),
(6, 'Medium Version', 'Standard focus session', 600, 'switch', 'https://example.com/audio/switch-on-medium.mp3'),
(7, 'Long Version', 'Deep focus session', 1200, 'switch', 'https://example.com/audio/switch-on-long.mp3'),
-- Switch Off
(8, 'Short Version', 'Quick wind down', 300, 'switch', 'https://example.com/audio/switch-off-short.mp3'),
(9, 'Medium Version', 'Standard wind down', 600, 'switch', 'https://example.com/audio/switch-off-medium.mp3'),
(10, 'Long Version', 'Deep wind down', 1200, 'switch', 'https://example.com/audio/switch-off-long.mp3'),
-- Take Control
(11, 'Short Version', 'Quick control session', 300, 'switch', 'https://example.com/audio/control-short.mp3'),
(12, 'Medium Version', 'Standard control session', 600, 'switch', 'https://example.com/audio/control-medium.mp3'),
(13, 'Long Version', 'Deep control session', 1200, 'switch', 'https://example.com/audio/control-long.mp3');

-- Insert maintenance tracks
INSERT INTO tracks (id, title, description, duration, type, audio_url) VALUES
(14, 'Short Session', 'Quick maintenance session', 300, 'maintenance', 'https://example.com/audio/maintenance-short.mp3'),
(15, 'Medium Session', 'Standard maintenance session', 600, 'maintenance', 'https://example.com/audio/maintenance-medium.mp3'),
(16, 'Long Session', 'Extended maintenance session', 900, 'maintenance', 'https://example.com/audio/maintenance-long.mp3');

-- Insert training tracks
INSERT INTO tracks (id, title, description, duration, type, audio_url) VALUES
(17, 'Introduction', 'Introduction to training', 1200, 'training', 'https://example.com/audio/training-intro.mp3'),
(18, 'Lesson 1', 'Basic training concepts', 1200, 'training', 'https://example.com/audio/training-lesson-1.mp3'),
(19, 'Lesson 2', 'Advanced techniques', 1200, 'training', 'https://example.com/audio/training-lesson-2.mp3'),
(20, 'Lesson 3', 'Mastery practice', 1200, 'training', 'https://example.com/audio/training-lesson-3.mp3'); 