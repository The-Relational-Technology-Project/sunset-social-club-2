
-- Members upload into a folder named by their user id
CREATE POLICY "Members upload own photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Members read their own uploads
CREATE POLICY "Members read own photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'photos'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Members read approved photos (via photos table lookup)
CREATE POLICY "Members read approved photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'photos'
    AND EXISTS (
      SELECT 1 FROM public.photos p
      WHERE p.storage_path = storage.objects.name
        AND p.approved = true
    )
  );
