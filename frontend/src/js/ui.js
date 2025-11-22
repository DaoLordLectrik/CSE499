/**
 * UI Module
 * Handles all DOM manipulation and user interface updates
 */

import { copyToClipboard, formatDate } from './utils.js';

/**
 * Create HTML for a single snippet card
 * @param {Object} snippet - Snippet data object
 * @returns {string} HTML string for snippet card
 */
export const createSnippetCard = (snippet) => {
  // Escape HTML to prevent XSS attacks
  const escapeHtml = (text) => {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  };

  // Create tags HTML
  const tagsHtml = snippet.tags.map(tag => 
    `<span class="tag">${escapeHtml(tag)}</span>`
  ).join('');

  // Format the code for display with syntax highlighting
  const languageClass = `language-${snippet.language}`;
  
  return `
    <div class="column is-one-third-desktop is-half-tablet">
      <div class="snippet-card">
        <div class="snippet-header">
          <h3 class="snippet-title">${escapeHtml(snippet.title)}</h3>
          <div class="snippet-meta">
            <span class="language-tag">${escapeHtml(snippet.language.toUpperCase())}</span>
            <span>•</span>
            <span>${formatDate(snippet.created_at)}</span>
          </div>
        </div>
        
        <div class="snippet-body">
          <div class="code-container">
            <pre><code class="${languageClass}">${escapeHtml(snippet.code)}</code></pre>
          </div>
          
          ${snippet.tags.length > 0 ? `
            <div class="snippet-tags">
              ${tagsHtml}
            </div>
          ` : ''}
          
          <div class="snippet-actions">
            <button class="button is-success is-fullwidth copy-btn" data-code="${escapeHtml(snippet.code)}">
              <span class="icon">
                <i class="fas fa-copy"></i>
              </span>
              <span>Copy Code</span>
            </button>
            <button class="button is-danger delete-btn" data-id="${snippet.id}">
              <span class="icon">
                <i class="fas fa-trash"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
};

/**
 * Render snippets to the DOM
 * @param {Array} snippets - Array of snippet objects
 */
export const renderSnippets = (snippets) => {
  const container = document.getElementById('snippetsContainer');
  const emptyState = document.getElementById('emptyState');
  const loadingIndicator = document.getElementById('loadingIndicator');

  // Hide loading indicator
  loadingIndicator.classList.add('is-hidden');

  // Show/hide empty state
  if (snippets.length === 0) {
    container.innerHTML = '';
    emptyState.classList.remove('is-hidden');
    return;
  }

  emptyState.classList.add('is-hidden');

  // Generate HTML for all snippets
  const snippetsHtml = snippets.map(createSnippetCard).join('');
  container.innerHTML = snippetsHtml;

  // Apply syntax highlighting to all code blocks
  if (window.Prism) {
    Prism.highlightAll();
  }

  // Attach event listeners to copy buttons
  attachCopyListeners();

  // Attach event listeners to delete buttons
  attachDeleteListeners();
};

/**
 * Attach event listeners to all copy buttons
 */
const attachCopyListeners = () => {
  const copyButtons = document.querySelectorAll('.copy-btn');
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const code = e.currentTarget.dataset.code;
      const success = await copyToClipboard(code);
      
      if (success) {
        // Update button to show success
        const originalHtml = button.innerHTML;
        button.innerHTML = `
          <span class="icon">
            <i class="fas fa-check"></i>
          </span>
          <span>Copied!</span>
        `;
        button.classList.add('is-success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
          button.innerHTML = originalHtml;
        }, 2000);
      }
    });
  });
};

/**
 * Attach event listeners to all delete buttons
 */
const attachDeleteListeners = () => {
  const deleteButtons = document.querySelectorAll('.delete-btn');
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const snippetId = e.currentTarget.dataset.id;
      
      // Dispatch custom event that will be handled in app.js
      const event = new CustomEvent('deleteSnippet', { detail: { id: snippetId } });
      document.dispatchEvent(event);
    });
  });
};

/**
 * Populate language dropdown with options
 * @param {Array} languages - Array of language strings
 */
export const populateLanguageDropdown = (languages) => {
  const select = document.getElementById('snippetLanguage');
  
  // Clear existing options
  select.innerHTML = '';
  
  // Add language options
  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang;
    option.textContent = lang.toUpperCase();
    select.appendChild(option);
  });
};

/**
 * Show loading indicator
 */
export const showLoading = () => {
  const loadingIndicator = document.getElementById('loadingIndicator');
  const snippetsContainer = document.getElementById('snippetsContainer');
  const emptyState = document.getElementById('emptyState');
  
  snippetsContainer.innerHTML = '';
  emptyState.classList.add('is-hidden');
  loadingIndicator.classList.remove('is-hidden');
};

/**
 * Show notification message
 * @param {string} message - Message to display
 * @param {string} type - Notification type (success, danger, warning, info)
 */
export const showNotification = (message, type = 'info') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification is-${type}`;
  notification.innerHTML = `
    <button class="delete"></button>
    ${message}
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Add click handler for close button
  notification.querySelector('.delete').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    notification.remove();
  }, 5000);
};

/**
 * Open the snippet modal
 */
export const openModal = () => {
  const modal = document.getElementById('snippetModal');
  modal.classList.add('is-active');
};

/**
 * Close the snippet modal
 */
export const closeModal = () => {
  const modal = document.getElementById('snippetModal');
  modal.classList.remove('is-active');
  
  // Clear form fields
  document.getElementById('snippetTitle').value = '';
  document.getElementById('snippetCode').value = '';
  document.getElementById('snippetLanguage').selectedIndex = 0;
  document.getElementById('tagInput').value = '';
  document.getElementById('tagContainer').innerHTML = '';
};

/**
 * Add a tag to the tag container
 * @param {string} tagName - Name of the tag to add
 */
export const addTagToContainer = (tagName) => {
  const container = document.getElementById('tagContainer');
  
  // Check if tag already exists
  const existingTags = Array.from(container.querySelectorAll('.tag')).map(
    tag => tag.textContent.replace('×', '').trim()
  );
  
  if (existingTags.includes(tagName)) {
    showNotification('Tag already added', 'warning');
    return;
  }
  
  // Create tag element
  const tag = document.createElement('span');
  tag.className = 'tag is-info is-medium';
  tag.innerHTML = `
    ${tagName}
    <button class="delete is-small"></button>
  `;
  
  // Add click handler to remove tag
  tag.querySelector('.delete').addEventListener('click', () => {
    tag.remove();
  });
  
  container.appendChild(tag);
};

/**
 * Get all tags from the tag container
 * @returns {Array} Array of tag names
 */
export const getTagsFromContainer = () => {
  const container = document.getElementById('tagContainer');
  const tagElements = container.querySelectorAll('.tag');
  
  return Array.from(tagElements).map(tag => 
    tag.textContent.replace('×', '').trim()
  );
};