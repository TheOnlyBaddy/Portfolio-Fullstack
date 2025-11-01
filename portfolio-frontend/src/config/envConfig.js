const isProduction = process.env.NODE_ENV === 'production';

const config = {
  // Backend URLs
  backend: {
    local: 'http://localhost:5000',
    hosted: 'https://portfolio-fullstack-cauw.onrender.com', // Your hosted backend URL
  },
  // Frontend URLs
  frontend: {
    local: 'http://localhost:3000',
    hosted: 'https://portfolio-frontend-omega-amber.vercel.app', // Your hosted frontend URL
  },
};

// For development, always use local backend
// For production, uncomment the line below and comment out the current return
config.getBackendUrl = () => {
  // Uncomment below line for production
  // return isProduction ? config.backend.hosted : config.backend.local;

  // For development, always use local backend
  return config.backend.local;
};

// Helper function to get the appropriate frontend URL
config.getFrontendUrl = () => {
  return isProduction ? config.frontend.hosted : config.frontend.local;
};

export default config;
