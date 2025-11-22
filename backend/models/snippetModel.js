/**
 * Snippet Model
 * Handles all database operations for snippets
 */

const { createConnection } = require('../config/database');

/**
 * Get all snippets with their associated tags
 * @param {string} searchQuery - Optional search term to filter snippets
 * @returns {Promise<Array>} Array of snippet objects with tags
 */
const getAllSnippets = (searchQuery = '') => {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    
    // Base query to get all snippets
    let query = `
      SELECT s.id, s.title, s.code, s.language, s.created_at,
             GROUP_CONCAT(t.name) as tags
      FROM snippets s
      LEFT JOIN snippet_tags st ON s.id = st.snippet_id
      LEFT JOIN tags t ON st.tag_id = t.id
    `;

    // Add search filtering if query provided
    if (searchQuery) {
      query += `
        WHERE s.title LIKE ? 
        OR s.code LIKE ? 
        OR s.language LIKE ?
        OR t.name LIKE ?
      `;
    }

    query += ' GROUP BY s.id ORDER BY s.created_at DESC';

    // Prepare search parameters with wildcards
    const searchParam = searchQuery ? `%${searchQuery}%` : '';
    const params = searchQuery ? [searchParam, searchParam, searchParam, searchParam] : [];

    db.all(query, params, (err, rows) => {
      if (err) {
        db.close();
        reject(err);
        return;
      }

      // Parse tags from comma-separated string to array
      const snippets = rows.map(row => ({
        ...row,
        tags: row.tags ? row.tags.split(',') : []
      }));

      db.close();
      resolve(snippets);
    });
  });
};

/**
 * Create a new snippet with associated tags
 * @param {Object} snippetData - Snippet data (title, code, language, tags)
 * @returns {Promise<Object>} Created snippet with ID
 */
const createSnippet = (snippetData) => {
  return new Promise((resolve, reject) => {
    const db = createConnection();
    const { title, code, language, tags } = snippetData;

    // Start transaction
    db.run('BEGIN TRANSACTION');

    // Insert snippet into database
    db.run(
      'INSERT INTO snippets (title, code, language) VALUES (?, ?, ?)',
      [title, code, language || 'javascript'],
      function(err) {
        if (err) {
          db.run('ROLLBACK');
          db.close();
          reject(err);
          return;
        }

        const snippetId = this.lastID;

        // If no tags, finish early
        if (!tags || tags.length === 0) {
          db.run('COMMIT');
          db.close();
          resolve({ id: snippetId, ...snippetData, tags: [] });
          return;
        }

        // Process each tag
        let processedTags = 0;
        const tagErrors = [];

        tags.forEach(tagName => {
          // Insert or get existing tag
          db.run(
            'INSERT OR IGNORE INTO tags (name) VALUES (?)',
            [tagName],
            function(err) {
              if (err) {
                tagErrors.push(err);
                processedTags++;
                checkCompletion();
                return;
              }

              // Get tag ID (either newly inserted or existing)
              db.get(
                'SELECT id FROM tags WHERE name = ?',
                [tagName],
                (err, row) => {
                  if (err) {
                    tagErrors.push(err);
                    processedTags++;
                    checkCompletion();
                    return;
                  }

                  // Link snippet to tag
                  db.run(
                    'INSERT INTO snippet_tags (snippet_id, tag_id) VALUES (?, ?)',
                    [snippetId, row.id],
                    (err) => {
                      if (err) tagErrors.push(err);
                      processedTags++;
                      checkCompletion();
                    }
                  );
                }
              );
            }
          );
        });

        // Check if all tags have been processed
        function checkCompletion() {
          if (processedTags === tags.length) {
            if (tagErrors.length > 0) {
              db.run('ROLLBACK');
              db.close();
              reject(tagErrors[0]);
            } else {
              db.run('COMMIT');
              db.close();
              resolve({ id: snippetId, ...snippetData });
            }
          }
        }
      }
    );
  });
};

/**
 * Delete a snippet by ID
 * Cascade delete will automatically remove related snippet_tags entries
 * @param {number} id - Snippet ID to delete
 * @returns {Promise<Object>} Success status
 */
const deleteSnippet = (id) => {
  return new Promise((resolve, reject) => {
    const db = createConnection();

    db.run('DELETE FROM snippets WHERE id = ?', [id], function(err) {
      if (err) {
        db.close();
        reject(err);
        return;
      }

      db.close();
      resolve({ success: true, changes: this.changes });
    });
  });
};

/**
 * Get all available programming languages
 * Returns a predefined list of supported languages
 * @returns {Array<string>} List of language names
 */
const getLanguages = () => {
  return [
    'javascript',
    'python',
    'java',
    'cpp',
    'csharp',
    'ruby',
    'go',
    'rust',
    'php',
    'html',
    'css',
    'sql',
    'typescript',
    'kotlin',
    'swift'
  ];
};

module.exports = {
  getAllSnippets,
  createSnippet,
  deleteSnippet,
  getLanguages
};