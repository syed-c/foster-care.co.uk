-- =====================================================
-- COMPLETE ENGLAND FOSTERING DIRECTORY DATABASE SCHEMA
-- =====================================================

-- 1. PROFILES TABLE (Extended user profiles)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'agency_owner', 'agency_admin', 'agency_manager', 'agency_staff', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. LOCATIONS TABLE (England hierarchy: Country > Region > County > City > Area)
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('country', 'region', 'county', 'city', 'area')),
  parent_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  description TEXT,
  seo_title TEXT,
  seo_description TEXT,
  agency_count INTEGER DEFAULT 0,
  population INTEGER,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. SPECIALISMS TABLE
CREATE TABLE public.specialisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  seo_title TEXT,
  seo_description TEXT,
  content JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. AGENCIES TABLE (Core agency data with claim status)
CREATE TABLE public.agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  
  -- Contact & Location
  address TEXT,
  city TEXT,
  county TEXT,
  postcode TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- Agency Details
  agency_type TEXT CHECK (agency_type IN ('ifa', 'local_authority', 'charity', 'other')),
  acceptance_types TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  complex_needs_support BOOLEAN DEFAULT false,
  allowance_guidance JSONB DEFAULT '{}',
  response_time_hours INTEGER,
  
  -- Ratings & Reviews
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  
  -- Claim & Verification Status
  claim_status TEXT DEFAULT 'unclaimed' CHECK (claim_status IN ('unclaimed', 'claimed_pending', 'verified_synced', 'sync_error')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  claimed_at TIMESTAMPTZ,
  verified_at TIMESTAMPTZ,
  
  -- Google Sync
  gmb_place_id TEXT,
  gmb_last_sync TIMESTAMPTZ,
  gmb_sync_status TEXT DEFAULT 'none' CHECK (gmb_sync_status IN ('none', 'pending', 'synced', 'error')),
  
  -- Field Sources (tracks origin of each field)
  field_sources JSONB DEFAULT '{}',
  
  -- Data Source (Ofsted, manual, etc.)
  data_source TEXT DEFAULT 'manual',
  ofsted_urn TEXT,
  ofsted_rating TEXT,
  ofsted_last_inspection TIMESTAMPTZ,
  
  -- Flags
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. AGENCY WORKSPACES (Multi-tenant workspace for agencies)
CREATE TABLE public.agency_workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  onboarding_step INTEGER DEFAULT 1,
  onboarding_completed BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{"email_leads": true, "email_reviews": true}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 6. AGENCY TEAM MEMBERS
CREATE TABLE public.agency_team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.agency_workspaces(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'staff')),
  permissions JSONB DEFAULT '{"leads": true, "profile": false, "team": false, "tasks": true, "reports": false, "billing": false}',
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(workspace_id, user_id)
);

-- 7. AGENCY LOCATIONS (Coverage areas)
CREATE TABLE public.agency_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, location_id)
);

-- 8. AGENCY SPECIALISMS
CREATE TABLE public.agency_specialisms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  specialism_id UUID REFERENCES public.specialisms(id) ON DELETE CASCADE NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(agency_id, specialism_id)
);

-- 9. LEADS / ENQUIRIES
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Lead Source
  source_agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL,
  source_location_id UUID REFERENCES public.locations(id) ON DELETE SET NULL,
  source_page TEXT,
  
  -- Contact Info
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  postcode TEXT,
  
  -- Enquiry Details
  message TEXT,
  fostering_interest TEXT[],
  preferred_contact TEXT DEFAULT 'email',
  
  -- Status Tracking
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed', 'spam')),
  tags TEXT[] DEFAULT '{}',
  notes JSONB DEFAULT '[]',
  
  -- Assignment
  assigned_to UUID REFERENCES auth.users(id),
  
  -- Consent
  marketing_consent BOOLEAN DEFAULT false,
  privacy_accepted BOOLEAN DEFAULT true,
  
  -- Tracking
  is_viewed BOOLEAN DEFAULT false,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  converted_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. AGENCY TASKS
