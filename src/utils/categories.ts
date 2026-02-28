// Centralized category configuration
export const CATEGORY_CONFIG = {
  'Models': {
    title: 'Models',
    subcategories: ['Men', 'Women', 'Kids', 'Mature', 'Fitness']
  },
  'Production': {
    title: 'Production',
    subcategories: ['VFX/Editors', 'DOP', 'PHOTOGRAPHER', 'VideoGRAPHER', 'Drone Operator', 'Equipment', 'Location Permission']
  },
  'Actor': {
    title: 'Actor',
    subcategories: ['Men', 'Women', 'Kids', 'Teens', 'Mature', 'GCC NATIONALS']
  },
  'Social Media': {
    title: 'Social Media',
    subcategories: ['CONTENT CREATORS', 'YOUTUBERS', 'TIKTOKERS', 'INFLUENCERS']
  },
  'Creative Artist': {
    title: 'Creative Artist',
    subcategories: ['MAKEUP ARTIST', 'HAIR STYLIST', 'WARDROBE STYLIST', 'SET DESIGNER']
  },
  'MIX TALENTS': {
    title: 'MIX TALENTS',
    subcategories: ['HOSTESSES', 'PROMOTERS', 'COMEDIANS', 'BOUNCERS', 'DANCERS', 'MUSICIANS']
  }
} as const;

export const CATEGORIES = Object.keys(CATEGORY_CONFIG);

export type CategoryKey = keyof typeof CATEGORY_CONFIG;
export type Category = typeof CATEGORY_CONFIG[CategoryKey];

// Helper function to normalize old category/subcategory to new structure
export function normalizeCategory(category: string, subcategory?: string): { category: string, subcategory: string } {
  // Handle old "Models" category
  if (category === 'Models' || category === 'MODEL') {
    if (subcategory === 'Men' || subcategory === 'Women' || subcategory === 'Kids' || subcategory === 'Old') {
      return { category: 'Models', subcategory };
    }
    // Map old subcategories to new ones
    if (subcategory === 'New Faces' || subcategory === 'Arriving') {
      return { category: 'Models', subcategory: 'Women' }; // Default mapping
    }
    return { category: 'Models', subcategory: 'Men' };
  }

  // Handle old "Cast" category -> map to Actor
  if (category === 'Cast' || category === 'ACTOR') {
    if (subcategory === 'Women' || subcategory === 'Men') {
      return { category: 'Actor', subcategory: 'Men / Women' };
    }
    if (subcategory === 'Teen Girls' || subcategory === 'Teen Boys' || subcategory === 'Girls' || subcategory === 'Boys') {
      return { category: 'Actor', subcategory: 'Kids / Teens' };
    }
    return { category: 'Actor', subcategory: 'Men / Women' };
  }

  // Handle old "Influencers" -> map to Social Media
  if (category === 'Influencers' || category === 'SOCIAL MEDIA') {
    return { category: 'Social Media', subcategory: subcategory || 'Influencers' };
  }

  // Handle "Creative Artists" (plural) or "Stylists" -> map to Creative Artist
  if (category === 'Stylists' || category === 'ARTIST' || category === 'Creative Artists') {
    if (subcategory === 'Hair & Makeup') {
      return { category: 'Creative Artist', subcategory: 'MUA / Hairstylist' };
    }
    if (subcategory === 'Fashion' || subcategory === 'Lifestyle') {
      return { category: 'Creative Artist', subcategory: 'Wardrobe Stylist' };
    }
    // Maintain existing subcategory if it matches, otherwise default
    return { category: 'Creative Artist', subcategory: subcategory || 'MUA / Hairstylist' };
  }

  // Handle "Lifestyle" -> map to Models (Approximation)
  if (category === 'Lifestyle') {
    return { category: 'Models', subcategory: subcategory || '' };
  }

  // Handle old "Photographers" -> map to Production
  if (category === 'Photographers' || category === 'PRODUCTION') {
    return { category: 'Production', subcategory: 'Photo / Videographer' };
  }

  // Return as-is if already in new format
  return { category, subcategory: subcategory || '' };
}
