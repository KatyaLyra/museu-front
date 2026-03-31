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
              @click="realizarLogin"
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
import { ref } from 'vue';
import { useAuthStore } from 'src/stores/auth';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';

// 1. Instâncias necessárias
const auth = useAuthStore();
const router = useRouter();
const $q = useQuasar();

// 2. Declaração das variáveis reativas (Resolvendo os erros de 'not defined')
const login = ref('katya.lyra@unicap.br');
const senha = ref('');
const loading = ref(false);
const isPwd = ref(true)

// 3. Função de Login
const realizarLogin = async () => {
  // Validação simples antes de tentar o login
  if (!login.value || !senha.value) {
    $q.notify({ type: 'warning', message: 'Preencha todos os campos' });
    return;
  }

  try {
    loading.value = true;
    
    // Chama a action que configuramos na Store
    await auth.autenticar({ 
      login: login.value, 
      senha: senha.value 
    });
    
    $q.notify({ type: 'positive', message: 'Bem-vindo!' });
    router.push('/menu'); 
  } catch  {
    // 'err' substituído para evitar o erro de 'unused-vars' se você não for usar o objeto de erro
    $q.notify({ 
      type: 'negative', 
      message: 'Falha no login. Verifique suas credenciais.' 
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Adicione aqui ajustes finos se necessário */
</style>
