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
      { path: 'listusuarios', component: () => import('src/pages/cadastros/ListUsuarios.vue') },
      { path: '/cadusuario/:operacao', 
        name: 'usuariocadastro', 
        component: () => import('src/pages/cadastros/CadUsuario.vue') 
      },
      { path: 'librotinas/:codigo', name: 'liberarRotinas',
        component: () => import('pages/cadastros/LibRotinasPage.vue') }, 
      { path: 'listtiposaula', component: () => import('src/pages/cadastros/ListTiposAula.vue') },
      { path: '/cadtipoaula/:operacao', 
        name: 'tipoaulacadastro', 
        component: () => import('src/pages/cadastros/CadTipoAula.vue') 
      },
      { path: 'listtiposvisita', component: () => import('src/pages/cadastros/ListTiposVisita.vue') },
      { path: '/cadtipovisita/:operacao', 
        name: 'tipovisitacadastro', 
        component: () => import('src/pages/cadastros/CadTipoVisita.vue') 
      },
      { path: 'listbloqueiodatas', component: () => import('src/pages/cadastros/ListDatasBloqueio.vue') },
      { path: '/caddatabloqueio/:operacao', 
        name: 'databloqueiocadastro', 
        component: () => import('src/pages/cadastros/CadDataBloqueio.vue') 
      },
      { path: 'altusuario', component: () => import('pages/perfil/AltUsuario.vue') },
      { path: 'altsenha', component: () => import('pages/perfil/AltSenha.vue') },

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
