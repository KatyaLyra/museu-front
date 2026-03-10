import { boot } from 'quasar/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8080/' })

// INTERCEPTOR: Anexa o token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') // Nome da chave que você escolheu
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}, (error) => {
  return Promise.reject(error)
})

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }