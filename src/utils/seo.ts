/**
 * Utility functions for managing SEO meta tags
 */

import React from 'react';

export interface SEOConfig {
  title: string;
  description: string;
}

/**
 * Update the page title and meta description for SEO
 */
export const updateSEO = (config: SEOConfig) => {
  // Update page title
  document.title = config.title;

  // Update or create meta description
  let descriptionTag = document.querySelector('meta[name="description"]');
  if (!descriptionTag) {
    descriptionTag = document.createElement('meta');
    descriptionTag.setAttribute('name', 'description');
    document.head.appendChild(descriptionTag);
  }
  descriptionTag.setAttribute('content', config.description);

  // Update Open Graph meta tags for social media sharing
  updateMetaTag('og:title', config.title);
  updateMetaTag('og:description', config.description);
};

/**
 * Helper function to update or create a meta tag
 */
const updateMetaTag = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute('property', property);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

/**
 * Hook to manage SEO meta tags for a page
 */
export const useSEO = (config: SEOConfig) => {
  React.useEffect(() => {
    updateSEO(config);

    // Cleanup: optionally reset to a default title
    return () => {
      document.title = 'FEModels - Talent Showcase';
    };
  }, [config.title, config.description]);
};
