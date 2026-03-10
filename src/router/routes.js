const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'index', component: () => import('pages/IndexPage.vue') },
      { path: 'cadusuarios', component: () => import('src/pages/cadastros/CadUsuarios.vue') },
      { path: 'cadtiposaula', component: () => import('src/pages/cadastros/CadTiposAula.vue') },
      { path: 'cadtiposvisita', component: () => import('src/pages/cadastros/CadTiposVisita.vue') },
      { path: 'cadbloqueiodatas', component: () => import('src/pages/cadastros/CadDatasBloqueio.vue') },
      { path: 'altusuario', component: () => import('src/pages/perfil/AltUsuario.vue') },
      { path: 'altsenha', component: () => import('src/pages/perfil/AltSenha.vue') }
   
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
