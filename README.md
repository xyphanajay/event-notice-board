# Event Notice Board

A web application that allows users to post local events and enables nearby users to discover and request to join these events.

## Features

- User authentication (signup, login)
- Create and manage events as a host
- Browse nearby events based on location
- Request to join events
- Manage join requests as a host
- Location-based filtering of events

## Tech Stack

### Backend
- Node.js with Express
- PostgreSQL with PostGIS for spatial data
- Sequelize ORM
- JWT Authentication

### Frontend
- React
- React Router for navigation
- React Query for server state management
- Material UI for components
- Mapbox for maps and location

### DevOps
- Docker and Docker Compose for containerization
- Nginx for serving the frontend

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js and npm (for local development)

### Setup

1. Clone the repository
   ```
   git clone <repository-url>
   cd event-notice-board
   ```

2. Copy the environment variables example and fill in the values
   ```
   cp .env.example .env
   ```

3. Start the containers
   ```
   # Development mode
   npm run dev
   
   # OR Production mode
   npm run start
   ```

4. Access the application
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Development

### Running locally

1. Install dependencies
   ```
   npm run install:all
   ```

2. Start the development servers
   ```
   # Backend
   cd backend
   npm run dev
   
   # Frontend (in a new terminal)
   cd frontend
   npm start
   ```

### Running tests
```
cd backend
npm test

cd frontend
npm test
```

## Project Structure

```
event-notice-board/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── index.js
│   ├── tests/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.js
│   │   └── index.js
│   ├── tests/
│   ├── Dockerfile
│   ├── Dockerfile.dev
│   ├── nginx.conf
│   └── package.json
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## License

This project is licensed under the MIT License.