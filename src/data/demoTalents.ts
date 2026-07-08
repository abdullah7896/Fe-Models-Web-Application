/** Static showcase talents — shown instantly while the API loads */
export interface ShowcaseTalent {
  id: string;
  name: string;
  firstName: string;
  image: string;
  location: string;
  category: string;
  subcategory: string;
  isDemo: boolean;
  profileState?: Record<string, unknown>;
}

export const DEMO_TALENTS: ShowcaseTalent[] = [
  {
    id: 'demo-1',
    name: 'Sofia Laurent',
    firstName: 'Sofia',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
    location: 'Dubai, UAE',
    category: 'Models',
    subcategory: 'Female Model',
    isDemo: true,
  },
  {
    id: 'demo-2',
    name: 'James Mitchell',
    firstName: 'James',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=800&fit=crop',
    location: 'Dubai, UAE',
    category: 'Models',
    subcategory: 'Male Model',
    isDemo: true,
  },
  {
    id: 'demo-3',
    name: 'Amira Hassan',
    firstName: 'Amira',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
    location: 'Abu Dhabi, UAE',
    category: 'Models',
    subcategory: 'Female Model',
    isDemo: true,
  },
  {
    id: 'demo-4',
    name: 'Marcus Chen',
    firstName: 'Marcus',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop',
    location: 'Dubai, UAE',
    category: 'Actor',
    subcategory: 'Male Actor',
    isDemo: true,
  },
  {
    id: 'demo-5',
    name: 'Elena Rossi',
    firstName: 'Elena',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop',
    location: 'Dubai, UAE',
    category: 'Social Media',
    subcategory: 'Influencer',
    isDemo: true,
  },
  {
    id: 'demo-6',
    name: 'David Okonkwo',
    firstName: 'David',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=800&fit=crop',
    location: 'Dubai, UAE',
    category: 'Models',
    subcategory: 'Fitness Model',
    isDemo: true,
  },
  {
    id: 'demo-7',
    name: 'Layla Al Mansouri',
    firstName: 'Layla',
    image: 'https://images.unsplash.com/photo-1517841906550-8783959946f6?w=600&h=800&fit=crop',
    location: 'Dubai, UAE',
    category: 'Creative Artist',
    subcategory: 'Makeup Artist',
    isDemo: true,
  },
  {
    id: 'demo-8',
    name: 'Ryan Foster',
    firstName: 'Ryan',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=800&fit=crop',
    location: 'Dubai, UAE',
    category: 'Production',
    subcategory: 'Photographer',
    isDemo: true,
  },
];
