const isProduction = process.env.NODE_ENV === 'production';

const config = {
  // Backend URLs
  backend: {
    local: 'http://localhost:5000',
    hosted: 'https://portfolio-fullstack-cauw.onrender.com' // Replace with your actual hosted backend URL
  },
  // Frontend URLs
  frontend: {
    local: 'http://localhost:3000',
    hosted: 'https://portfolio-frontend-omega-amber.vercel.app' // Replace with your actual hosted frontend URL
  },
  // CORS configuration
  cors: {
    origin: function() {
      return isProduction ? this.frontend.hosted : this.frontend.local;
    },
    credentials: true
  }
};

// Helper function to get the appropriate backend URL
config.getBackendUrl = () => {
  return isProduction ? config.backend.hosted : config.backend.local;
};

// Helper function to get the appropriate frontend URL
config.getFrontendUrl = () => {
  return isProduction ? config.frontend.hosted : config.frontend.local;
};

module.exports = config;
