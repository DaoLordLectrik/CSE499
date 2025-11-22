/**
 * Database Unit Tests
 * Tests for database operations
 * Run with: npm test
 */

const { createConnection, initializeDatabase } = require('../config/database');
const snippetModel = require('../models/snippetModel');

// Test suite setup
beforeAll(() => {
  initializeDatabase();
});

describe('Database Operations', () => {
  
  /**
   * Test database connection
   */
  test('should connect to database', () => {
    const db = createConnection();
    expect(db).toBeDefined();
    db.close();
  });

  /**
   * Test snippet creation
   */
  test('should create a snippet', async () => {
    const snippetData = {
      title: 'Test Snippet',
      code: 'console.log("test");',
      language: 'javascript',
      tags: ['test']
    };

    const result = await snippetModel.createSnippet(snippetData);
    
    expect(result.id).toBeDefined();
    expect(result.title).toBe(snippetData.title);
  });

  /**
   * Test snippet retrieval
   */
  test('should retrieve all snippets', async () => {
    const snippets = await snippetModel.getAllSnippets();
    
    expect(Array.isArray(snippets)).toBe(true);
    expect(snippets.length).toBeGreaterThan(0);
  });

  /**
   * Test snippet search
   */
  test('should search snippets', async () => {
    const results = await snippetModel.getAllSnippets('test');
    
    expect(Array.isArray(results)).toBe(true);
  });

  /**
   * Test snippet deletion
   */
  test('should delete a snippet', async () => {
    // Create a snippet first
    const snippetData = {
      title: 'To Delete',
      code: 'delete me',
      language: 'javascript',
      tags: []
    };
    const created = await snippetModel.createSnippet(snippetData);
    
    // Delete it
    const result = await snippetModel.deleteSnippet(created.id);
    
    expect(result.success).toBe(true);
  });
});