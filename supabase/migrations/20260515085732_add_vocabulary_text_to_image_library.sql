/*
  # Add vocabulary_text column to image_library

  1. Changes
    - Add `vocabulary_text` column to `image_library` table to store the vocabulary word associated with each image
    - This allows auto-matching images to words when user types them
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'image_library' AND column_name = 'vocabulary_text'
  ) THEN
    ALTER TABLE image_library ADD COLUMN vocabulary_text text;
  END IF;
END $$;
