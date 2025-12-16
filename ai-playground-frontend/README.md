# AI Playground Frontend

A modern React frontend for the AI Playground application, built with Vite, React Router, and Tailwind CSS.

## Features

- 🔐 User authentication (Sign In / Sign Up)
- 📁 Project management (Create, View, Delete)
- 💬 Chat interface with AI bots (Gemini, Sarvam)
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔒 Protected routes with JWT authentication

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running on `http://localhost:8000`

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Build

Build for production:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── context/          # React context for authentication
├── pages/            # Page components
│   ├── SignIn.jsx
│   ├── SignUp.jsx
│   ├── Dashboard.jsx
│   ├── ProjectDetail.jsx
│   └── Chat.jsx
├── services/         # API service layer
│   └── api.js
├── App.jsx          # Main app component with routing
└── main.jsx         # Entry point
```

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`. Make sure the backend server is running before starting the frontend.

### API Endpoints Used

- `POST /signin` - User sign in
- `POST /signup` - User sign up
- `GET /api/v1/projects/get` - Get all projects
- `POST /api/v1/projects/create` - Create project
- `PUT /api/v1/projects/update/{id}` - Update project
- `DELETE /api/v1/projects/delete/{id}` - Delete project
- `GET /api/v1/projects/chat/get/{project_id}` - Get chats for project
- `POST /api/v1/projects/chat/create/{project_id}` - Create chat
- `POST /api/v1/projects/chat/messages/{chat_id}` - Send message
- `PATCH /api/v1/projects/chat/updatebot/{chat_id}` - Update bot provider

## Technologies

- **React 18** - UI library
- **React Router 6** - Routing
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

## Notes

- JWT tokens are stored in localStorage
- All API requests include the Authorization header with Bearer token
- Protected routes redirect to sign in if not authenticated

