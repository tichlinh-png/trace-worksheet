/*
  # Create app storage tables

  1. New Tables
    - `app_settings` - Store logo, school info (name, class, teacher, etc)
    - `image_library` - Store uploaded/saved images with metadata
  
  2. Security
    - Enable RLS on both tables
    - Single row settings table (one settings record per app session)
    - Public access for image library (no auth required for this demo app)
*/

CREATE TABLE IF NOT EXISTS app_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text,
  school_name text,
  class_name text,
  teacher_name text,
  default_repeat_count integer DEFAULT 12,
  default_line_count integer DEFAULT 4,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS image_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_data text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE image_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read app settings"
  ON app_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert app settings"
  ON app_settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update app settings"
  ON app_settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow read image library"
  ON image_library FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow insert image library"
  ON image_library FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow delete image library"
  ON image_library FOR DELETE
  TO anon, authenticated
  USING (true);