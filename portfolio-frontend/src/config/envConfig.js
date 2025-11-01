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

// Return the appropriate backend URL based on the environment
config.getBackendUrl = () => {
  return isProduction ? config.backend.hosted : config.backend.local;
};

// Helper function to get the appropriate frontend URL
config.getFrontendUrl = () => {
  return isProduction ? config.frontend.hosted : config.frontend.local;
};

export default config;
