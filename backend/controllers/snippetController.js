/**
 * Snippet Controller
 * Handles HTTP requests and responses for snippet operations
 */

const snippetModel = require('../models/snippetModel');

/**
 * GET /api/snippets
 * Retrieve all snippets, optionally filtered by search query
 */
const getSnippets = async (req, res, next) => {
  try {
    const searchQuery = req.query.search || '';
    const snippets = await snippetModel.getAllSnippets(searchQuery);
    
    res.json({
      success: true,
      count: snippets.length,
      data: snippets
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/snippets
 * Create a new snippet
 * Expected body: { title, code, language, tags[] }
 */
const createSnippet = async (req, res, next) => {
  try {
    const { title, code, language, tags } = req.body;

    // Validate required fields
    if (!title || !code) {
      return res.status(400).json({
        success: false,
        message: 'Title and code are required'
      });
    }

    // Create snippet in database
    const snippet = await snippetModel.createSnippet({
      title,
      code,
      language: language || 'javascript',
      tags: tags || []
    });

    res.status(201).json({
      success: true,
      message: 'Snippet created successfully',
      data: snippet
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/snippets/:id
 * Delete a snippet by ID
 */
const deleteSnippet = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid snippet ID'
      });
    }

    const result = await snippetModel.deleteSnippet(id);

    // Check if snippet was actually deleted
    if (result.changes === 0) {
      return res.status(404).json({
        success: false,
        message: 'Snippet not found'
      });
    }

    res.json({
      success: true,
      message: 'Snippet deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/languages
 * Get list of supported programming languages
 */
const getLanguages = (req, res) => {
  const languages = snippetModel.getLanguages();
  
  res.json({
    success: true,
    data: languages
  });
};

module.exports = {
  getSnippets,
  createSnippet,
  deleteSnippet,
  getLanguages
};