CREATE TABLE public.agency_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.agency_workspaces(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT DEFAULT 'general' CHECK (task_type IN ('general', 'follow_up', 'call', 'email', 'meeting', 'document', 'other')),
  
  due_date TIMESTAMPTZ,
  reminder_at TIMESTAMPTZ,
  
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  
  completed_at TIMESTAMPTZ,
  completed_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 11. AGENCY DOCUMENTS
CREATE TABLE public.agency_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.agency_workspaces(id) ON DELETE CASCADE NOT NULL,
  
  name TEXT NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  
  category TEXT DEFAULT 'general',
  is_template BOOLEAN DEFAULT false,
  
  uploaded_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 12. REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  
  author_name TEXT NOT NULL,
  author_email TEXT,
  author_user_id UUID REFERENCES auth.users(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  
  -- Moderation
  is_approved BOOLEAN DEFAULT false,
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  moderated_at TIMESTAMPTZ,
  moderated_by UUID REFERENCES auth.users(id),
  
  -- Response
  admin_response TEXT,
  admin_response_at TIMESTAMPTZ,
  
  -- Source
  source TEXT DEFAULT 'platform' CHECK (source IN ('platform', 'google', 'imported')),
  external_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 13. FAQS
CREATE TABLE public.faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  
  -- Scope
  scope TEXT DEFAULT 'global' CHECK (scope IN ('global', 'location', 'agency', 'specialism', 'page')),
  location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
  specialism_id UUID REFERENCES public.specialisms(id) ON DELETE CASCADE,
  page_key TEXT,
  
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 14. CMS CONTENT
CREATE TABLE public.cms_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page_key, section)
);

-- 15. BLOG POSTS
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image_url TEXT,
  
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT,
  
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  
  seo_title TEXT,
  seo_description TEXT,
  
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  
  view_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 16. SITE SETTINGS (Super Admin)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category TEXT DEFAULT 'general',
  description TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 17. AUDIT LOGS
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  actor_id UUID REFERENCES auth.users(id),
  actor_email TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 18. USER ROLES (for super admin access)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'agency_owner', 'admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, role)
);

-- 19. REDIRECTS (SEO)
CREATE TABLE public.redirects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_path TEXT NOT NULL UNIQUE,
  to_path TEXT NOT NULL,
  redirect_type INTEGER DEFAULT 301,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_locations_parent ON public.locations(parent_id);
CREATE INDEX idx_locations_type ON public.locations(type);
CREATE INDEX idx_locations_slug ON public.locations(slug);
CREATE INDEX idx_agencies_slug ON public.agencies(slug);
CREATE INDEX idx_agencies_city ON public.agencies(city);
CREATE INDEX idx_agencies_claim_status ON public.agencies(claim_status);
CREATE INDEX idx_agencies_user ON public.agencies(user_id);
CREATE INDEX idx_agency_locations_agency ON public.agency_locations(agency_id);
CREATE INDEX idx_agency_locations_location ON public.agency_locations(location_id);
CREATE INDEX idx_agency_specialisms_agency ON public.agency_specialisms(agency_id);
CREATE INDEX idx_leads_agency ON public.leads(source_agency_id);
CREATE INDEX idx_leads_status ON public.leads(status);
CREATE INDEX idx_tasks_workspace ON public.agency_tasks(workspace_id);
CREATE INDEX idx_tasks_assigned ON public.agency_tasks(assigned_to);
CREATE INDEX idx_reviews_agency ON public.reviews(agency_id);
CREATE INDEX idx_faqs_scope ON public.faqs(scope);
CREATE INDEX idx_audit_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_specialisms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.redirects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - PUBLIC READ
-- =====================================================

-- Locations: Public read
CREATE POLICY "Locations are publicly readable" ON public.locations FOR SELECT USING (is_active = true);

-- Specialisms: Public read
CREATE POLICY "Specialisms are publicly readable" ON public.specialisms FOR SELECT USING (is_active = true);

-- Agencies: Public read active
CREATE POLICY "Agencies are publicly readable" ON public.agencies FOR SELECT USING (is_active = true);

-- Reviews: Public read approved
CREATE POLICY "Approved reviews are publicly readable" ON public.reviews FOR SELECT USING (is_approved = true);

-- FAQs: Public read active
CREATE POLICY "FAQs are publicly readable" ON public.faqs FOR SELECT USING (is_active = true);

-- CMS Content: Public read active
CREATE POLICY "CMS content is publicly readable" ON public.cms_content FOR SELECT USING (is_active = true);

-- Blog Posts: Public read published
CREATE POLICY "Published posts are publicly readable" ON public.blog_posts FOR SELECT USING (status = 'published');

-- Agency Locations: Public read
CREATE POLICY "Agency locations are publicly readable" ON public.agency_locations FOR SELECT USING (true);

