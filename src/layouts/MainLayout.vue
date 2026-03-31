<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated >
      <q-toolbar class="bg-primary text-white">
        <q-btn flat dense round 
        v-if="auth.usuario !== null"
        icon="menu" aria-label="Menu" 
        @click="toggleLeftDrawer" 
        />

        <q-toolbar-title>
          Museu UNICAP
          <div class="text-subtitle2">Agendamento de visitas</div>
        </q-toolbar-title>
        <div class="row items-center no-wrap" >
          <q-btn flat no-caps icon="person" 
           @click="rightDrawerOpen = !rightDrawerOpen"
          v-model="rightDrawerOpen" 
          :label="auth.usuario.apelido" 
          v-if="auth.usuario !== null" />
        </div>        
      </q-toolbar>
    </q-header>

    <q-drawer
      v-if="auth.usuario !== null"
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

    <q-drawer 
    v-if="auth.usuario !== null"
    v-model="rightDrawerOpen" side="right" overlay bordered>
      <q-list padding>
        <EssentialLink
          v-for="link in perfilLinks"
          :key="link.title"
          v-bind="link"
        />
        <q-separator spaced />
          <q-item clickable v-ripple class="text-red" @click="logout">
            <q-item-section avatar>
              <q-icon name="logout" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Sair</q-item-label>
            </q-item-section>
          </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Adicionado
import { useQuasar } from 'quasar'    // Adicionado
import { useAuthStore } from 'src/stores/auth';
import EssentialLink from 'components/EssentialLink.vue'

const router = useRouter()
const $q = useQuasar()
const auth = useAuthStore();

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

// Esta variável 'drawerState' sempre fica true no Desktop para o Mini Mode funcionar
// Se você quiser que o menu suma totalmente no celular, a lógica muda levemente
const drawerState = ref(true) 

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const rotinasLinks = [
  { title: 'Home', icon: 'home', link: '/' },
  { title: 'Usuários', icon: 'people', caption: 'Cadastro de usuários', link: '/cadusuarios' },
  { title: 'Tipos de visita', icon: 'visibility', caption: 'Cadastro de tipos de visita', link: '/listtiposvisita' },
  { title: 'Bloqueio de agenda', icon: 'event_busy', caption: 'Cadastro de bloqueio de agenda', link: '/listbloqueiodatas' },
  { title: 'Aulas de visita', icon: 'school', caption: 'Cadastro de aulas de visita', link: '/listtiposaula' }
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
    auth.logout();
    router.push('/login');
  })
}
</script>