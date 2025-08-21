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

#### Dependency Conflicts (Zod/OpenAI)
- **Issue**: `ERESOLVE could not resolve` error with Zod and OpenAI versions
- **Solution**: 
  - Zod version has been downgraded to `^3.23.8` to be compatible with OpenAI
  - `.npmrc` file configured with `legacy-peer-deps=true`
  - `vercel.json` includes build environment settings

#### ESLint TypeScript errors
- **Issue**: TypeScript parser errors during build
- **Solution**: 
  - TypeScript dependency added
  - ESLint configuration updated to disable problematic rules

#### Environment variable errors
- **Issue**: Missing required environment variables
- **Solution**: Ensure all required variables are set in Vercel project settings

#### MongoDB connection errors
- **Issue**: Database connection failures
- **Solution**: 
  - Verify MongoDB URI is correct and accessible
  - Check network access and authentication

### Runtime Errors

#### JWT errors
- **Issue**: JWT_SECRET not configured
- **Solution**: Ensure JWT_SECRET is set and consistent

#### Database connection
- **Issue**: MongoDB connection timeouts
- **Solution**: 
  - Check MongoDB URI and network access
  - Verify MongoDB Atlas IP whitelist settings

#### Cookie issues
- **Issue**: Authentication cookies not working
- **Solution**: Ensure domain settings are correct for production

## Files Added/Fixed for Deployment

### Configuration Files
- ✅ `package.json` - Fixed Zod version conflict
- ✅ `.npmrc` - Added npm configuration for dependency resolution
- ✅ `vercel.json` - Enhanced Vercel deployment configuration
- ✅ `next.config.mjs` - Production environment handling
- ✅ `eslint.config.mjs` - Fixed ESLint rules

### Security Improvements
- ✅ `lib/auth.js` - Removed hardcoded JWT secrets
- ✅ `lib/mongodb.js` - Enhanced database connection
- ✅ API routes - Proper environment variable validation

## Security Considerations

1. **JWT Secret**: Use a strong, random secret
2. **MongoDB**: Use connection string with authentication
3. **Cookies**: HTTP-only and secure flags are enabled for production
4. **Environment Variables**: Never commit secrets to version control

## Monitoring

- Check Vercel function logs for API route errors
- Monitor MongoDB connection status
- Use Vercel analytics for performance insights

## Troubleshooting Deployment

If you still encounter issues:

1. **Clear Vercel cache**: Go to project settings → General → Clear build cache
2. **Check build logs**: Look for specific error messages in Vercel build logs
3. **Verify dependencies**: Ensure all packages are compatible
4. **Test locally**: Run `npm run build` locally to catch issues early
