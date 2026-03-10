<template>
  <q-page padding class="flex flex-center">
    <q-card style="width: 100%; max-width: 400px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Alterar Senha</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          <q-input
            filled
            v-model="form.currentPassword"
            label="Senha Atual"
            :type="isPwdOld ? 'password' : 'text'"
            hint="Sua senha cadastrada no momento"
            color="primary"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdOld ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdOld = !isPwdOld"
              />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.newPassword"
            label="Nova Senha"
            :type="isPwdNew ? 'password' : 'text'"
            color="primary"
            :rules="[
              val => val && val.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdNew ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdNew = !isPwdNew"
              />
            </template>
          </q-input>

          <q-input
            filled
            v-model="form.confirmPassword"
            label="Confirmar Nova Senha"
            :type="isPwdConfirm ? 'password' : 'text'"
            color="primary"
            :rules="[
              val => val === form.newPassword || 'As senhas não coincidem'
            ]"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdConfirm = !isPwdConfirm"
              />
            </template>
          </q-input>

          <div class="row justify-end q-mt-md">
            <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" to="/" />
            <q-btn label="Salvar Nova Senha" type="submit" color="primary" icon="save" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Estados para visibilidade da senha (olhinho)
const isPwdOld = ref(true)
const isPwdNew = ref(true)
const isPwdConfirm = ref(true)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const onSubmit = () => {
  // Aqui entraria a chamada para sua API
  $q.notify({
    color: 'positive',
    position: 'top',
    message: 'Senha alterada com sucesso!',
    icon: 'done'
  })
}
</script>