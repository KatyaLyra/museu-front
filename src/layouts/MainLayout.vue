<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated >
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round 
        v-if="$route.path !== '/'"
        icon="menu" aria-label="Menu" 
        @click="toggleLeftDrawer" 
        />

        <q-toolbar-title>
          Museu UNICAP
          <div class="text-subtitle2">Agendamento de visitas</div>
        </q-toolbar-title>
        <q-btn flat round dense
        v-if="$route.path !== '/'"
         @click="rightDrawerOpen = !rightDrawerOpen">
          <div class="row items-center no-wrap">
            <div class="q-ml-sm q-mr-md text-weight-medium gt-xs nickname-text">
             {{ usuarioLogado?.apelido || 'Visitante' }}
            </div>
            <q-icon name="account_circle" size="28px" />
          </div>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="$route.path !== '/'"
      v-model="drawerState" 
      side="left"
      bordered
      persistent
      :mini="!leftDrawerOpen"
      @mouseover="leftDrawerOpen = true"
      @mouseleave="leftDrawerOpen = false"
      :width="260"
      :mini-width="80"
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <EssentialLink
            v-for="link in rotinasLinks"
            :key="link.title"
            v-bind="link"
          />
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" overlay bordered>
      <q-list padding>
        <EssentialLink
          v-for="link in perfilLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-separator spaced />
        <q-item clickable v-ripple class="text-red" @click="logout">
          <q-item-section avatar><q-icon name="logout" color="red" /></q-item-section>
          <q-item-section>Sair da Conta</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { api } from 'boot/axios'
import { useRouter } from 'vue-router' // Adicionado
import { useQuasar } from 'quasar'    // Adicionado
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()
const $q = useQuasar()

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

// Esta variável 'drawerState' sempre fica true no Desktop para o Mini Mode funcionar
// Se você quiser que o menu suma totalmente no celular, a lógica muda levemente
const drawerState = ref(true) 

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

// Função para buscar o dado atualizado
const atualizarDadosUsuario = () => {
  usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || '{}')
 // apelido = usuarioLogado?.apelido || 'Visitante';
}

onMounted(() => {
  atualizarDadosUsuario()
  // Escuta o evento que você criou
  window.addEventListener('user-updated', atualizarDadosUsuario)
})

// Isso garante que o nome atualize ao mudar de página
watch(() => router.path, () => {
  atualizarDadosUsuario()
  // Se quiser fechar o drawer aqui também:
  // rightDrawerOpen.value = false
})

const rotinasLinks = [
  { title: 'Home', icon: 'home', link: '/' },
  { title: 'Usuários', icon: 'people', caption: 'Cadastro de usuários', link: '/cadusuarios' },
  { title: 'Tipos de visita', icon: 'visibility', caption: 'Cadastro de tipos de visita', link: '/cadtiposvisita' },
  { title: 'Bloqueio de agenda', icon: 'event_busy', caption: 'Cadastro de bloqueio de agenda', link: '/cadbloqueiodatas' },
  { title: 'Aulas de visita', icon: 'school', caption: 'Cadastro de aulas de visita', link: '/cadtiposaula' }
]

const perfilLinks = [
  { title: 'Alterar Perfil', icon: 'manage_accounts', link: '/altusuario' },
  { title: 'Alterar Senha', icon: 'lock', link: '/altsenha' }
]

// FUNÇÃO DE LOGOUT
const logout = () => {
  $q.dialog({
    title: 'Sair',
    message: 'Deseja realmente encerrar a sessão?',
    cancel: true,
    persistent: true
  }).onOk(() => {

    rightDrawerOpen.value = false;
    localStorage.removeItem('token')
    localStorage.removeItem('usuarioLogado')

    // Redireciona para o login
    router.push('login')

  })
}
</script>
<script>
const token = localStorage.getItem('token');
let usuarioLogado = null;
if (token != null) {
    try {
         const response = await api.post('/acesso/consultarUsuarioLogado', {}, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const usrOut = response.data;

        if (usrOut) {
          localStorage.setItem('usuarioLogado', JSON.stringify(usrOut));
          usuarioLogado = usrOut; 
        }
      } catch (error) {
        console.error("Erro na autenticação ou token expirado:", error);
        localStorage.removeItem('token')
        localStorage.removeItem('usuarioLogado')
      }
}
if (!usuarioLogado) {
  const salvo = localStorage.getItem('usuarioLogado');
  if (salvo) {
    usuarioLogado = JSON.parse(salvo);
  }
}
//const apelido = usuarioLogado?.apelido || 'Visitante';
</script>

