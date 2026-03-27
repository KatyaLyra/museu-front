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
                :rules="[ 
                      val => {
                        const apenasNumeros = val.replace(/\D/g, '');
                        return apenasNumeros.length === 11 || 'O celular deve ter 11 dígitos (com DDD)';
                      }
                ]"
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
import { api } from 'boot/axios'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router' // Adicionado

const $q = useQuasar()
const router = useRouter()

let usuarioLogado = null;
if (!usuarioLogado) {
  const salvo = localStorage.getItem('usuarioLogado');
  if (salvo) {
    usuarioLogado = JSON.parse(salvo);
  }
}
// Dados iniciais (Geralmente viriam de uma API ou Store)
  const user = ref({
    nome: usuarioLogado.nome,
    apelido: usuarioLogado.apelido,
    celular: usuarioLogado.celular.foneCadastro,
    celular_ddd: usuarioLogado.celular.ddd,
    celular_numero: usuarioLogado.celular.numero
  })

const onSubmit = async () => {
    try {
        const token = localStorage.getItem('token');
        const apenasNumeros = user.value.celular.replace(/\D/g, '')
        const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
        const userIn = {
            codigo:  usuarioLogado.codigo,
            nome:    user.value.nome,
            email:   usuarioLogado.email,
            apelido: user.value.apelido,
            celular: {
              ddi: usuarioLogado.celular.ddi,
              ddd: apenasNumeros.slice(0, 2),
              numero: apenasNumeros.slice(2)
            } 
        }

        const response = await api.post('/acesso/alterarPerfil', userIn, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const usrOut = response.data;

        if (usrOut) {
          localStorage.setItem('usuarioLogado', JSON.stringify(usrOut));
          usuarioLogado.apelido = usrOut.apelido;
          window.dispatchEvent(new Event('user-updated'))
        }
        $q.notify({
          color: 'positive',
          icon: 'cloud_done',
          message: 'Perfil atualizado com sucesso!',
          timeout: 2000
        })

        router.push('/menu')   
      } catch (error) {
        console.error("Erro na autenticação ou token expirado:", error);
        localStorage.removeItem('token')
        localStorage.removeItem('usuarioLogado')
      }
}
</script>