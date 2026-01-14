-- Fix function search paths for security
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.handle_agency_claim()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user_id IS NOT NULL AND OLD.user_id IS NULL THEN
    INSERT INTO public.agency_workspaces (agency_id, name)
    VALUES (NEW.id, NEW.name || ' Workspace');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;