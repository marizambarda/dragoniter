import { create } from 'apisauce';

const api = create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.addRequestTransform((request) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    request.headers['access_token'] = token;
  }

  // simula delay
  //request.headers['delay'] = 1000;
});

export default api;
