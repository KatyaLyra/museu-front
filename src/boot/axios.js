import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Creamos una instancia personalizada
const api = axios.create({ baseURL: 'https://api.museu.unicap.br' })

export default boot(({ app }) => {
  // Para usar dentro de archivos Vue (Options API) mediante this.$axios y this.$api
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { axios, api }
