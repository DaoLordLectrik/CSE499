/**
 * SnippetCard Component
 * Reusable component for displaying individual code snippets
 * This is an alternative modular approach to the UI
 */

export class SnippetCard {
  /**
   * Constructor for SnippetCard
   * @param {Object} snippet - Snippet data
   * @param {Function} onDelete - Callback for delete action
   * @param {Function} onCopy - Callback for copy action
   */
  constructor(snippet, onDelete, onCopy) {
    this.snippet = snippet;
    this.onDelete = onDelete;
    this.onCopy = onCopy;
    this.element = null;
  }

  /**
   * Escape HTML to prevent XSS attacks
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Format date for display
   * @param {string} dateString - ISO date string
   * @returns {string} Formatted date
   */
  formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }

  /**
   * Generate tags HTML
   * @returns {string} HTML for tags
   */
  generateTagsHtml() {
    if (!this.snippet.tags || this.snippet.tags.length === 0) {
      return '';
    }

    const tagsHtml = this.snippet.tags.map(tag => 
      `<span class="tag">${this.escapeHtml(tag)}</span>`
    ).join('');

    return `
      <div class="snippet-tags">
        ${tagsHtml}
      </div>
    `;
  }

  /**
   * Render the snippet card
   * @returns {HTMLElement} Card DOM element
   */
  render() {
    // Create container
    const container = document.createElement('div');
    container.className = 'column is-one-third-desktop is-half-tablet';

    // Generate HTML
    container.innerHTML = `
      <div class="snippet-card" data-id="${this.snippet.id}">
        <div class="snippet-header">
          <h3 class="snippet-title">${this.escapeHtml(this.snippet.title)}</h3>
          <div class="snippet-meta">
            <span class="language-tag">${this.escapeHtml(this.snippet.language.toUpperCase())}</span>
            <span>•</span>
            <span>${this.formatDate(this.snippet.created_at)}</span>
          </div>
        </div>
        
        <div class="snippet-body">
          <div class="code-container">
            <pre><code class="language-${this.snippet.language}">${this.escapeHtml(this.snippet.code)}</code></pre>
          </div>
          
          ${this.generateTagsHtml()}
          
          <div class="snippet-actions">
            <button class="button is-success is-fullwidth copy-btn">
              <span class="icon">
                <i class="fas fa-copy"></i>
              </span>
              <span>Copy Code</span>
            </button>
            <button class="button is-danger delete-btn">
              <span class="icon">
                <i class="fas fa-trash"></i>
              </span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Store reference to element
    this.element = container;

    // Attach event listeners
    this.attachEventListeners();

    // Apply syntax highlighting
    if (window.Prism) {
      Prism.highlightElement(container.querySelector('code'));
    }

    return container;
  }

  /**
   * Attach event listeners to buttons
   */
  attachEventListeners() {
    // Copy button
    const copyBtn = this.element.querySelector('.copy-btn');
    copyBtn.addEventListener('click', async () => {
      const success = await this.onCopy(this.snippet.code);
      
      if (success) {
        // Visual feedback
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = `
          <span class="icon">
            <i class="fas fa-check"></i>
          </span>
          <span>Copied!</span>
        `;
        
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
        }, 2000);
      }
    });

    // Delete button
    const deleteBtn = this.element.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      this.onDelete(this.snippet.id);
    });
  }

  /**
   * Update snippet data and re-render
   * @param {Object} newData - Updated snippet data
   */
  update(newData) {
    this.snippet = { ...this.snippet, ...newData };
    const newElement = this.render();
    this.element.replaceWith(newElement);
  }

  /**
   * Remove the card from DOM
   */
  remove() {
    if (this.element) {
      this.element.remove();
    }
  }
}