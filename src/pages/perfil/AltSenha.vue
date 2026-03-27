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
import { api } from 'boot/axios'
import { ref, reactive } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router' // Adicionado

const $q = useQuasar()
const router = useRouter()

// Estados para visibilidade da senha (olhinho)
const isPwdNew = ref(true)
const isPwdConfirm = ref(true)

const form = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const onSubmit = async () => {
 $q.dialog({
    title: 'Sair',
    message: 'Deseja realmente alterar sua senha?',
    cancel: true,
    persistent: true
  }).onOk( async () => {

    try {
      const token = localStorage.getItem('token');
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const userIn = {
          codigo:  usuarioLogado.codigo,
          nome:    usuarioLogado.nome,
          novaSenha:   form.newPassword
      }

      const response = await api.post('/acesso/alterarSenha', userIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const usrOut = response.data;

      if (usrOut) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usrOut));
        usuarioLogado.apelido = usrOut.apelido;
      }      
      $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Senha alterada com sucesso!',
        icon: 'done'
      })
      router.push('/menu')   
    } catch (error) {
      console.error("Erro na autenticação ou token expirado:", error);
      localStorage.removeItem('token')
      localStorage.removeItem('usuarioLogado')
    }

  })
}
</script>