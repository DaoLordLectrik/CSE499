/**
 * Snippet Routes
 * Defines API endpoints and maps them to controller functions
 */

const express = require('express');
const router = express.Router();
const snippetController = require('../controllers/snippetController');

// GET /api/snippets - Get all snippets (with optional search)
router.get('/snippets', snippetController.getSnippets);

// POST /api/snippets - Create new snippet
router.post('/snippets', snippetController.createSnippet);

// DELETE /api/snippets/:id - Delete snippet by ID
router.delete('/snippets/:id', snippetController.deleteSnippet);

// GET /api/languages - Get supported languages
router.get('/languages', snippetController.getLanguages);

module.exports = router;