import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/',  // Update with your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to extract data from paginated responses
export const getResponseData = (response) => {
  // DRF ViewSets may return paginated responses with 'results' key
  if (response.data && Array.isArray(response.data.results)) {
    return response.data.results;
  }
  // Or direct array/object response
  return response.data;
};

export default api;
