import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Specialism {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  icon_name: string | null;
  seo_title: string | null;
  seo_description: string | null;
  hero_content: string | null;
  faq_content: unknown;
  display_order: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

// Static specialisms data until database table is created
export const STATIC_SPECIALISMS: Specialism[] = [
  { id: "1", name: "Therapeutic Fostering", slug: "therapeutic-fostering", description: "Specialised care for children with trauma and complex emotional needs", long_description: "Therapeutic fostering provides intensive support for children who have experienced significant trauma.", icon_name: "Heart", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 1, is_active: true, created_at: "", updated_at: "" },
  { id: "2", name: "Emergency Fostering", slug: "emergency-fostering", description: "Immediate placements for children in urgent need of safe care", long_description: "Emergency foster carers provide immediate, short-term care for children who need to be removed urgently.", icon_name: "AlertCircle", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 2, is_active: true, created_at: "", updated_at: "" },
  { id: "3", name: "Short-term Fostering", slug: "short-term-fostering", description: "Temporary care while long-term plans are developed", long_description: "Short-term fostering provides care for children for a defined period, usually up to two years.", icon_name: "Clock", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 3, is_active: true, created_at: "", updated_at: "" },
  { id: "4", name: "Long-term Fostering", slug: "long-term-fostering", description: "Providing a stable home until adulthood", long_description: "Long-term fostering offers children a permanent family environment.", icon_name: "Home", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 4, is_active: true, created_at: "", updated_at: "" },
  { id: "5", name: "Respite Fostering", slug: "respite-fostering", description: "Short breaks for foster families and birth families", long_description: "Respite foster carers provide short-term care to give other foster carers or birth families a break.", icon_name: "Coffee", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 5, is_active: true, created_at: "", updated_at: "" },
  { id: "6", name: "Parent and Child Fostering", slug: "parent-child-fostering", description: "Supporting parents and their children together", long_description: "Parent and child placements allow a parent to live with foster carers alongside their child.", icon_name: "Users", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 6, is_active: true, created_at: "", updated_at: "" },
  { id: "7", name: "Sibling Group Fostering", slug: "sibling-group-fostering", description: "Keeping brothers and sisters together", long_description: "Sibling group foster carers have the space and skills to care for two or more siblings together.", icon_name: "Users", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 7, is_active: true, created_at: "", updated_at: "" },
  { id: "8", name: "Teen Fostering", slug: "teen-fostering", description: "Specialist support for teenagers", long_description: "Fostering teenagers requires specific skills and understanding of adolescent development.", icon_name: "GraduationCap", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 8, is_active: true, created_at: "", updated_at: "" },
  { id: "9", name: "Disability Fostering", slug: "disability-fostering", description: "Caring for children with disabilities", long_description: "Disability foster carers have additional training to care for children with physical disabilities or learning difficulties.", icon_name: "Accessibility", seo_title: null, seo_description: null, hero_content: null, faq_content: null, display_order: 9, is_active: true, created_at: "", updated_at: "" },
];

export function useSpecialisms() {
  return useQuery({
    queryKey: ["specialisms"],
    queryFn: async () => {
      // Return static data - will query database once table exists
      return STATIC_SPECIALISMS;
    },
  });
}

export function useSpecialismBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["specialism", slug],
    queryFn: async () => {
      if (!slug) return null;
      return STATIC_SPECIALISMS.find(s => s.slug === slug) || null;
    },
    enabled: !!slug,
  });
}

export function useAgenciesBySpecialism(specialismId: string | undefined, limit = 12) {
  return useQuery({
    queryKey: ["agenciesBySpecialism", specialismId, limit],
    queryFn: async () => {
      // Return empty array until junction table exists
      return [];
    },
    enabled: !!specialismId,
  });
}
