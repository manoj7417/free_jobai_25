# Vercel Deployment Guide

## Prerequisites
- Vercel account
- MongoDB Atlas account (or other MongoDB provider)
- GitHub repository with your code

## Environment Variables Setup

In your Vercel project settings, add the following environment variables:

### Required Environment Variables

1. **JWT_SECRET**
   - A strong, random string for JWT token signing
   - Example: `your-super-secure-jwt-secret-key-here`
   - Generate one using: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

2. **MONGODB_URI**
   - Your MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database-name`
   - Make sure to use MongoDB Atlas or a production MongoDB service

3. **NODE_ENV**
   - Set to: `production`

### Optional Environment Variables

4. **OPENAI_API_KEY** (if using OpenAI features)
   - Your OpenAI API key

## Deployment Steps

1. **Connect your GitHub repository to Vercel**
   - Go to Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository

2. **Configure environment variables**
   - In project settings, go to "Environment Variables"
   - Add all required variables listed above

3. **Deploy**
   - Vercel will automatically build and deploy your application
   - The build should complete successfully with the fixes applied

## Common Issues and Solutions

### Build Errors
- **ESLint TypeScript errors**: Fixed by adding TypeScript dependency
- **Environment variable errors**: Ensure all required variables are set in Vercel
- **MongoDB connection errors**: Verify your MongoDB URI is correct and accessible

### Runtime Errors
- **JWT errors**: Ensure JWT_SECRET is set and consistent
- **Database connection**: Check MongoDB URI and network access
- **Cookie issues**: Ensure domain settings are correct for production

## Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **MongoDB**: Use connection string with authentication
3. **Cookies**: HTTP-only and secure flags are enabled for production
4. **Environment Variables**: Never commit secrets to version control

## Monitoring

- Check Vercel function logs for API route errors
- Monitor MongoDB connection status
- Use Vercel analytics for performance insights
