# CodeSnippet Manager

A full-stack web application for saving, organizing, and retrieving code snippets with ease. This project was created as a course requirement for CSE499-Senior Project showcasing skills earn over the period of studying web and computer programming under the BYU Pathway program.

![CodeSnippet Manager]

## 🚀 Features

- ✨ **Create, view, and delete** code snippets
- 🔍 **Real-time search** and filtering
- 🏷️ **Tag-based organization** for easy categorization
- 📋 **One-click copy** to clipboard
- 🎨 **Syntax highlighting** for 15+ programming languages
- 📱 **Responsive design** for all devices
- 🔒 **RESTful API** architecture
- ⚡ **Fast and lightweight** SQLite database

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, Vanilla JavaScript (ES6+)
- Bulma CSS Framework
- Prism.js for syntax highlighting
- Font Awesome icons

### Backend
- Node.js
- Express.js
- SQLite3 database

## 📁 Project Structure
codesnippet-manager/
├── backend/              # Server-side code
│   ├── config/          # Database configuration
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Custom middleware
│   └── tests/           # Test files
├── frontend/            # Client-side code
│   ├── public/         # Static files
│   │   ├── index.html
│   │   └── styles/
│   └── src/            # Source files
│       ├── js/         # JavaScript modules
│       └── components/ # Reusable components
└── database/           # Database files and schema
## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/daolordlectrik/CSE499
cd CSE499
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Initialize the database**
```bash
node -e "require('./config/database').initializeDatabase()"
```

Or run the SQL schema manually:
```bash
sqlite3 ../database/snippets.db < ../database/schema.sql
```

4. **Create environment file**
```bash
cp .env.example .env
```

Edit `.env` with your configuration.

5. **Start the server**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

6. **Access the application**
Open your browser and navigate to:
http://localhost:5000
## 📖 API Documentation

### Base URL
http://localhost:5000/api

### Endpoints

#### Get All Snippets
```http
GET /api/snippets
```

**Query Parameters:**
- `search` (optional): Search query string

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": 1,
      "title": "Array Map Example",
      "code": "const doubled = [1, 2, 3].map(n => n * 2);",
      "language": "javascript",
      "tags": ["array", "map"],
      "created_at": "2025-11-15T10:30:00.000Z"
    }
  ]
}
```

#### Create Snippet
```http
POST /api/snippets
```

**Request Body:**
```json
{
  "title": "My Snippet",
  "code": "console.log('Hello World');",
  "language": "javascript",
  "tags": ["example", "basics"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Snippet created successfully",
  "data": {
    "id": 1,
    "title": "My Snippet",
    "code": "console.log('Hello World');",
    "language": "javascript",
    "tags": ["example", "basics"]
  }
}
```

#### Delete Snippet
```http
DELETE /api/snippets/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Snippet deleted successfully"
}
```

#### Get Languages
```http
GET /api/languages
```

**Response:**
```json
{
  "success": true,
  "data": ["javascript", "python", "java", ...]
}
```

## 💻 Usage

### Adding a Snippet
1. Click the **"Add Snippet"** button
2. Fill in the title, select language, paste code
3. Add tags (optional)
4. Click **"Save Snippet"**

### Searching Snippets
- Use the search bar to filter by title, language, tags, or code content
- Results update in real-time as you type

### Copying Code
- Click the **"Copy Code"** button on any snippet card
- Code is copied to clipboard automatically

### Deleting Snippets
- Click the trash icon on a snippet card
- Confirm deletion in the prompt

## 🧪 Testing

Run all tests:
```bash
cd backend
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

Run specific test file:
```bash
npm test api.test.js
```

## 🚀 Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install`
4. Set start command: `node backend/server.js`
5. Add environment variables
6. Deploy!

### Deploy to Heroku

1. Create a new Heroku app
```bash
heroku create your-app-name
```

2. Push to Heroku
```bash
git push heroku main
```

3. Open your app
```bash
heroku open
```

## 👤 Author

**Fiifi Debrah**
- GitHub: [@DaoLordLectrik]

## 🙏 Acknowledgments

- Bulma CSS Framework
- Prism.js Syntax Highlighter
- Font Awesome Icons
- Express.js Framework

## 📊 Project Status

This project is currently in **active development**. Feel free to report issues or suggest features!

---

Made with ❤️ by Fiifi Debrah & Simon Mensah as CSE499-Senior Project
