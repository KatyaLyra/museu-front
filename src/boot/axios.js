import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { Notify } from 'quasar'

const api = axios.create({ baseURL: 'http://localhost:8080' })

export default boot(({ app, router }) => {

  // --- 1. INTERCEPTOR DE REQUISIÇÃO (ENVIO DO TOKEN) ---
  /*
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
*/
  // --- 2. INTERCEPTOR DE RESPOSTA (TRATAMENTO DE ERROS) ---
  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // EXTRAÇÃO DA MENSAGEM DO BACKEND
      const backendMessage = error.response?.data?.message || 
                             error.response?.data?.erro || 
                             error.response?.data?.error ||
                             null;

      // A. Erro de Rede (Servidor offline ou sem internet)
      if (!error.response) {
        Notify.create({
          type: 'negative',
          message: 'Falha de conexão: O servidor não responde.',
          position: 'top',
          timeout: 5000
        })
        return null
      } 
      
      // B. Erro 403 (Sessão Expirada / Erro de Token no seu Filtro Java)
      else if (error.response.status === 403) {
        Notify.create({
          type: 'warning',
          message: backendMessage || 'Sessão inválida ou expirada.',
          caption: 'Por favor, faça login novamente.',
          position: 'top'
        })
        
        localStorage.removeItem('token')
        router.push('/login')
      }

      // C. Erro 406 ou outros (400, 500, etc) com mensagem do Back
      else {
        Notify.create({
          type: 'negative',
          message: backendMessage || `Erro inesperado (${error.response.status})`,
          position: 'top',
          actions: [{ icon: 'close', color: 'white' }]
        })
      }

      return Promise.reject(error)
    }
  )

  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }