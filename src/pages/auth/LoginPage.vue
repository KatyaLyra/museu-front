<template>
  <q-page class="bg-grey-1 flex flex-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md">Acesso ao Museu</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-24" style="width:320px; height:400px;">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input
                square
                filled
                clearable
                v-model="login"
                type="email"
                label="E-mail"
                :rules="[val => !!val || 'E-mail é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="email" />
                </template>
              </q-input>

              <q-input
                square
                filled
                clearable
                v-model="senha"
                :type="isPwd ? 'password' : 'text'"
                label="Senha"
                :rules="[val => !!val || 'Senha é obrigatória']"
              >
                <template v-slot:prepend>
                  <q-icon name="lock" />
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </q-form>
          </q-card-section>

          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="primary"
              size="lg"
              class="full-width"
              label="Entrar"
              :loading="loading"
              @click="handleLogin"
            />
          </q-card-actions>

          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Esqueceu a senha?</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script setup>
import { api } from 'boot/axios'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router' // Adicionado

// Estados Reativos
const router = useRouter()
const $q = useQuasar()
const isPwd = ref(true)

const login = ref('katya.lyra@unicap.br')
const senha = ref('')

const token = localStorage.getItem('token');
if (token != undefined) {
    router.push('/menu')
}
const loading = ref(false)

// Função de Login
const handleLogin = async () => {
  if (!login.value || !senha.value) {
    $q.notify({
      type: 'negative',
      message: 'Por favor, preencha todos os campos.'
    })
    return
  }

  loading.value = true

  const dados = {
    login: login.value, // enviando como 'login' conforme seu backend pede
    senha: senha.value
  };
  try {
   	const response = await api.post('/login', dados)
    const token = response.data.token;
    localStorage.setItem('token', token)
    // Redireciona para o Index
    router.push('/menu')   
  } 
  finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Adicione aqui ajustes finos se necessário */
</style>
