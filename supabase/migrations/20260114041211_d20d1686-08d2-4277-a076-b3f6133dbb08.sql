-- =====================================================
-- RANKING CONTROL SYSTEM
-- =====================================================

-- Agency ranking rules table - stores ranking logic per scope
CREATE TABLE public.agency_ranking_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('global', 'country', 'region', 'city', 'specialism')),
  scope_id UUID, -- NULL for global, location_id or specialism_id otherwise
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Ranking factors with weights (0-100)
  factors JSONB NOT NULL DEFAULT '{
    "verification_status": {"enabled": true, "weight": 20},
    "profile_completeness": {"enabled": true, "weight": 15},
    "response_time": {"enabled": true, "weight": 10},
    "reputation_trend": {"enabled": true, "weight": 15},
    "recent_activity": {"enabled": true, "weight": 10},
    "plan_tier": {"enabled": true, "weight": 15},
    "admin_trust_score": {"enabled": false, "weight": 10},
    "content_freshness": {"enabled": true, "weight": 5}
  }'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(scope_type, scope_id)
);

-- Agency ranking overrides - manual positioning
CREATE TABLE public.agency_ranking_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL CHECK (scope_type IN ('global', 'country', 'region', 'city', 'specialism')),
  scope_id UUID, -- NULL for global
  
  override_type TEXT NOT NULL CHECK (override_type IN ('pin', 'boost', 'suppress', 'exclude')),
  position INTEGER, -- For pinning to specific position (1-10)
  boost_value INTEGER DEFAULT 0, -- Positive/negative adjustment
  
  reason TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  
  UNIQUE(agency_id, scope_type, scope_id, override_type)
);

-- Agency trust scores - admin-controlled
CREATE TABLE public.agency_trust_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE UNIQUE,
  
  trust_score INTEGER NOT NULL DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  profile_completeness INTEGER NOT NULL DEFAULT 0 CHECK (profile_completeness >= 0 AND profile_completeness <= 100),
  response_rate INTEGER DEFAULT 0 CHECK (response_rate >= 0 AND response_rate <= 100),
  avg_response_hours INTEGER,
  reputation_trend TEXT CHECK (reputation_trend IN ('improving', 'stable', 'declining')),
  last_activity_at TIMESTAMP WITH TIME ZONE,
  content_updated_at TIMESTAMP WITH TIME ZONE,
  
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

-- =====================================================
-- ENHANCED LEAD QUALIFICATION
-- =====================================================

-- Lead qualification data - extended lead info
CREATE TABLE public.lead_qualifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE UNIQUE,
  
  -- Step 1: Basic qualification
  location_preference TEXT,
  fostering_type TEXT,
  timeframe TEXT CHECK (timeframe IN ('immediately', '1-3_months', '3-6_months', '6-12_months', 'exploring')),
  
  -- Step 2: Experience
  experience_level TEXT CHECK (experience_level IN ('none', 'some_research', 'applied_before', 'current_carer')),
  has_spare_room BOOLEAN,
  accommodation_type TEXT,
  
  -- Step 3: Preferences
  preferred_age_groups TEXT[],
  willing_siblings BOOLEAN,
  has_own_children BOOLEAN,
  has_pets BOOLEAN,
  
  -- Step 4: Additional
  special_considerations TEXT,
  best_contact_time TEXT,
  
  -- Meta
  completion_percentage INTEGER DEFAULT 0,
  steps_completed INTEGER DEFAULT 0,
  qualification_score INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lead match indicators - computed matches
CREATE TABLE public.lead_match_indicators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
  match_factors JSONB, -- { "location": 80, "specialism": 90, "availability": 70 }
  is_recommended BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(lead_id, agency_id)
);

-- =====================================================
-- REPUTATION MANAGEMENT SUITE
-- =====================================================

