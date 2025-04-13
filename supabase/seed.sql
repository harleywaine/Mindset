-- Insert foundation tracks
INSERT INTO tracks (title, description, duration, type, audio_url) VALUES
('Intro 1', 'Introduction to meditation basics', 300, 'foundation', 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4'),
('Breathing Basics', 'Learn the fundamentals of proper breathing techniques', 300, 'foundation', 'https://example.com/audio/breathing-basics.mp3'),
('Body Scan', 'A guided body awareness meditation', 600, 'foundation', 'https://example.com/audio/body-scan.mp3');

-- Insert switch tracks
INSERT INTO tracks (title, description, duration, type, audio_url) VALUES
('Quick Reset', 'A 5-minute meditation to help you switch contexts', 300, 'switch', 'https://example.com/audio/quick-reset.mp3'),
('Mental Preparation', 'Prepare your mind for focused work', 480, 'switch', 'https://example.com/audio/mental-prep.mp3');

-- Insert emotional control tracks
INSERT INTO tracks (title, description, duration, type, audio_url) VALUES
('Stress Relief', 'Guided meditation for managing stress', 600, 'emotional_control', 'https://example.com/audio/stress-relief.mp3'),
('Anxiety Management', 'Techniques for handling anxiety', 720, 'emotional_control', 'https://example.com/audio/anxiety.mp3');

-- Insert visualization tracks
INSERT INTO tracks (title, description, duration, type, audio_url) VALUES
('Goal Achievement', 'Visualize your path to success', 600, 'visualization', 'https://example.com/audio/goal-achievement.mp3'),
('Creative Flow', 'Enhance creativity through guided visualization', 720, 'visualization', 'https://example.com/audio/creative-flow.mp3'); 