const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, 'env.example');

if (fs.existsSync(envPath)) {
  console.log('✅ .env.local file already exists');
} else {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env.local file from template');
    console.log('📝 Please update the MONGODB_URI in .env.local with your MongoDB connection string');
  } else {
    const envContent = `# JWT Secret Key (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# MongoDB URI (replace with your actual MongoDB connection string)
# For local MongoDB: mongodb://localhost:27017/resumebuilder
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/resumebuilder
MONGODB_URI=mongodb://localhost:27017/resumebuilder

# Environment
NODE_ENV=development
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file');
    console.log('📝 Please update the MONGODB_URI in .env.local with your MongoDB connection string');
  }
}

console.log('\n🔧 Setup Instructions:');
console.log('1. Make sure MongoDB is running locally or you have a MongoDB Atlas connection');
console.log('2. Update the MONGODB_URI in .env.local with your connection string');
console.log('3. Run "npm run dev" to start the development server');
console.log('4. Visit http://localhost:3000/auth to test the authentication system');
