# Store Rating System

A full-stack web application that allows users to submit ratings for stores registered on the platform.

## Features

### User Roles
1. **System Administrator**
   - Add new stores, normal users, and admin users
   - Dashboard with statistics (total users, stores, ratings)
   - Manage user and store listings with search and filters
   - View detailed user and store information

2. **Normal User**
   - Sign up and login to the platform
   - View all registered stores with ratings
   - Search stores by name and address
   - Submit and modify ratings (1-5 stars) for stores
   - Change password

3. **Store Owner**
   - Login to the platform
   - Dashboard showing average rating and total ratings
   - View list of users who rated their store
   - Change password

## Tech Stack

- **Backend**: Express.js with Node.js
- **Database**: PostgreSQL with Sequelize ORM
- **Frontend**: React.js with React Router
- **Authentication**: JWT (JSON Web Tokens)
- **Styling**: Custom CSS

## Form Validations

- **Name**: 20-60 characters
- **Address**: Max 400 characters
- **Password**: 8-16 characters, must include at least one uppercase letter and one special character
- **Email**: Standard email validation
- **Rating**: 1-5 stars only

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` (if exists) or create `.env` file
   - Update database credentials and JWT secret:
   ```
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_NAME=rating_system
   DB_HOST=127.0.0.1
   JWT_SECRET=your_jwt_secret_key_here
   PORT=5000
   ```

4. Create the database:
   ```bash
   createdb rating_system
   ```

5. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Default Admin User

After setting up the database, you'll need to create a system administrator manually in the database or through the API.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user or store owner
- `POST /api/auth/signup` - Register new normal user
- `PUT /api/auth/change-password` - Change password

### Admin Routes (System Admin only)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/users` - Create new user
- `POST /api/admin/stores` - Create new store
- `GET /api/admin/users` - List users with search/filter
- `GET /api/admin/stores` - List stores with search/filter
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/stores/:id` - Get store details

### User Routes (Normal User only)
- `GET /api/user/stores` - List stores with user ratings
- `POST /api/user/ratings` - Submit rating
- `PUT /api/user/ratings/:storeId` - Update rating
- `GET /api/user/my-ratings` - Get user's ratings

### Store Routes (Store Owner only)
- `GET /api/store/dashboard` - Get store dashboard data
- `GET /api/store/ratings` - Get all ratings for store

## Features Implemented

- User authentication and authorization
- Role-based access control
- Form validations (frontend and backend)
- Search and filtering functionality
- Sorting for all listings
- Responsive design
- Password change functionality
- Star rating system
- Dashboard statistics
- Pagination for large datasets

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Input validation and sanitization
- CORS configuration
- Helmet.js for security headers
- SQL injection prevention with Sequelize ORM
