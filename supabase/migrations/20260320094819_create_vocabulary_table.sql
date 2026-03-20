/*
  # Create vocabulary table

  1. New Tables
    - `vocabulary` - Store vocabulary words with emoji and images
      - `id` (uuid, primary key)
      - `text` (text, word content)
      - `emoji` (text, emoji representation)
      - `image_data` (text, base64 image data)
      - `created_at` (timestamptz, when word was created)
  
  2. Security
    - Enable RLS on vocabulary table
    - Public access for demo app (no auth required)
*/

CREATE TABLE IF NOT EXISTS vocabulary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  emoji text,
  image_data text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read vocabulary"
  ON vocabulary FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert vocabulary"
  ON vocabulary FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow delete vocabulary"
  ON vocabulary FOR DELETE
  TO anon, authenticated
  USING (true);