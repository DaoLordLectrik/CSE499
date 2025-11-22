/**
 * SnippetForm Component
 * Handles the snippet creation form logic
 */

export class SnippetForm {
  /**
   * Constructor for SnippetForm
   * @param {Function} onSubmit - Callback when form is submitted
   */
  constructor(onSubmit) {
    this.onSubmit = onSubmit;
    this.tags = [];
    this.languages = [];
    this.initializeElements();
  }

  /**
   * Initialize form elements
   */
  initializeElements() {
    this.modal = document.getElementById('snippetModal');
    this.titleInput = document.getElementById('snippetTitle');
    this.codeInput = document.getElementById('snippetCode');
    this.languageSelect = document.getElementById('snippetLanguage');
    this.tagInput = document.getElementById('tagInput');
    this.tagContainer = document.getElementById('tagContainer');
  }

  /**
   * Set available languages
   * @param {Array} languages - Array of language strings
   */
  setLanguages(languages) {
    this.languages = languages;
    this.populateLanguageDropdown();
  }

  /**
   * Populate language dropdown
   */
  populateLanguageDropdown() {
    this.languageSelect.innerHTML = '';
    
    this.languages.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang;
      option.textContent = lang.toUpperCase();
      this.languageSelect.appendChild(option);
    });
  }

  /**
   * Open the form modal
   */
  open() {
    this.modal.classList.add('is-active');
    this.titleInput.focus();
  }

  /**
   * Close the form modal
   */
  close() {
    this.modal.classList.remove('is-active');
    this.reset();
  }

  /**
   * Reset form to initial state
   */
  reset() {
    this.titleInput.value = '';
    this.codeInput.value = '';
    this.languageSelect.selectedIndex = 0;
    this.tagInput.value = '';
    this.tags = [];
    this.renderTags();
  }

  /**
   * Add a tag to the form
   * @param {string} tagName - Name of tag to add
   * @returns {boolean} Success status
   */
  addTag(tagName) {
    // Validate tag name
    if (!tagName || tagName.trim().length === 0) {
      return false;
    }

    const trimmedTag = tagName.trim().toLowerCase();

    // Check for duplicates
    if (this.tags.includes(trimmedTag)) {
      return false;
    }

    // Add tag
    this.tags.push(trimmedTag);
    this.renderTags();
    return true;
  }

  /**
   * Remove a tag from the form
   * @param {string} tagName - Name of tag to remove
   */
  removeTag(tagName) {
    this.tags = this.tags.filter(tag => tag !== tagName);
    this.renderTags();
  }

  /**
   * Render tags in the container
   */
  renderTags() {
    this.tagContainer.innerHTML = '';

    this.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag is-info is-medium';
      tagElement.innerHTML = `
        ${tag}
        <button class="delete is-small" data-tag="${tag}"></button>
      `;

      // Add click listener for removal
      tagElement.querySelector('.delete').addEventListener('click', (e) => {
        const tagToRemove = e.target.dataset.tag;
        this.removeTag(tagToRemove);
      });

      this.tagContainer.appendChild(tagElement);
    });
  }

  /**
   * Get form data
   * @returns {Object} Form data object
   */
  getData() {
    return {
      title: this.titleInput.value.trim(),
      code: this.codeInput.value.trim(),
      language: this.languageSelect.value,
      tags: [...this.tags]
    };
  }

  /**
   * Validate form data
   * @returns {Object} Validation result { isValid, errors }
   */
  validate() {
    const errors = [];
    const data = this.getData();

    if (!data.title) {
      errors.push('Title is required');
    }

    if (!data.code) {
      errors.push('Code is required');
    }

    if (!data.language) {
      errors.push('Language is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Handle form submission
   */
  async submit() {
    // Validate form
    const validation = this.validate();
    
    if (!validation.isValid) {
      alert(validation.errors.join('\n'));
      return;
    }

    // Get form data
    const data = this.getData();

    // Call submit callback
    try {
      await this.onSubmit(data);
      this.close();
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Failed to save snippet. Please try again.');
    }
  }
}