import { create } from 'apisauce'

const api = create({
  baseURL: 'http://localhost:9000'
})

api.addRequestTransform(request => {
  const token = localStorage.getItem('access_token')
  if (token) {
    request.headers['access_token'] = token
  }
})

export default api