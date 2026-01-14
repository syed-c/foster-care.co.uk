-- Create pricing plans table
CREATE TABLE public.pricing_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  tagline TEXT,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  is_popular BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  features JSONB DEFAULT '[]'::jsonb,
  who_is_for TEXT,
  pain_removed TEXT,
  risk_not_using TEXT,
  why_monthly TEXT,
  success_looks_like TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create agency subscriptions table
CREATE TABLE public.agency_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES public.pricing_plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(agency_id)
);

-- Create inquiry tracking table (for verified inquiries)
CREATE TABLE public.inquiry_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('form_submit', 'call_intent', 'chat_contact', 'website_visit')),
  source_page TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create reputation tracking table
CREATE TABLE public.reputation_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('feedback_request', 'review_received', 'testimonial_approved', 'response_sent')),
  review_id UUID REFERENCES public.reviews(id) ON DELETE SET NULL,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create page content blocks for CMS
CREATE TABLE public.page_content_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  block_key TEXT NOT NULL,
  block_type TEXT NOT NULL DEFAULT 'text' CHECK (block_type IN ('text', 'html', 'json', 'image', 'hero', 'cta', 'faq', 'testimonials')),
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(page_key, block_key)
);

-- Enable RLS on new tables
ALTER TABLE public.pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiry_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reputation_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_content_blocks ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pricing_plans (public read, admin write)
CREATE POLICY "Anyone can view active pricing plans" ON public.pricing_plans
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage pricing plans" ON public.pricing_plans
  FOR ALL USING (public.is_super_admin());

-- RLS Policies for agency_subscriptions
CREATE POLICY "Agencies can view their own subscription" ON public.agency_subscriptions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agencies 
      WHERE agencies.id = agency_subscriptions.agency_id 
      AND agencies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all subscriptions" ON public.agency_subscriptions
  FOR ALL USING (public.is_super_admin());

-- RLS Policies for inquiry_events
CREATE POLICY "Agencies can view their own inquiry events" ON public.inquiry_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agencies 
      WHERE agencies.id = inquiry_events.agency_id 
      AND agencies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all inquiry events" ON public.inquiry_events
  FOR ALL USING (public.is_super_admin());

-- RLS Policies for reputation_events
CREATE POLICY "Agencies can view their own reputation events" ON public.reputation_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agencies 
      WHERE agencies.id = reputation_events.agency_id 
      AND agencies.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all reputation events" ON public.reputation_events
  FOR ALL USING (public.is_super_admin());

-- RLS Policies for page_content_blocks (public read, admin write)
CREATE POLICY "Anyone can view active content blocks" ON public.page_content_blocks
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage content blocks" ON public.page_content_blocks
  FOR ALL USING (public.is_super_admin());

-- Insert the 3 monthly plans
INSERT INTO public.pricing_plans (name, slug, tagline, price_monthly, is_popular, display_order, who_is_for, pain_removed, risk_not_using, why_monthly, success_looks_like, features)
VALUES 
(
  'Verified Presence',
  'verified-presence',
  'Establish trust and visibility',
  49.00,
  false,
  1,
  'Agencies who want to be found and trusted by potential foster carers in their local area.',
  'Invisible or unclaimed profiles that make you look inactive or untrustworthy.',
  'Potential foster carers will assume you''re not operating or not reputable.',
  'No annual lock-in. Stay visible month-to-month. Cancel anytime with no penalties.',
  'Your agency appears verified, professional, and trustworthy to every visitor.',
  '[
    {"name": "Verified agency badge", "included": true},
    {"name": "Claimed profile ownership", "included": true},
    {"name": "Basic profile editing", "included": true},
    {"name": "Inquiry notifications", "included": true},
    {"name": "Public review display", "included": true},
    {"name": "Local area visibility", "included": true}
  ]'::jsonb
),
(
  'Growth Engine',
  'growth-engine',
  'Turn visibility into verified inquiries',
  149.00,
  true,
  2,
  'Agencies ready to grow. You have capacity and want a steady stream of qualified foster carer interest.',
  'Wasted time on low-quality leads. No visibility into what''s working. Manual tracking chaos.',
  'Competitors with better systems will capture the foster carers you should be reaching.',
  'Growth happens monthly. Adjust your strategy each month based on real data.',
  'A clear pipeline of verified inquiries, organised by status, with full visibility.',
  '[
    {"name": "Everything in Verified Presence", "included": true},
    {"name": "Priority search placement", "included": true},
    {"name": "Inquiry intelligence dashboard", "included": true},
    {"name": "Lead status tracking", "included": true},
    {"name": "Reputation management suite", "included": true},
    {"name": "Branded feedback collection", "included": true},
    {"name": "AI-drafted review responses", "included": true},
    {"name": "Multi-city SEO visibility", "included": true},
    {"name": "Monthly performance reports", "included": true}
  ]'::jsonb
),
(
  'Autopilot Growth',
  'autopilot-growth',
  'Your complete growth operating system',
  299.00,
  false,
  3,
  'Agencies who want hands-free growth infrastructure. You want to focus on fostering, not marketing.',
  'Time spent on websites, SEO, content, reputation. Scattered tools. No central command.',
  'You''ll stay stuck doing everything manually while competitors scale effortlessly.',
  'Your growth engine runs every month. Pause or cancel without losing your progress.',
  'A fully-managed presence that works while you focus on what matters: supporting children.',
  '[
    {"name": "Everything in Growth Engine", "included": true},
    {"name": "Platform-hosted agency website", "included": true},
    {"name": "AI content drafts (your approval)", "included": true},
    {"name": "Automatic SEO expansion", "included": true},
    {"name": "Featured agency placement", "included": true},
    {"name": "Advanced analytics dashboard", "included": true},
    {"name": "Priority support", "included": true},
    {"name": "Dedicated account manager", "included": true},
    {"name": "Quarterly strategy reviews", "included": true}
  ]'::jsonb
);

-- Create trigger for updated_at
CREATE TRIGGER update_pricing_plans_updated_at
  BEFORE UPDATE ON public.pricing_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_agency_subscriptions_updated_at
  BEFORE UPDATE ON public.agency_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_content_blocks_updated_at
  BEFORE UPDATE ON public.page_content_blocks
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();