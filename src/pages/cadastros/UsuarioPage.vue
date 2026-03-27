<template>
 <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Alteração de Usuário</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              
              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="formulario.email"
                  label="e-mail"
                  type="email"
                  class="col-12"
                  filled
                  lazy-rules
                  :rules="[val => !!val || 'E-mail obrigatório']"
                />
                <q-input
                  v-model="formulario.emailConfirmacao"
                  label="Confirmação de e-mail"
                  type="email"
                  class="col-12"
                  filled
                  :rules="[val => val === formulario.email || 'Os e-mails não conferem']"
                />
              </div>

              <q-input
                v-model="formulario.nome"
                label="Nome completo"
                filled
                class="col-12"
                :rules="[val => !!val || 'Nome obrigatório']"
              />

              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="formulario.senha"
                  :type="isPwd1 ? 'password' : 'text'"
                  label="Senha"
                  filled
                  class="col-6"
                  hint="Mínimo 6 caracteres (letras maiúsculas, minúsculas e números)"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd1 ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd1 = !isPwd1"
                    />
                  </template>
                </q-input>

                <q-input
                  v-model="formulario.senhaConfirmacao"
                  :type="isPwd2 ? 'password' : 'text'"
                  label="Confirmação de Senha"
                  filled
                  class="col-6"
                >
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd2 ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd2 = !isPwd2"
                    />
                  </template>
                </q-input>
              </div>

              <div class="row q-col-gutter-sm">
                <q-input v-model="formulario.ddd" label="DDD" mask="###" filled class="col-2" />
                <q-input v-model="formulario.celular" label="Celular do Usuário" mask="#########" filled class="col-4" />
              </div>

              <q-input
                v-model="formulario.apelido"
                label="Apelido no sistema"
                filled class="col-6"
                hint="Apenas letras, sem espaço"
                :rules="[val => /^[A-Za-z]+$/.test(val) || 'Apenas letras sem acento']"
                
              />

              <div class="row q-col-gutter-sm">
                <q-select
                  v-model="formulario.grupo"
                  :options="opcoesGrupo"
                  label="Grupo"
                  filled
                  class="col-8"
                />
                <q-input v-model="formulario.matricula" label="RA ou Matrícula" filled class="col-5" />
              </div>

              <div class="row justify-center q-gutter-md">
                <q-btn label="Confirmar" type="submit" color="primary" icon="save"/>
                <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" to="/cadusuarios" />
              </div>
            </q-form>		

      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'

const isPwd1 = ref(true)
const isPwd2 = ref(true)

const formulario = ref({
  email: '',
  emailConfirmacao: '',
  nome: '',
  senha: '',
  senhaConfirmacao: '',
  ddd: '',
  celular: '',
  apelido: '',
  grupo: null,
  matricula: ''
})

const opcoesGrupo = ['Estudante', 'Professor', 'Funcionário']

const onSubmit = () => {
  console.log('Dados enviados:', formulario.value)
  // Aqui você chamaria sua rotina alterarPerfil ou login
}

const onReset = () => {
  formulario.value = { /* limpar campos */ }
}
</script>
