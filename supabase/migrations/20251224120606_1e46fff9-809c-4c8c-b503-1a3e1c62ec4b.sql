-- Function to update agency_count on locations
CREATE OR REPLACE FUNCTION public.update_location_agency_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Handle INSERT
  IF TG_OP = 'INSERT' THEN
    UPDATE locations 
    SET agency_count = agency_count + 1 
    WHERE id = NEW.location_id;
    RETURN NEW;
  END IF;
  
  -- Handle DELETE
  IF TG_OP = 'DELETE' THEN
    UPDATE locations 
    SET agency_count = GREATEST(0, agency_count - 1) 
    WHERE id = OLD.location_id;
    RETURN OLD;
  END IF;
  
  -- Handle UPDATE (if location_id changes)
  IF TG_OP = 'UPDATE' AND OLD.location_id IS DISTINCT FROM NEW.location_id THEN
    UPDATE locations 
    SET agency_count = GREATEST(0, agency_count - 1) 
    WHERE id = OLD.location_id;
    
    UPDATE locations 
    SET agency_count = agency_count + 1 
    WHERE id = NEW.location_id;
    RETURN NEW;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create triggers on agency_locations table
CREATE TRIGGER on_agency_location_insert
  AFTER INSERT ON public.agency_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_location_agency_count();

CREATE TRIGGER on_agency_location_delete
  AFTER DELETE ON public.agency_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_location_agency_count();

CREATE TRIGGER on_agency_location_update
  AFTER UPDATE ON public.agency_locations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_location_agency_count();