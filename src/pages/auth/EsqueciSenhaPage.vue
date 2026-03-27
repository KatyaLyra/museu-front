<template>
  <q-page class="login-page">
    <q-card class="q-pa-lg login-card">
      <!-- Logo -->
      <q-card-section class="login-header">
        <img src="src/assets/EscolaDoConsenso.png" class="logo-login" />
      </q-card-section>

      <!-- Título -->
      <div class="login-title">ALTERAR SENHA</div>

      <!-- Form -->
      <q-card-section>
        <q-form @submit.prevent="enviarEmail" class="login-form">
          <!-- CPF -->
          <q-input
            v-model="form.inscricaoPessoa"
            label="CPF"
            outlined
            dense
            mask="###.###.###-##"
            fill-mask
            :rules="[(val) => !!val || 'Informe o CPF']"
          />

          <!-- E-mail -->
          <q-input
            v-model="form.email"
            label="E-mail"
            outlined
            dense
            class="input-spacing"
            :rules="[(val) => !!val || 'Informe o e-mail']"
          />

          <!-- Botão -->
          <q-btn
            label="ALTERAR SENHA"
            class="full-width gradient-btn btn-spacing"
            unelevated
            :loading="loading"
            @click="enviarEmail"
          />
        </q-form>
      </q-card-section>

      <!-- Mensagens -->
      <q-card-section v-if="error" class="text-negative text-center">
        {{ error }}
      </q-card-section>

      <q-card-section v-if="success" class="text-positive text-center">
        {{ success }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { API_SERVICOS } from '../../constants/api'

const form = ref({
  inscricaoPessoa: '',
  email: '',
})

const loading = ref(false)
const error = ref(null)
const success = ref(null)

async function enviarEmail() {
  if (!form.value.inscricaoPessoa || !form.value.email) {
    error.value = 'Por favor, preencha todos os campos.'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    const { data } = await axios.post(
      `${API_SERVICOS}esqueceusenha`,
      {
        inscricaoPessoa: form.value.inscricaoPessoa.replace(/\D/g, ''),
        email: form.value.email,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    )

    success.value = data || 'E-mail enviado com sucesso!'
  } catch (err) {
    error.value = err.response?.data || 'Erro ao enviar o e-mail. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Página com blur (IGUAL AO LOGIN) */
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;

  background-image:
    linear-gradient(rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0)),
    url('src/assets/handShake.png');

  background-size: cover;
  background-position: center;

  backdrop-filter: blur(4px);
}

/* Card */
.login-card {
  width: 100%;
  max-width: 380px;
  background: rgb(231, 231, 231);
  border-radius: 12px;
  padding: 24px;
}

/* Header */
.login-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Logo */
.logo-login {
  max-width: 260px;
  height: auto;
  display: block;
}

/* Título */
.login-title {
  font-size: 1.25rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px;
}

/* Form */
.login-form {
  display: flex;
  flex-direction: column;
}

.input-spacing {
  margin-top: 8px;
}

.btn-spacing {
  margin-top: 12px;
}

/* Botão vermelho padrão */
.gradient-btn {
  background: linear-gradient(135deg, #8e1b1b, #c62828);
  color: white;
  border-radius: 8px;
}

/* Responsivo */
@media (max-width: 600px) {
  .login-card {
    max-width: 90%;
  }
}
</style>

