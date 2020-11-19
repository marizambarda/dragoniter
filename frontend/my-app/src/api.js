import { create } from 'apisauce';

const api = create({
  baseURL: 'http://192.168.0.15:9000',
});

api.addRequestTransform((request) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    request.headers['access_token'] = token;
  }

  // simula delay
  request.headers['delay'] = 1000;
});

export default api;