-- Agency Specialisms: Public read
CREATE POLICY "Agency specialisms are publicly readable" ON public.agency_specialisms FOR SELECT USING (true);

-- =====================================================
-- RLS POLICIES - USER OWNED DATA
-- =====================================================

-- Profiles: Users can manage own
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Leads: Users can create
CREATE POLICY "Anyone can create leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Reviews: Users can create
CREATE POLICY "Authenticated users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- =====================================================
-- RLS POLICIES - AGENCY WORKSPACE ACCESS
-- =====================================================

-- Check if user is agency owner or team member
CREATE OR REPLACE FUNCTION public.is_agency_team_member(agency_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.agencies a
    WHERE a.id = agency_uuid AND a.user_id = auth.uid()
  ) OR EXISTS (
    SELECT 1 FROM public.agency_team_members tm
    JOIN public.agency_workspaces w ON w.id = tm.workspace_id
    WHERE w.agency_id = agency_uuid AND tm.user_id = auth.uid() AND tm.is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if user is super admin
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Agencies: Owners can update
CREATE POLICY "Agency owners can update their agency" ON public.agencies 
  FOR UPDATE USING (user_id = auth.uid() OR public.is_super_admin());

-- Workspaces: Team access
CREATE POLICY "Team members can view workspace" ON public.agency_workspaces 
  FOR SELECT USING (public.is_agency_team_member(agency_id) OR public.is_super_admin());

CREATE POLICY "Agency owners can manage workspace" ON public.agency_workspaces 
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.agencies WHERE id = agency_id AND user_id = auth.uid())
    OR public.is_super_admin()
  );

-- Team members: Access rules
CREATE POLICY "Team members can view team" ON public.agency_team_members 
  FOR SELECT USING (
    user_id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM public.agency_workspaces w 
      JOIN public.agencies a ON a.id = w.agency_id 
      WHERE w.id = workspace_id AND a.user_id = auth.uid()
    )
    OR public.is_super_admin()
  );

-- Leads: Agency team access
CREATE POLICY "Agency team can view their leads" ON public.leads 
  FOR SELECT USING (
    public.is_agency_team_member(source_agency_id) OR public.is_super_admin()
  );

CREATE POLICY "Agency team can update their leads" ON public.leads 
  FOR UPDATE USING (
    public.is_agency_team_member(source_agency_id) OR public.is_super_admin()
  );

-- Tasks: Workspace access
CREATE POLICY "Team can view workspace tasks" ON public.agency_tasks 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agency_workspaces w
      WHERE w.id = workspace_id AND public.is_agency_team_member(w.agency_id)
    ) OR public.is_super_admin()
  );

CREATE POLICY "Team can manage workspace tasks" ON public.agency_tasks 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.agency_workspaces w
      WHERE w.id = workspace_id AND public.is_agency_team_member(w.agency_id)
    ) OR public.is_super_admin()
  );

-- Documents: Workspace access
CREATE POLICY "Team can view workspace documents" ON public.agency_documents 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agency_workspaces w
      WHERE w.id = workspace_id AND public.is_agency_team_member(w.agency_id)
    ) OR public.is_super_admin()
  );

CREATE POLICY "Team can manage workspace documents" ON public.agency_documents 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.agency_workspaces w
      WHERE w.id = workspace_id AND public.is_agency_team_member(w.agency_id)
    ) OR public.is_super_admin()
  );

-- =====================================================
-- RLS POLICIES - SUPER ADMIN
-- =====================================================

CREATE POLICY "Super admins can manage locations" ON public.locations FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage specialisms" ON public.specialisms FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage all agencies" ON public.agencies FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage all reviews" ON public.reviews FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage faqs" ON public.faqs FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage cms" ON public.cms_content FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage blog" ON public.blog_posts FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage site settings" ON public.site_settings FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_super_admin());
CREATE POLICY "Super admins can manage user roles" ON public.user_roles FOR ALL USING (public.is_super_admin());
CREATE POLICY "Super admins can manage redirects" ON public.redirects FOR ALL USING (public.is_super_admin());

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_specialisms_updated_at BEFORE UPDATE ON public.specialisms FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON public.agencies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON public.agency_workspaces FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.agency_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON public.agency_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_cms_updated_at BEFORE UPDATE ON public.cms_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create workspace when agency is claimed
CREATE OR REPLACE FUNCTION public.handle_agency_claim()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND OLD.user_id IS NULL THEN
    INSERT INTO public.agency_workspaces (agency_id, name)
    VALUES (NEW.id, NEW.name || ' Workspace');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_agency_claimed
  AFTER UPDATE ON public.agencies
  FOR EACH ROW EXECUTE FUNCTION public.handle_agency_claim();

-- Update agency rating when review is added
CREATE OR REPLACE FUNCTION public.update_agency_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.agencies
  SET 
    rating = (SELECT AVG(rating) FROM public.reviews WHERE agency_id = COALESCE(NEW.agency_id, OLD.agency_id) AND is_approved = true),
    review_count = (SELECT COUNT(*) FROM public.reviews WHERE agency_id = COALESCE(NEW.agency_id, OLD.agency_id) AND is_approved = true)
  WHERE id = COALESCE(NEW.agency_id, OLD.agency_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_review_change
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_agency_rating();

-- =====================================================
-- SEED DATA - SPECIALISMS
-- =====================================================

INSERT INTO public.specialisms (name, slug, description, icon, display_order) VALUES
  ('Emergency Foster Care', 'emergency', 'Providing immediate, short-term care for children in crisis situations who need urgent placement.', 'Siren', 1),
  ('Short-term Foster Care', 'short-term', 'Temporary care arrangements while long-term plans are being made for the child.', 'Clock', 2),
  ('Long-term Foster Care', 'long-term', 'Providing a stable, permanent home for children who cannot return to their birth families.', 'Home', 3),
  ('Respite Foster Care', 'respite', 'Giving regular foster carers a break by providing temporary care for their foster children.', 'Heart', 4),
  ('Therapeutic Foster Care', 'therapeutic', 'Specialized care for children with complex emotional, behavioral, or mental health needs.', 'Brain', 5),
  ('Parent and Child Foster Care', 'parent-child', 'Supporting young parents and their babies together in a foster placement.', 'Users', 6),
  ('Sibling Groups', 'sibling-groups', 'Keeping brothers and sisters together in the same foster placement.', 'UsersRound', 7),
  ('Teenagers', 'teenagers', 'Specialized care and support for adolescents aged 13-18.', 'GraduationCap', 8),
  ('Unaccompanied Asylum Seekers', 'asylum-seekers', 'Supporting young people who have arrived in the UK seeking asylum without a parent or guardian.', 'Globe', 9),
  ('Children with Disabilities', 'disabilities', 'Caring for children with physical, learning, or sensory disabilities.', 'Accessibility', 10),
  ('Mother and Baby', 'mother-baby', 'Providing assessment and support for mothers with their newborn babies.', 'Baby', 11),
  ('Remand Foster Care', 'remand', 'Providing placements for young people on remand as an alternative to custody.', 'Shield', 12);

-- =====================================================
-- SEED DATA - ENGLAND LOCATION HIERARCHY
-- =====================================================

-- England (Country)
INSERT INTO public.locations (name, slug, type, description, seo_title, seo_description) VALUES
  ('England', 'england', 'country', 'Find foster care agencies across England. Compare local and independent fostering services to start your fostering journey.', 'Foster Care Agencies in England | Find Fostering Services', 'Discover trusted foster care agencies across England. Compare verified fostering agencies, read reviews, and find the right support for your fostering journey.');

-- Get England ID for parent references
DO $$
DECLARE
  england_id UUID;
  north_east_id UUID;
  north_west_id UUID;
  yorkshire_id UUID;
  east_midlands_id UUID;
  west_midlands_id UUID;
  east_id UUID;
  london_id UUID;
  south_east_id UUID;
  south_west_id UUID;
BEGIN
  SELECT id INTO england_id FROM public.locations WHERE slug = 'england';
  
  -- Regions
  INSERT INTO public.locations (name, slug, type, parent_id, description) VALUES
    ('North East', 'north-east', 'region', england_id, 'Foster care agencies in North East England including Newcastle, Durham, and Sunderland.'),
    ('North West', 'north-west', 'region', england_id, 'Foster care agencies in North West England including Manchester, Liverpool, and Lancashire.'),
    ('Yorkshire and The Humber', 'yorkshire', 'region', england_id, 'Foster care agencies across Yorkshire including Leeds, Sheffield, and Hull.'),
    ('East Midlands', 'east-midlands', 'region', england_id, 'Foster care agencies in the East Midlands including Nottingham, Leicester, and Derby.'),
    ('West Midlands', 'west-midlands', 'region', england_id, 'Foster care agencies in the West Midlands including Birmingham, Coventry, and Wolverhampton.'),
    ('East of England', 'east-of-england', 'region', england_id, 'Foster care agencies in East of England including Norfolk, Suffolk, and Essex.'),
    ('London', 'london', 'region', england_id, 'Foster care agencies across Greater London including all 32 boroughs.'),
    ('South East', 'south-east', 'region', england_id, 'Foster care agencies in South East England including Kent, Surrey, and Hampshire.'),
    ('South West', 'south-west', 'region', england_id, 'Foster care agencies in South West England including Bristol, Devon, and Cornwall.');

  -- Get region IDs
  SELECT id INTO north_east_id FROM public.locations WHERE slug = 'north-east';
  SELECT id INTO north_west_id FROM public.locations WHERE slug = 'north-west';
  SELECT id INTO yorkshire_id FROM public.locations WHERE slug = 'yorkshire';
  SELECT id INTO east_midlands_id FROM public.locations WHERE slug = 'east-midlands';
  SELECT id INTO west_midlands_id FROM public.locations WHERE slug = 'west-midlands';
  SELECT id INTO east_id FROM public.locations WHERE slug = 'east-of-england';
  SELECT id INTO london_id FROM public.locations WHERE slug = 'london';
  SELECT id INTO south_east_id FROM public.locations WHERE slug = 'south-east';
  SELECT id INTO south_west_id FROM public.locations WHERE slug = 'south-west';

  -- Counties/Major Cities
  -- North East
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('County Durham', 'county-durham', 'county', north_east_id),
    ('Northumberland', 'northumberland', 'county', north_east_id),
    ('Tyne and Wear', 'tyne-and-wear', 'county', north_east_id),
    ('Newcastle upon Tyne', 'newcastle', 'city', north_east_id),
    ('Sunderland', 'sunderland', 'city', north_east_id);

  -- North West
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('Greater Manchester', 'greater-manchester', 'county', north_west_id),
    ('Lancashire', 'lancashire', 'county', north_west_id),
    ('Merseyside', 'merseyside', 'county', north_west_id),
    ('Cheshire', 'cheshire', 'county', north_west_id),
    ('Cumbria', 'cumbria', 'county', north_west_id),
    ('Manchester', 'manchester', 'city', north_west_id),
    ('Liverpool', 'liverpool', 'city', north_west_id);

  -- Yorkshire
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('North Yorkshire', 'north-yorkshire', 'county', yorkshire_id),
    ('South Yorkshire', 'south-yorkshire', 'county', yorkshire_id),
    ('West Yorkshire', 'west-yorkshire', 'county', yorkshire_id),
    ('East Riding of Yorkshire', 'east-riding', 'county', yorkshire_id),
    ('Leeds', 'leeds', 'city', yorkshire_id),
    ('Sheffield', 'sheffield', 'city', yorkshire_id),
    ('Bradford', 'bradford', 'city', yorkshire_id),
    ('Hull', 'hull', 'city', yorkshire_id);

  -- East Midlands
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('Derbyshire', 'derbyshire', 'county', east_midlands_id),
    ('Leicestershire', 'leicestershire', 'county', east_midlands_id),
    ('Lincolnshire', 'lincolnshire', 'county', east_midlands_id),
    ('Northamptonshire', 'northamptonshire', 'county', east_midlands_id),
    ('Nottinghamshire', 'nottinghamshire', 'county', east_midlands_id),
    ('Nottingham', 'nottingham', 'city', east_midlands_id),
    ('Leicester', 'leicester', 'city', east_midlands_id),
    ('Derby', 'derby', 'city', east_midlands_id);

  -- West Midlands
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('Staffordshire', 'staffordshire', 'county', west_midlands_id),
    ('Warwickshire', 'warwickshire', 'county', west_midlands_id),
    ('Worcestershire', 'worcestershire', 'county', west_midlands_id),
    ('Shropshire', 'shropshire', 'county', west_midlands_id),
    ('Birmingham', 'birmingham', 'city', west_midlands_id),
    ('Coventry', 'coventry', 'city', west_midlands_id),
    ('Wolverhampton', 'wolverhampton', 'city', west_midlands_id);

  -- East of England
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('Cambridgeshire', 'cambridgeshire', 'county', east_id),
    ('Essex', 'essex', 'county', east_id),
    ('Hertfordshire', 'hertfordshire', 'county', east_id),
    ('Norfolk', 'norfolk', 'county', east_id),
    ('Suffolk', 'suffolk', 'county', east_id),
    ('Bedfordshire', 'bedfordshire', 'county', east_id),
    ('Cambridge', 'cambridge', 'city', east_id),
    ('Norwich', 'norwich', 'city', east_id);

  -- London Boroughs (sample)
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('Central London', 'central-london', 'area', london_id),
    ('North London', 'north-london', 'area', london_id),
    ('South London', 'south-london', 'area', london_id),
    ('East London', 'east-london', 'area', london_id),
    ('West London', 'west-london', 'area', london_id);

  -- South East
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('Kent', 'kent', 'county', south_east_id),
    ('Surrey', 'surrey', 'county', south_east_id),
    ('Hampshire', 'hampshire', 'county', south_east_id),
    ('Sussex', 'sussex', 'county', south_east_id),
    ('Berkshire', 'berkshire', 'county', south_east_id),
    ('Oxfordshire', 'oxfordshire', 'county', south_east_id),
    ('Brighton', 'brighton', 'city', south_east_id),
    ('Southampton', 'southampton', 'city', south_east_id),
    ('Portsmouth', 'portsmouth', 'city', south_east_id),
    ('Reading', 'reading', 'city', south_east_id),
    ('Oxford', 'oxford', 'city', south_east_id);

  -- South West
  INSERT INTO public.locations (name, slug, type, parent_id) VALUES
    ('Cornwall', 'cornwall', 'county', south_west_id),
    ('Devon', 'devon', 'county', south_west_id),
    ('Dorset', 'dorset', 'county', south_west_id),
    ('Somerset', 'somerset', 'county', south_west_id),
    ('Gloucestershire', 'gloucestershire', 'county', south_west_id),
    ('Wiltshire', 'wiltshire', 'county', south_west_id),
    ('Bristol', 'bristol', 'city', south_west_id),
    ('Plymouth', 'plymouth', 'city', south_west_id),
    ('Exeter', 'exeter', 'city', south_west_id),
    ('Bath', 'bath', 'city', south_west_id);
END $$;

-- =====================================================
-- SEED DATA - SITE SETTINGS
-- =====================================================

INSERT INTO public.site_settings (key, value, category, description) VALUES
  ('site_name', '"Foster Care UK"', 'brand', 'Main site name'),
  ('site_tagline', '"Find Your Perfect Foster Care Agency"', 'brand', 'Site tagline'),
  ('contact_email', '"hello@fostercare.uk"', 'contact', 'Main contact email'),
  ('contact_phone', '"0800 123 4567"', 'contact', 'Main contact phone'),
  ('social_twitter', '"@fostercareuk"', 'social', 'Twitter handle'),
  ('social_facebook', '"fostercareuk"', 'social', 'Facebook page'),
  ('social_linkedin', '"foster-care-uk"', 'social', 'LinkedIn page'),
  ('primary_color', '"160 42% 40%"', 'theme', 'Primary brand color (HSL)'),
  ('secondary_color', '"220 20% 14%"', 'theme', 'Secondary brand color (HSL)');

-- =====================================================
-- SEED DATA - HOME PAGE FAQS
-- =====================================================

INSERT INTO public.faqs (question, answer, scope, page_key, display_order) VALUES
  ('What is foster care?', 'Foster care is when a child lives with a family other than their birth family, usually on a temporary basis. Foster carers provide a safe, nurturing home for children who cannot live with their parents.', 'page', 'home', 1),
  ('Who can become a foster carer?', 'Almost anyone can become a foster carer regardless of age, marital status, sexuality, or whether you own your own home. You need a spare bedroom, patience, and a genuine desire to help children.', 'page', 'home', 2),
  ('How long does the fostering process take?', 'The assessment process typically takes 4-6 months. This includes training, home visits, background checks, and panel approval.', 'page', 'home', 3),
  ('Do I need fostering experience?', 'No previous fostering experience is required. Agencies provide comprehensive training and ongoing support throughout your fostering journey.', 'page', 'home', 4),
  ('Will I be paid to foster?', 'Yes, foster carers receive a fostering allowance to cover the cost of caring for a child, plus a fee for your time and skills. Rates vary by agency and placement type.', 'page', 'home', 5);
