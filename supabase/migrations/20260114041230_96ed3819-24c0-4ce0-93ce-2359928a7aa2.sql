-- Fix overly permissive RLS policies for lead_qualifications

-- Drop the permissive policies
DROP POLICY IF EXISTS "Public can insert own qualification" ON public.lead_qualifications;
DROP POLICY IF EXISTS "Public can update own qualification" ON public.lead_qualifications;

-- Create more secure policies that link to the lead
CREATE POLICY "Lead owners can insert qualification" ON public.lead_qualifications 
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM leads WHERE leads.id = lead_qualifications.lead_id)
  );

CREATE POLICY "Lead owners can update qualification" ON public.lead_qualifications 
  FOR UPDATE USING (
    is_super_admin() OR 
    EXISTS (SELECT 1 FROM leads l JOIN agencies a ON l.source_agency_id = a.id 
      WHERE l.id = lead_qualifications.lead_id AND a.user_id = auth.uid())
  );

-- Drop the permissive policy for feedback_responses
DROP POLICY IF EXISTS "Public can insert feedback responses" ON public.feedback_responses;

-- Create more secure policy that requires a valid request or agency
CREATE POLICY "Feedback can be submitted via valid request" ON public.feedback_responses 
  FOR INSERT WITH CHECK (
    request_id IS NOT NULL AND 
    EXISTS (SELECT 1 FROM feedback_requests WHERE feedback_requests.id = feedback_responses.request_id)
  );