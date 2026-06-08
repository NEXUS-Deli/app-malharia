-- ============================================================
-- ConfecOS - v5: Reference images for production orders
-- ============================================================

-- Add reference_image_url column to production_orders
ALTER TABLE production_orders
ADD COLUMN reference_image_url text;

-- Create the storage bucket for order reference images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'order-images',
  'order-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/svg+xml']
)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to read any file in order-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can view order images'
  ) THEN
    CREATE POLICY "Users can view order images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'order-images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

-- Allow authenticated users to upload files to order-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can upload order images'
  ) THEN
    CREATE POLICY "Users can upload order images"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'order-images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

-- Allow users to update files in order-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can update order images'
  ) THEN
    CREATE POLICY "Users can update order images"
      ON storage.objects FOR UPDATE
      USING (bucket_id = 'order-images' AND auth.role() = 'authenticated')
      WITH CHECK (bucket_id = 'order-images' AND auth.role() = 'authenticated');
  END IF;
END
$$;

-- Allow users to delete files from order-images
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND policyname = 'Users can delete order images'
  ) THEN
    CREATE POLICY "Users can delete order images"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'order-images' AND auth.role() = 'authenticated');
  END IF;
END
$$;
