/**
 * Main Application Module
 * Entry point for the frontend application
 * Initializes the app and coordinates all modules
 */

import * as API from './api.js';
import * as UI from './ui.js';
import { debounce, validateSnippetData } from './utils.js';

/**
 * Application state
 * Stores current snippets and form data
 */
const state = {
  snippets: [],
  currentTags: []
};

/**
 * Initialize the application
 * Called when DOM is fully loaded
 */
const initApp = async () => {
  console.log('Initializing CodeSnippet Manager...');
  
  try {
    // Load initial data
    await loadLanguages();
    await loadSnippets();
    
    // Set up event listeners
    setupEventListeners();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize app:', error);
    UI.showNotification('Failed to load application', 'danger');
  }
};

/**
 * Load supported programming languages from API
 */
const loadLanguages = async () => {
  try {
    const languages = await API.getLanguages();
    UI.populateLanguageDropdown(languages);
  } catch (error) {
    console.error('Failed to load languages:', error);
    UI.showNotification('Failed to load programming languages', 'warning');
  }
};

/**
 * Load all snippets from API
 * @param {string} searchQuery - Optional search term
 */
const loadSnippets = async (searchQuery = '') => {
  try {
    UI.showLoading();
    
    const snippets = await API.getSnippets(searchQuery);
    state.snippets = snippets;
    
    UI.renderSnippets(snippets);
    
    console.log(`Loaded ${snippets.length} snippets`);
  } catch (error) {
    console.error('Failed to load snippets:', error);
    UI.showNotification('Failed to load snippets', 'danger');
  }
};

/**
 * Handle snippet creation
 */
const handleCreateSnippet = async () => {
  try {
    // Get form data
    const title = document.getElementById('snippetTitle').value.trim();
    const code = document.getElementById('snippetCode').value.trim();
    const language = document.getElementById('snippetLanguage').value;
    const tags = UI.getTagsFromContainer();
    
    // Create snippet data object
    const snippetData = { title, code, language, tags };
    
    // Validate data
    const validation = validateSnippetData(snippetData);
    if (!validation.isValid) {
      UI.showNotification(validation.errors.join(', '), 'warning');
      return;
    }
    
    // Create snippet via API
    await API.createSnippet(snippetData);
    
    // Close modal and reload snippets
    UI.closeModal();
    await loadSnippets();
    
    UI.showNotification('Snippet created successfully!', 'success');
  } catch (error) {
    console.error('Failed to create snippet:', error);
    UI.showNotification('Failed to create snippet', 'danger');
  }
};

/**
 * Handle snippet deletion
 * @param {number} snippetId - ID of snippet to delete
 */
const handleDeleteSnippet = async (snippetId) => {
  // Confirm deletion
  const confirmed = confirm('Are you sure you want to delete this snippet?');
  if (!confirmed) return;
  
  try {
    await API.deleteSnippet(snippetId);
    await loadSnippets();
    
    UI.showNotification('Snippet deleted successfully', 'success');
  } catch (error) {
    console.error('Failed to delete snippet:', error);
    UI.showNotification('Failed to delete snippet', 'danger');
  }
};

/**
 * Handle search input with debouncing
 * Delays API call until user stops typing
 */
const handleSearch = debounce((searchQuery) => {
  loadSnippets(searchQuery);
}, 500);

/**
 * Set up all event listeners
 */
const setupEventListeners = () => {
  // Modal controls
  const addSnippetBtn = document.getElementById('addSnippetBtn');
  const closeModalBtn = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancelBtn');
  const saveSnippetBtn = document.getElementById('saveSnippetBtn');
  
  addSnippetBtn.addEventListener('click', UI.openModal);
  closeModalBtn.addEventListener('click', UI.closeModal);
  cancelBtn.addEventListener('click', UI.closeModal);
  saveSnippetBtn.addEventListener('click', handleCreateSnippet);
  
  // Close modal when clicking background
  const modalBackground = document.querySelector('.modal-background');
  modalBackground.addEventListener('click', UI.closeModal);
  
  // Tag management
  const addTagBtn = document.getElementById('addTagBtn');
  const tagInput = document.getElementById('tagInput');
  
  addTagBtn.addEventListener('click', () => {
    const tagName = tagInput.value.trim();
    if (tagName) {
      UI.addTagToContainer(tagName);
      tagInput.value = '';
    }
  });
  
  // Allow Enter key to add tags
  tagInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const tagName = tagInput.value.trim();
      if (tagName) {
        UI.addTagToContainer(tagName);
        tagInput.value = '';
      }
    }
  });
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    handleSearch(e.target.value);
  });
  
  // Custom event listener for snippet deletion
  document.addEventListener('deleteSnippet', (e) => {
    handleDeleteSnippet(e.detail.id);
  });
  
  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchInput.focus();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
      const modal = document.getElementById('snippetModal');
      if (modal.classList.contains('is-active')) {
        UI.closeModal();
      }
    }
  });
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}