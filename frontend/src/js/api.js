/**
 * API Service Module
 * Handles all HTTP requests to the backend API
 */

// Base API URL - change this for production deployment
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Generic fetch wrapper with error handling
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<Object>} Response data
 */
const fetchAPI = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });

    // Parse JSON response
    const data = await response.json();

    // Check if request was successful
    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

/**
 * Get all snippets from the API
 * @param {string} searchQuery - Optional search term to filter snippets
 * @returns {Promise<Array>} Array of snippet objects
 */
export const getSnippets = async (searchQuery = '') => {
  const url = searchQuery 
    ? `${API_BASE_URL}/snippets?search=${encodeURIComponent(searchQuery)}`
    : `${API_BASE_URL}/snippets`;
  
  const response = await fetchAPI(url);
  return response.data;
};

/**
 * Create a new snippet
 * @param {Object} snippetData - Snippet data (title, code, language, tags)
 * @returns {Promise<Object>} Created snippet object
 */
export const createSnippet = async (snippetData) => {
  const response = await fetchAPI(`${API_BASE_URL}/snippets`, {
    method: 'POST',
    body: JSON.stringify(snippetData)
  });
  
  return response.data;
};

/**
 * Delete a snippet by ID
 * @param {number} snippetId - ID of snippet to delete
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteSnippet = async (snippetId) => {
  const response = await fetchAPI(`${API_BASE_URL}/snippets/${snippetId}`, {
    method: 'DELETE'
  });
  
  return response;
};

/**
 * Get list of supported programming languages
 * @returns {Promise<Array>} Array of language strings
 */
export const getLanguages = async () => {
  const response = await fetchAPI(`${API_BASE_URL}/languages`);
  return response.data;
};