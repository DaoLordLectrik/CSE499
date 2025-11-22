/**
 * SearchBar Component
 * Handles search and filter functionality
 */

export class SearchBar {
  /**
   * Constructor for SearchBar
   * @param {Function} onSearch - Callback when search is performed
   * @param {number} debounceDelay - Delay for debouncing in ms
   */
  constructor(onSearch, debounceDelay = 500) {
    this.onSearch = onSearch;
    this.debounceDelay = debounceDelay;
    this.debounceTimer = null;
    this.searchInput = document.getElementById('searchInput');
    this.attachListeners();
  }

  /**
   * Attach event listeners
   */
  attachListeners() {
    // Input event with debouncing
    this.searchInput.addEventListener('input', (e) => {
      this.handleInput(e.target.value);
    });

    // Clear button (if needed)
    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.clear();
      }
    });
  }

  /**
   * Handle search input with debouncing
   * @param {string} value - Search query
   */
  handleInput(value) {
    // Clear existing timer
    clearTimeout(this.debounceTimer);

    // Set new timer
    this.debounceTimer = setTimeout(() => {
      this.performSearch(value);
    }, this.debounceDelay);
  }

  /**
   * Perform the search
   * @param {string} query - Search query
   */
  performSearch(query) {
    const trimmedQuery = query.trim();
    this.onSearch(trimmedQuery);
  }

  /**
   * Clear search input
   */
  clear() {
    this.searchInput.value = '';
    this.performSearch('');
  }

  /**
   * Focus the search input
   */
  focus() {
    this.searchInput.focus();
  }

  /**
   * Get current search value
   * @returns {string} Current search query
   */
  getValue() {
    return this.searchInput.value.trim();
  }

  /**
   * Set search value
   * @param {string} value - Value to set
   */
  setValue(value) {
    this.searchInput.value = value;
    this.performSearch(value);
  }
}