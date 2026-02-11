export interface Specialism {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    seo_title: string | null;
    seo_description: string | null;
    display_order: number | null;
    is_active: boolean | null;
    content: unknown;
    created_at: string | null;
    updated_at: string | null;
}

// Static specialisms data as fallback
export const STATIC_SPECIALISMS: Specialism[] = [
    { id: "1", name: "Therapeutic Fostering", slug: "therapeutic-fostering", description: "Specialised care for children with trauma and complex emotional needs", icon: "Heart", seo_title: null, seo_description: null, display_order: 1, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "2", name: "Emergency Fostering", slug: "emergency-fostering", description: "Immediate placements for children in urgent need of safe care", icon: "AlertCircle", seo_title: null, seo_description: null, display_order: 2, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "3", name: "Short-term Fostering", slug: "short-term-fostering", description: "Temporary care while long-term plans are developed", icon: "Clock", seo_title: null, seo_description: null, display_order: 3, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "4", name: "Long-term Fostering", slug: "long-term-fostering", description: "Providing a stable home until adulthood", icon: "Home", seo_title: null, seo_description: null, display_order: 4, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "5", name: "Respite Fostering", slug: "respite-fostering", description: "Short breaks for foster families and birth families", icon: "Coffee", seo_title: null, seo_description: null, display_order: 5, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "6", name: "Parent and Child Fostering", slug: "parent-child-fostering", description: "Supporting parents and their children together", icon: "Users", seo_title: null, seo_description: null, display_order: 6, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "7", name: "Sibling Group Fostering", slug: "sibling-group-fostering", description: "Keeping brothers and sisters together", icon: "Users", seo_title: null, seo_description: null, display_order: 7, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "8", name: "Teen Fostering", slug: "teen-fostering", description: "Specialist support for teenagers", icon: "GraduationCap", seo_title: null, seo_description: null, display_order: 8, is_active: true, content: null, created_at: null, updated_at: null },
    { id: "9", name: "Disability Fostering", slug: "disability-fostering", description: "Caring for children with disabilities", icon: "Accessibility", seo_title: null, seo_description: null, display_order: 9, is_active: true, content: null, created_at: null, updated_at: null },
];
