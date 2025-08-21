# Authentication System Setup

This project includes a complete authentication system with the following features:

## Features

- ✅ User registration and login
- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Secure HTTP-only cookies
- ✅ Form validation with react-hook-form and zod
- ✅ Protected routes with middleware
- ✅ Authentication context for state management
- ✅ Responsive UI components

## Security Features

- **HTTP-Only Cookies**: Tokens are stored in secure HTTP-only cookies
- **Secure Flag**: Cookies are marked as secure in production
- **SameSite=Strict**: Prevents CSRF attacks
- **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **JWT Tokens**: Stateless authentication with 7-day expiration
- **Route Protection**: Middleware protects routes from unauthorized access

## Setup Instructions

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env.local` file in the root directory:

   ```env
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   MONGODB_URI=mongodb://localhost:27017/resumebuilder
   NODE_ENV=development
   ```

   **MongoDB Setup:**

   - For local MongoDB: Use `mongodb://localhost:27017/resumebuilder`
   - For MongoDB Atlas: Use `mongodb+srv://username:password@cluster.mongodb.net/resumebuilder`

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

## API Endpoints

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

## Routes

- `/` - Public home page
- `/auth` - Authentication page (login/signup)
- `/dashboard` - Protected dashboard page
- `/ats-analysis` - Protected ATS analysis tool
- `/cover-letter` - Protected cover letter builder

## Usage

1. Visit `/auth` to create an account or sign in
2. After successful authentication, you'll be redirected to the homepage (`/`)
3. The header will show different options based on authentication status
4. Protected routes will automatically redirect to `/auth` if not authenticated

## Components

- `LoginForm` - Login form with validation
- `SignupForm` - Registration form with validation
- `ProtectedRoute` - Client-side route protection
- `AuthContext` - Authentication state management

## Notes

- This application uses MongoDB for user data storage.
- JWT secret should be a strong, random string in production.
- Consider adding rate limiting and additional security measures for production use.
- Make sure MongoDB is running locally or use MongoDB Atlas for cloud hosting.
