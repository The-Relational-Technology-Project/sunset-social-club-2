DROP POLICY IF EXISTS "Members read approved photos" ON storage.objects;
CREATE POLICY "Members read approved photos"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'photos'
    AND public.is_club_member()
    AND EXISTS (
      SELECT 1 FROM public.photos p
      WHERE p.storage_path = storage.objects.name
        AND (p.approved = true OR p.user_id = auth.uid())
    )
  );