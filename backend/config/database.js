/**
 * Database Configuration and Connection
 * Handles SQLite database initialization and connection management
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path - stores data in database folder
const DB_PATH = path.join(__dirname, '../../database/snippets.db');

/**
 * Creates and returns a database connection
 * Uses verbose mode for detailed error logging
 * @returns {sqlite3.Database} Database connection object
 */
const createConnection = () => {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error connecting to database:', err.message);
      throw err;
    }
    console.log('Connected to SQLite database');
  });
};

/**
 * Initialize database with required tables
 * Creates snippets, tags, and snippet_tags tables if they don't exist
 */
const initializeDatabase = () => {
  const db = createConnection();

  // Enable foreign keys support in SQLite
  db.run('PRAGMA foreign_keys = ON');

  // Create snippets table
  db.run(`
    CREATE TABLE IF NOT EXISTS snippets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      code TEXT NOT NULL,
      language TEXT DEFAULT 'javascript',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating snippets table:', err.message);
    } else {
      console.log('Snippets table ready');
    }
  });

  // Create tags table with unique constraint
  db.run(`
    CREATE TABLE IF NOT EXISTS tags (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating tags table:', err.message);
    } else {
      console.log('Tags table ready');
    }
  });

  // Create junction table for many-to-many relationship
  db.run(`
    CREATE TABLE IF NOT EXISTS snippet_tags (
      snippet_id INTEGER,
      tag_id INTEGER,
      FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
      FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
      PRIMARY KEY (snippet_id, tag_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating snippet_tags table:', err.message);
    } else {
      console.log('Snippet_tags table ready');
    }
  });

  db.close();
  console.log('Database initialized successfully');
};

module.exports = {
  createConnection,
  initializeDatabase
};