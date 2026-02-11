// Mock data for SEO implementation
// In production, this would connect to your database

export interface Agency {
  id: string;
  name: string;
  slug: string;
  location: string;
  specialisms: string[];
  description: string;
  rating: number;
  reviewCount: number;
  phone?: string;
  email?: string;
  address?: string;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: 'country' | 'region' | 'city';
  parent?: string;
}

export interface Specialism {
  id: string;
  name: string;
  slug: string;
  description: string;
}

// Mock agencies data
export const mockAgencies: Agency[] = [
  {
    id: '1',
    name: 'National Fostering Group',
    slug: 'national-fostering-group',
    location: 'London',
    specialisms: ['short-term', 'long-term', 'emergency'],
    description: 'Leading independent fostering agency providing high-quality care across the UK.',
    rating: 4.8,
    reviewCount: 127
  },
  {
    id: '2',
    name: 'Foster Care Associates',
    slug: 'foster-care-associates',
    location: 'Manchester',
    specialisms: ['therapeutic', 'parent-child', 'respite'],
    description: 'Specialist therapeutic fostering agency with over 20 years experience.',
    rating: 4.9,
    reviewCount: 89
  }
];

// Mock locations data
export const mockLocations: Location[] = [
  { id: '1', name: 'England', slug: 'england', type: 'country' },
  { id: '2', name: 'London', slug: 'london', type: 'city', parent: 'england' },
  { id: '3', name: 'Manchester', slug: 'manchester', type: 'city', parent: 'england' },
  { id: '4', name: 'Birmingham', slug: 'birmingham', type: 'city', parent: 'england' }
];

// Mock specialisms data
export const mockSpecialisms: Specialism[] = [
  { id: '1', name: 'Short Term Fostering', slug: 'short-term-fostering', description: 'Temporary care for children needing short-term placement' },
  { id: '2', name: 'Long Term Fostering', slug: 'long-term-fostering', description: 'Permanent care arrangements for children' },
  { id: '3', name: 'Emergency Fostering', slug: 'emergency-fostering', description: 'Immediate placement for children in crisis' }
];

// Export functions to get data
export async function getAgencies(): Promise<Agency[]> {
  return mockAgencies;
}

export async function getLocations(): Promise<Location[]> {
  return mockLocations;
}

export async function getSpecialisms(): Promise<Specialism[]> {
  return mockSpecialisms;
}

export async function getAgencyBySlug(slug: string): Promise<Agency | null> {
  return mockAgencies.find(agency => agency.slug === slug) || null;
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  return mockLocations.find(location => location.slug === slug) || null;
}

export async function getSpecialismBySlug(slug: string): Promise<Specialism | null> {
  return mockSpecialisms.find(specialism => specialism.slug === slug) || null;
}