/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ik.imagekit.io',
            },
        ],
    },
    // Ensure environment variables are properly handled
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },
    // Handle server-side environment variables
    serverRuntimeConfig: {
        // Will only be available on the server side
        JWT_SECRET: process.env.JWT_SECRET,
        MONGODB_URI: process.env.MONGODB_URI,
    },
    // Handle client-side environment variables
    publicRuntimeConfig: {
        // Will be available on both server and client
        NODE_ENV: process.env.NODE_ENV,
    },
};

export default nextConfig;
