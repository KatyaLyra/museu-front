<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-primary text-white"> <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          Museu UNICAP
          <div class="text-subtitle2">Agendamento de visitas</div>
        </q-toolbar-title>
        <q-btn flat round dense
         @click="rightDrawerOpen = !rightDrawerOpen">
          <div class="row items-center no-wrap">
            <div class="q-ml-sm q-mr-md text-weight-medium gt-xs nickname-text">
              {{ usuarioLogado.apelido }}
            </div>
            <q-icon name="account_circle" size="28px" />
          </div>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer
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
import { ref, reactive } from 'vue'
//import { api } from 'boot/axios'
import EssentialLink from 'components/EssentialLink.vue'

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
  { title: 'Tipos de Visita', icon: 'visibility', link: '/cadtiposvisita' },
  { title: 'Bloqueio de Datas', icon: 'event_busy', link: '/cadbloqueiodatas' },
  { title: 'Aulas de Visita', icon: 'school', link: '/cadtiposaula' }
]

const perfilLinks = [
  { title: 'Alterar Perfil', icon: 'manage_accounts', link: '/altusuario' },
  { title: 'Alterar Senha', icon: 'lock', link: '/altsenha' }
]

const usuarioLogado = reactive({
  apelido: localStorage.getItem('user_nickname') || 'Visitante'
});

localStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrYXR5YS5seXJhQHVuaWNhcC5iciIsImlzcyI6IkFQSSBDb25zZW5zbyIsImV4cCI6MTc3MzE4NDY2NH0.v8y3Br1H3pMHzv1mpU5MYexQCwZq9VI97suqMYDm3ZQ')
</script>
