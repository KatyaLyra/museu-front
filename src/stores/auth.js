import { defineStore } from 'pinia';
import { api } from 'boot/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    usuario: JSON.parse(localStorage.getItem('usuarioLogado')) || null,
    token: localStorage.getItem('token') || null,
  }),

  actions: {
    async autenticar(credenciais) {
      try {
        // 1ª Chamada: Login para pegar o Token
        const responseLogin = await api.post('/login', credenciais);
        const { token } = responseLogin.data;

        this.token = token;
        localStorage.setItem('token', token);

        // Configura o token no Axios para a próxima chamada
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // 2ª Chamada: Pegar dados do usuário
        const responseUser = await api.post('/acesso/consultarUsuarioLogado'); 
        const dadosUsuario = responseUser.data;

        // Atualiza o estado e o localStorage
        this.usuario = dadosUsuario;
        localStorage.setItem('usuarioLogado', JSON.stringify(dadosUsuario));

        return true;
      } catch (error) {
        console.error('Erro no fluxo de login:', error);
        throw error;
      }
    },

    logout() {
      this.usuario = null;
      this.token = null;
      localStorage.removeItem('usuarioLogado');
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
    }
  }
});