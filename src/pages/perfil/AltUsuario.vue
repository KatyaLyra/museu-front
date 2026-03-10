<template>
  <q-page padding class="flex flex-center">
    <q-card style="width: 100%; max-width: 600px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Dados do Usuário</div>
        <div class="text-subtitle2">Atualize suas informações de perfil</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-md">
          
          <q-input
            filled
            v-model="user.nome"
            label="Nome Completo *"
            placeholder="Ex: João Silva da Cruz"
            color="primary"
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'O nome é obrigatório']"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="primary" />
            </template>
          </q-input>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="user.apelido"
                label="Apelido no Sistema *"
                hint="Como deseja ser chamado"
                color="primary"
                lazy-rules
                :rules="[ val => val && val.length > 0 || 'Defina um apelido']"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="col-12 col-sm-6">
              <q-input
                filled
                v-model="user.celular"
                label="Celular *"
                mask="(##) #####-####"
                fill-mask
                hint="Ex: (81) 99999-9999"
                color="primary"
                lazy-rules
                :rules="[ val => val && val.length >= 14 || 'Telefone inválido']"
              >
                <template v-slot:prepend>
                  <q-icon name="smartphone" color="primary" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="row justify-end q-mt-lg">
            <q-btn label="Descartar" type="reset" color="primary" flat class="q-ml-sm" to="/" />
            <q-btn label="Atualizar Perfil" type="submit" color="primary" icon="check" />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Dados iniciais (Geralmente viriam de uma API ou Store)
const user = reactive({
  nome: 'Fulano de Tal',
  apelido: 'fulano.unicap',
  celular: '81988887777'
})

const onSubmit = () => {
  $q.notify({
    color: 'positive',
    icon: 'cloud_done',
    message: 'Perfil atualizado com sucesso!',
    timeout: 2000
  })
}
</script>