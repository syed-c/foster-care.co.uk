-- Create storage bucket for agency images
INSERT INTO storage.buckets (id, name, public)
VALUES ('agency-images', 'agency-images', true);

-- Allow anyone to view agency images (public bucket)
CREATE POLICY "Anyone can view agency images"
ON storage.objects FOR SELECT
USING (bucket_id = 'agency-images');

-- Only agency owners and admins can upload agency images
CREATE POLICY "Agency owners and admins can upload agency images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'agency-images' 
  AND (
    auth.uid() = (SELECT user_id FROM public.agencies WHERE id = (string_to_array(object_name, '/'))[1]::uuid)
    OR public.is_admin(auth.uid())
  )
);

-- Only agency owners and admins can update agency images
CREATE POLICY "Agency owners and admins can update agency images"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'agency-images' 
  AND (
    auth.uid() = (SELECT user_id FROM public.agencies WHERE id = (string_to_array(object_name, '/'))[1]::uuid)
    OR public.is_admin(auth.uid())
  )
);

-- Only agency owners and admins can delete agency images
CREATE POLICY "Agency owners and admins can delete agency images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'agency-images' 
  AND (
    auth.uid() = (SELECT user_id FROM public.agencies WHERE id = (string_to_array(object_name, '/'))[1]::uuid)
    OR public.is_admin(auth.uid())
  )
);