# MongoDB Setup Guide

This application now uses MongoDB for user data storage. Follow these steps to set up MongoDB:

## Option 1: Local MongoDB Installation

### 1. Install MongoDB Community Edition

**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a service and start automatically

**macOS:**
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu):**
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 2. Verify MongoDB is Running
```bash
# Check if MongoDB is running
mongosh
# or
mongo
```

## Option 2: MongoDB Atlas (Cloud)

### 1. Create MongoDB Atlas Account
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is sufficient)

### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `resumebuilder`

## Environment Configuration

### 1. Create .env.local File
Run the setup script:
```bash
npm run setup
```

### 2. Update MongoDB URI
Edit `.env.local` and update the `MONGODB_URI`:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/resumebuilder
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resumebuilder
```

## Testing the Setup

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Test the application:**
   - Visit `http://localhost:3000/auth`
   - Create a new account
   - Sign in with your credentials
   - Check that you're redirected to the homepage

3. **Verify data in MongoDB:**
   ```bash
   # For local MongoDB
   mongosh
   use resumebuilder
   db.users.find()
   ```

## Troubleshooting

### Common Issues

1. **Connection Refused:**
   - Make sure MongoDB is running
   - Check if the port 27017 is available
   - Verify firewall settings

2. **Authentication Failed:**
   - Check your MongoDB Atlas credentials
   - Ensure the IP address is whitelisted in Atlas
   - Verify the connection string format

3. **Database Not Found:**
   - The database will be created automatically when the first user signs up
   - No manual database creation is required

### MongoDB Commands

```bash
# Start MongoDB (if not running as service)
mongod

# Connect to MongoDB shell
mongosh

# List databases
show dbs

# Use database
use resumebuilder

# Show collections
show collections

# Find all users
db.users.find()

# Find specific user
db.users.findOne({email: "user@example.com"})

# Delete all users (for testing)
db.users.deleteMany({})
```

## Security Notes

- Change the default JWT_SECRET in production
- Use strong passwords for MongoDB Atlas
- Enable network access controls in Atlas
- Consider using MongoDB Atlas for production deployments
