/**
 * API Integration Tests
 * Tests for all API endpoints
 * Run with: npm test
 */

const request = require('supertest');
const app = require('../server');
const { initializeDatabase } = require('../config/database');

// Test suite setup
beforeAll(() => {
  // Initialize test database
  initializeDatabase();
});

describe('API Endpoints', () => {
  
  let createdSnippetId;

  /**
   * Test GET /api/snippets
   */
  describe('GET /api/snippets', () => {
    test('should return all snippets', async () => {
      const response = await request(app)
        .get('/api/snippets')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('should filter snippets by search query', async () => {
      const response = await request(app)
        .get('/api/snippets?search=javascript')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  /**
   * Test POST /api/snippets
   */
  describe('POST /api/snippets', () => {
    test('should create a new snippet', async () => {
      const newSnippet = {
        title: 'Test Snippet',
        code: 'console.log("test");',
        language: 'javascript',
        tags: ['test', 'example']
      };

      const response = await request(app)
        .post('/api/snippets')
        .send(newSnippet)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(newSnippet.title);
      
      // Store ID for later tests
      createdSnippetId = response.body.data.id;
    });

    test('should fail without required fields', async () => {
      const invalidSnippet = {
        title: 'Missing Code'
        // Missing 'code' field
      };

      const response = await request(app)
        .post('/api/snippets')
        .send(invalidSnippet)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test DELETE /api/snippets/:id
   */
  describe('DELETE /api/snippets/:id', () => {
    test('should delete an existing snippet', async () => {
      const response = await request(app)
        .delete(`/api/snippets/${createdSnippetId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    test('should return 404 for non-existent snippet', async () => {
      const response = await request(app)
        .delete('/api/snippets/999999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  /**
   * Test GET /api/languages
   */
  describe('GET /api/languages', () => {
    test('should return list of languages', async () => {
      const response = await request(app)
        .get('/api/languages')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });
});