-- CodeSnippet Manager Database Schema
-- SQLite Database Structure

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Drop existing tables if they exist (for fresh install)
DROP TABLE IF EXISTS snippet_tags;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS snippets;

-- ===========================================
-- Snippets Table
-- ===========================================
-- Stores all code snippets with their content
CREATE TABLE snippets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    language TEXT DEFAULT 'javascript',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Add constraints
    CHECK(length(title) > 0),
    CHECK(length(code) > 0)
);

-- Create index for faster searches on title and language
CREATE INDEX idx_snippets_title ON snippets(title);
CREATE INDEX idx_snippets_language ON snippets(language);
CREATE INDEX idx_snippets_created_at ON snippets(created_at DESC);

-- ===========================================
-- Tags Table
-- ===========================================
-- Stores unique tag names for organizing snippets
CREATE TABLE tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure tag names are not empty
    CHECK(length(name) > 0)
);

-- Create index for faster tag lookups
CREATE INDEX idx_tags_name ON tags(name);

-- ===========================================
-- Snippet_Tags Junction Table
-- ===========================================
-- Many-to-many relationship between snippets and tags
CREATE TABLE snippet_tags (
    snippet_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraints with cascade delete
    FOREIGN KEY (snippet_id) REFERENCES snippets(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
    
    -- Composite primary key prevents duplicate tag assignments
    PRIMARY KEY (snippet_id, tag_id)
);

-- Create indexes for efficient joins
CREATE INDEX idx_snippet_tags_snippet ON snippet_tags(snippet_id);
CREATE INDEX idx_snippet_tags_tag ON snippet_tags(tag_id);

-- ===========================================
-- Sample Data (Optional)
-- ===========================================
-- Insert sample snippets for testing

INSERT INTO snippets (title, code, language) VALUES
('Array Map Example', 'const doubled = [1, 2, 3].map(n => n * 2);\nconsole.log(doubled); // [2, 4, 6]', 'javascript'),
('Python List Comprehension', 'squares = [x**2 for x in range(10)]\nprint(squares)', 'python'),
('Java Hello World', 'public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}', 'java');

-- Insert sample tags
INSERT INTO tags (name) VALUES
('array'),
('functional'),
('basics'),
('loop'),
('python');

-- Link snippets to tags
INSERT INTO snippet_tags (snippet_id, tag_id) VALUES
(1, 1), -- Array Map -> array
(1, 2), -- Array Map -> functional
(2, 4), -- Python List -> loop
(2, 5), -- Python List -> python
(3, 3); -- Java Hello -> basics