-- Feedback requests - branded feedback collection
CREATE TABLE public.feedback_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  -- Request details
  request_type TEXT NOT NULL CHECK (request_type IN ('general', 'post_enquiry', 'post_placement', 'annual')),
  recipient_name TEXT NOT NULL,
  recipient_email TEXT NOT NULL,
  recipient_phone TEXT,
  
  -- Branding
  custom_message TEXT,
  
  -- Tracking
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'opened', 'completed', 'expired')),
  sent_at TIMESTAMP WITH TIME ZONE,
  opened_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  
  -- Response
  response_id UUID, -- Links to feedback_responses
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Feedback responses - collected feedback
CREATE TABLE public.feedback_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES feedback_requests(id) ON DELETE SET NULL,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  -- Response content
  overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 5),
  nps_score INTEGER CHECK (nps_score >= 0 AND nps_score <= 10),
  
  -- Detailed ratings
  communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
  support_rating INTEGER CHECK (support_rating >= 1 AND support_rating <= 5),
  professionalism_rating INTEGER CHECK (professionalism_rating >= 1 AND professionalism_rating <= 5),
  
  positive_feedback TEXT,
  improvement_feedback TEXT,
  would_recommend BOOLEAN,
  
  -- Sentiment routing
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  routed_to TEXT CHECK (routed_to IN ('public_review', 'private_resolution', 'pending')),
  
  -- Identity (with consent)
  respondent_name TEXT,
  respondent_email TEXT,
  identity_verified BOOLEAN DEFAULT false,
  consent_public BOOLEAN DEFAULT false,
  consent_logged_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'approved_public', 'resolved_private', 'archived')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Resolution threads - for negative feedback
CREATE TABLE public.resolution_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  feedback_response_id UUID NOT NULL REFERENCES feedback_responses(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'escalated', 'closed')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  
  assigned_to UUID REFERENCES auth.users(id),
  resolution_notes TEXT,
  resolved_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Resolution messages
CREATE TABLE public.resolution_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES resolution_threads(id) ON DELETE CASCADE,
  
  sender_type TEXT NOT NULL CHECK (sender_type IN ('agency', 'respondent', 'system', 'ai_draft')),
  sender_id UUID,
  message TEXT NOT NULL,
  
  is_ai_generated BOOLEAN DEFAULT false,
  ai_approved_by UUID REFERENCES auth.users(id),
  ai_approved_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reputation KPIs - tracked metrics
CREATE TABLE public.reputation_kpis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Volume
  feedback_requests_sent INTEGER DEFAULT 0,
  feedback_responses_received INTEGER DEFAULT 0,
  response_rate NUMERIC(5,2),
  
  -- Sentiment
  positive_count INTEGER DEFAULT 0,
  neutral_count INTEGER DEFAULT 0,
  negative_count INTEGER DEFAULT 0,
  sentiment_score NUMERIC(5,2),
  
  -- Resolution
  resolution_threads_opened INTEGER DEFAULT 0,
  resolution_threads_closed INTEGER DEFAULT 0,
  avg_resolution_hours NUMERIC(10,2),
  
  -- Trend
  trend_direction TEXT CHECK (trend_direction IN ('improving', 'stable', 'declining')),
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(agency_id, period_start, period_end)
);

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Agency ranking rules - admin only
ALTER TABLE public.agency_ranking_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage ranking rules" ON public.agency_ranking_rules FOR ALL USING (is_super_admin());
CREATE POLICY "Public can view active ranking rules" ON public.agency_ranking_rules FOR SELECT USING (is_active = true);

-- Agency ranking overrides - admin only
ALTER TABLE public.agency_ranking_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage ranking overrides" ON public.agency_ranking_overrides FOR ALL USING (is_super_admin());

-- Agency trust scores - admin only
ALTER TABLE public.agency_trust_scores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage trust scores" ON public.agency_trust_scores FOR ALL USING (is_super_admin());
CREATE POLICY "Agencies can view own trust score" ON public.agency_trust_scores FOR SELECT 
  USING (EXISTS (SELECT 1 FROM agencies WHERE agencies.id = agency_trust_scores.agency_id AND agencies.user_id = auth.uid()));

-- Lead qualifications
ALTER TABLE public.lead_qualifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage lead qualifications" ON public.lead_qualifications FOR ALL USING (is_super_admin());
CREATE POLICY "Agencies can view their lead qualifications" ON public.lead_qualifications FOR SELECT 
  USING (EXISTS (SELECT 1 FROM leads l JOIN agencies a ON l.source_agency_id = a.id 
    WHERE l.id = lead_qualifications.lead_id AND a.user_id = auth.uid()));
