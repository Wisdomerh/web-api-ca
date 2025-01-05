# Assignment 2 - Web API.

Name: Wisdom Erhimwionsobo

## Features.

A bullet-point list of the ADDITIONAL features you have implemented in the API **THAT WERE NOT IN THE LABS** (or modifications to existing features)
 
 + User favorites functionality with MongoDB persistence
 + Custom Movie Review system with ratings
 + Extended TMDB endpoints (Top Rated, Now Playing, Popular, Trending)
 + Enhanced user authentication with password validation
 + User-specific data management for favorites

## Setup requirements.

- Install MongoDB and ensure it's running locally
- Clone the repository: `git clone [your-repo-url]`
- Navigate to the API directory: `cd movies-api`
- Install dependencies: `npm install`
- Create a .env file with required variables
- Start the server: `npm run dev`
- Navigate to the App directory: `cd react-movies`
- Install dependencies: `npm install`
- Start the server: `npm start`

## API Configuration

Create a `.env` file in the root directory of the API with the following variables:

______________________
NODEENV=development
PORT=8080
HOST=localhost
mongoDB=YourMongoURL
secret=YourJWTSecret
TMDB_KEY=YourTMDBKey
______________________

## API Design

- /api/movies/tmdb/discover | GET | Gets a list of movies 
- /api/movies/tmdb/movie/{movieid} | GET | Gets a single movie 
- /api/users/favorites | GET | Get user's favorites (protected)
- /api/users/favorites | POST | Add to favorites (protected)
- /api/users/favorites/{movieid} | DELETE | Remove from favorites (protected)
- /api/reviews/movie/{movieid} | GET | Get all reviews for movie
- /api/reviews | POST | Create a new review (protected)

- API design [Swaggerhub](https://app.swaggerhub.com/apis/20097898/React-movie-app/1.0.0#/)).

## Security and Authentication

The API implements JWT token-based authentication:
- JWT tokens issued at login
- Token expiration set to 24 hours
- Password hashing using bcrypt
- Required password complexity using regex validation

Protected Routes:
- All favorites endpoints (/api/users/favorites/*)
- Review creation and management
- User-specific data endpoints

## Integrating with React App

Integration changes:
- Moved all TMDB API calls to the backend API
- Implemented JWT token storage and management
- Created authentication context for state management
- Added protected route components

New/Modified Views:
- Login/Signup pages
- Favorites page (now using MongoDB)
- Movie details page (integrated reviews)
- Review form component

## Independent learning

- Implemented custom password validation using regex
- Added JWT token-based authentication
- Integrated MongoDB for user data persistence
- Created middleware for route protection

