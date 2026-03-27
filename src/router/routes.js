const routes = [
  {   path: '/', redirect: 'login' },
  // 🔓 Login (público)
  {
    path: '/login',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/LoginPage.vue') }],
  },
  {
    path: '/esquecisenha',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/auth/EsqueciSenhaPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'login', component: () => import('pages/auth/LoginPage.vue') },
      { path: 'menu', component: () => import('pages/MenuPage.vue')},
      { path: 'cadusuarios', component: () => import('src/pages/cadastros/CadUsuarios.vue') },
      { path: 'cadtiposaula', component: () => import('src/pages/cadastros/ListTiposAula.vue') },
      { path: '/cadtipoaula/:operacao', 
        name: 'tipoaulacadastro', 
        component: () => import('src/pages/cadastros/CadTipoAula.vue') 
      },
      { path: 'cadtiposvisita', component: () => import('src/pages/cadastros/ListTiposVisita.vue') },
      { path: '/cadtipovisita/:operacao', 
        name: 'tipovisitacadastro', 
        component: () => import('src/pages/cadastros/CadTipoVisita.vue') 
      },
      { path: 'cadbloqueiodatas', component: () => import('src/pages/cadastros/CadDatasBloqueio.vue') },
      { path: 'altusuario', component: () => import('pages/perfil/AltUsuario.vue') },
      { path: 'altsenha', component: () => import('pages/perfil/AltSenha.vue') },
      { path: 'cadusuario/:codigo', name: 'cadastrousuario',
        component: () => import('pages/cadastros/UsuarioPage.vue') },
      { path: 'librotinas/:codigo', name: 'liberarRotinas',
        component: () => import('pages/cadastros/LibRotinasPage.vue') }  
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