CREATE POLICY "Public can insert own qualification" ON public.lead_qualifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can update own qualification" ON public.lead_qualifications FOR UPDATE USING (true);

-- Lead match indicators
ALTER TABLE public.lead_match_indicators ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage match indicators" ON public.lead_match_indicators FOR ALL USING (is_super_admin());
CREATE POLICY "Agencies can view their matches" ON public.lead_match_indicators FOR SELECT 
  USING (EXISTS (SELECT 1 FROM agencies WHERE agencies.id = lead_match_indicators.agency_id AND agencies.user_id = auth.uid()));

-- Feedback requests
ALTER TABLE public.feedback_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all feedback requests" ON public.feedback_requests FOR ALL USING (is_super_admin());
CREATE POLICY "Agencies manage own feedback requests" ON public.feedback_requests FOR ALL 
  USING (EXISTS (SELECT 1 FROM agencies WHERE agencies.id = feedback_requests.agency_id AND agencies.user_id = auth.uid()));

-- Feedback responses
ALTER TABLE public.feedback_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all feedback responses" ON public.feedback_responses FOR ALL USING (is_super_admin());
CREATE POLICY "Agencies can view own feedback responses" ON public.feedback_responses FOR SELECT 
  USING (EXISTS (SELECT 1 FROM agencies WHERE agencies.id = feedback_responses.agency_id AND agencies.user_id = auth.uid()));
CREATE POLICY "Public can insert feedback responses" ON public.feedback_responses FOR INSERT WITH CHECK (true);

-- Resolution threads
ALTER TABLE public.resolution_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all resolution threads" ON public.resolution_threads FOR ALL USING (is_super_admin());
CREATE POLICY "Agencies manage own resolution threads" ON public.resolution_threads FOR ALL 
  USING (EXISTS (SELECT 1 FROM agencies WHERE agencies.id = resolution_threads.agency_id AND agencies.user_id = auth.uid()));

-- Resolution messages
ALTER TABLE public.resolution_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all resolution messages" ON public.resolution_messages FOR ALL USING (is_super_admin());
CREATE POLICY "Thread participants can view messages" ON public.resolution_messages FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM resolution_threads rt 
    JOIN agencies a ON rt.agency_id = a.id 
    WHERE rt.id = resolution_messages.thread_id AND a.user_id = auth.uid()
  ));
CREATE POLICY "Thread participants can insert messages" ON public.resolution_messages FOR INSERT 
  WITH CHECK (EXISTS (
    SELECT 1 FROM resolution_threads rt 
    JOIN agencies a ON rt.agency_id = a.id 
    WHERE rt.id = resolution_messages.thread_id AND a.user_id = auth.uid()
  ));

-- Reputation KPIs
ALTER TABLE public.reputation_kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage all reputation KPIs" ON public.reputation_kpis FOR ALL USING (is_super_admin());
CREATE POLICY "Agencies can view own reputation KPIs" ON public.reputation_kpis FOR SELECT 
  USING (EXISTS (SELECT 1 FROM agencies WHERE agencies.id = reputation_kpis.agency_id AND agencies.user_id = auth.uid()));

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER update_agency_ranking_rules_updated_at
  BEFORE UPDATE ON public.agency_ranking_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lead_qualifications_updated_at
  BEFORE UPDATE ON public.lead_qualifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resolution_threads_updated_at
  BEFORE UPDATE ON public.resolution_threads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agency_trust_scores_updated_at
  BEFORE UPDATE ON public.agency_trust_scores
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DEFAULT RANKING RULES
-- =====================================================

INSERT INTO public.agency_ranking_rules (scope_type, scope_id, name, description) VALUES
('global', NULL, 'Global Default Ranking', 'Default ranking rules applied across all pages');

-- =====================================================
-- ADD COLUMNS TO EXISTING TABLES
-- =====================================================

-- Add intent_depth to leads
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS intent_depth TEXT CHECK (intent_depth IN ('low', 'medium', 'high'));
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS qualification_complete BOOLEAN DEFAULT false;