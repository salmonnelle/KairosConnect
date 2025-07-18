import React from 'react';

/**
 * Highlights occurrences of search terms within a text string
 * 
 * @param text The text to highlight within
 * @param query The search query to highlight
 * @param className Optional CSS class for the highlight
 * @returns React elements with highlighted matches
 */
export function highlightText(
  text: string, 
  query: string | null | undefined,
  className: string = "bg-purple-700/30 text-purple-300 rounded px-1"
): React.ReactNode {
  if (!query || query.trim() === '') {
    return text;
  }

  const searchTerms = query.trim().toLowerCase().split(/\s+/);
  
  // If no search terms, return the original text
  if (searchTerms.length === 0) {
    return text;
  }

  // Create a regex pattern that matches any of the search terms
  const pattern = new RegExp(`(${searchTerms.map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  
  // Split the text by the pattern
  const parts = text.split(pattern);
  
  // Map the parts to React elements, highlighting matches
  return parts.map((part, i) => {
    // Check if this part matches any search term (case insensitive)
    const isMatch = searchTerms.some(term => 
      part.toLowerCase() === term.toLowerCase()
    );
    
    return isMatch ? (
      <mark key={i} className={className}>{part}</mark>
    ) : (
      part
    );
  });
}

/**
 * Highlights occurrences of search terms within an array of tags
 * 
 * @param tags Array of tag strings
 * @param query The search query to highlight
 * @param className Optional CSS class for the highlight
 * @returns Array of React elements with highlighted matches
 */
export function highlightTags(
  tags: string[], 
  query: string | null | undefined,
  className: string = "bg-purple-700/30 text-purple-300 rounded px-1"
): React.ReactNode[] {
  if (!query || query.trim() === '' || !tags || tags.length === 0) {
    return tags;
  }

  const searchTerms = query.trim().toLowerCase().split(/\s+/);
  
  return tags.map((tag, index) => {
    // Check if this tag matches any search term
    const isMatch = searchTerms.some(term => 
      tag.toLowerCase().includes(term.toLowerCase())
    );
    
    return isMatch ? (
      <mark key={index} className={className}>{tag}</mark>
    ) : (
      tag
    );
  });
}
