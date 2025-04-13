-- Update Switch On tracks with the test audio URL
UPDATE tracks
SET audio_url = 'https://nbbizrkpeadukjbtnazf.supabase.co/storage/v1/object/sign/testbucket/Intro%201.mp3?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJ0ZXN0YnVja2V0L0ludHJvIDEubXAzIiwiaWF0IjoxNzQ0NTcyNjIwLCJleHAiOjIwNTk5MzI2MjB9.nlV9hov0XpXSs5Zx1rbGTCX-W5Dtm9GMnm3GZltJei4',
    description = CASE id
        WHEN 5 THEN 'A quick 5-minute session to get you focused and ready'
        WHEN 6 THEN 'A balanced 10-minute session for optimal mental preparation'
        WHEN 7 THEN 'A comprehensive 20-minute session for deep mental preparation'
    END
WHERE id IN (5, 6, 7) AND type = 'switch'; 