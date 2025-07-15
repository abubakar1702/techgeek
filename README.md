# TechGeek Blog

A modern, full-stack blog platform built with React (Vite) for the frontend and Django for the backend. Share articles, comment, and join a vibrant tech community!

## Features

- 📝 Write, edit, and delete blog posts
- 💬 Comment on articles
- 🔒 User authentication (JWT-based)
- 👤 User profiles with profile pictures
- 🔔 Notifications
- 📱 Responsive design
- 🗂️ Category-based article browsing

## Tech Stack

- **Frontend:** React, Vite, Context API
- **Backend:** Django, Django REST Framework
- **Database:** SQLite (default, easy to swap)
- **Styling:** CSS Modules

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Python 3.8+
- pip

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd server
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd blog
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at [http://localhost:5173](http://localhost:5173) and the backend at [http://localhost:8000](http://localhost:8000).

## Usage

- Register a new account or log in.
- Create, edit, and delete your own blog posts.
- Browse articles by category.
- Comment on posts and interact with the community.

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request



---

> Made with ❤️ for the tech community.
