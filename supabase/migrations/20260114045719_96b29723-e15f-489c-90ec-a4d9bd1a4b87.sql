-- Create storage bucket for agency documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agency-documents', 
  'agency-documents', 
  true,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'image/jpeg', 'image/png', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for agency documents
CREATE POLICY "Agency team members can upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'agency-documents' AND
  EXISTS (
    SELECT 1 FROM public.agency_workspaces aw
    JOIN public.agency_team_members atm ON atm.workspace_id = aw.id
    WHERE aw.id = (storage.foldername(name))[1]::uuid
    AND atm.user_id = auth.uid()
    AND atm.is_active = true
  )
);

CREATE POLICY "Agency team members can view documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'agency-documents' AND
  EXISTS (
    SELECT 1 FROM public.agency_workspaces aw
    JOIN public.agency_team_members atm ON atm.workspace_id = aw.id
    WHERE aw.id = (storage.foldername(name))[1]::uuid
    AND atm.user_id = auth.uid()
    AND atm.is_active = true
  )
);

CREATE POLICY "Agency team members can delete documents"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'agency-documents' AND
  EXISTS (
    SELECT 1 FROM public.agency_workspaces aw
    JOIN public.agency_team_members atm ON atm.workspace_id = aw.id
    WHERE aw.id = (storage.foldername(name))[1]::uuid
    AND atm.user_id = auth.uid()
    AND atm.is_active = true
  )
);