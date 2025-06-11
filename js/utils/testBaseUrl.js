// Utility to get the base URL for tests
// Uses process.env.BASE_URL if set, otherwise defaults to localhost:5000

const getBaseUrl = () => {
  return process.env.BASE_URL || 'http://localhost:5000';
};

module.exports = { getBaseUrl };
