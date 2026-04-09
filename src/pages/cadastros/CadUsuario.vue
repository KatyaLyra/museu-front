<template>
 <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ tituloPagina }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-md">
              <q-input
                v-model="formulario.email"
                label="e-mail"
                type="email"
                class="col-xs-12 col-sm-12" 
                filled
                lazy-rules
                :readonly="isConsulta || isDelete"
                :rules="[val => !!val || 'E-mail obrigatório']"
              />
              <q-input
                v-model="formulario.emailConfirmacao"
                label="Confirmação de e-mail"
                type="email"
                class="col-xs-12 col-sm-12" 
                filled
                v-if="!(isConsulta || isDelete || isUpdate)"
                :rules="[val => val === formulario.email || 'Os e-mails não conferem']"
              />

              <q-input
                v-model="formulario.nome"
                label="Nome completo"
                filled
                class="col-xs-12 col-sm-12" 
                :readonly="isConsulta || isDelete"
                :rules="[val => !!val || 'Nome obrigatório']"
              />

              <div class="col-12 col-md-6">
                <q-checkbox v-model="formulario.gerarSenha" 
                    v-if="(isUpdate)"
                    color="primary" label="Gerar nova senha?" />
              </div>

              <div class="row q-col-gutter-sm">
                <q-input v-model="formulario.ddd" label="DDD" mask="###" 
                        filled class="col-xs-12 col-sm-2" 
                        :readonly="isConsulta || isDelete"/>
                <q-input v-model="formulario.celular" label="Celular do Usuário" mask="#########" 
                        filled class="col-xs-12 col-sm-4" 
                        :readonly="isConsulta || isDelete"/>
              <q-input
                v-model="formulario.apelido"
                label="Apelido no sistema"
                filled class="col-xs-12 col-sm-6" 
                hint="Apenas letras, sem espaço"
                :readonly="isConsulta || isDelete"
                :rules="[val => /^[A-Za-z]+$/.test(val) || 'Apenas letras sem acento']"
                
              />
              </div>

              <div class="row q-col-gutter-sm">
                <q-select
                  v-if="!(isConsulta || isDelete)"
                  v-model="formulario.grupo"
                  :options="opcoesGrupo"
                  label="Grupo"
                  filled
                  class="col-xs-12 col-sm-12" 
                />
                <q-input
                  v-if="(isConsulta || isDelete)"
                  v-model="formulario.descGrupoDefault"
                  label="Grupo"
                  filled
                  class="col-xs-12 col-sm-12" 
                  :readonly="isConsulta || isDelete"
                />
                <q-input v-model="formulario.matricula" label="RA ou Matrícula" filled class="col-5" />
              </div>

              <div class="row justify-center q-gutter-md">
                <q-btn label="Confirmar" type="submit" color="primary" icon="save" v-if="!isConsulta"/>
                <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="voltar" />
              </div>
            </q-form>		

      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { api } from 'boot/axios'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const isConsulta = computed(() => {
  return router.currentRoute.value.params.operacao === 'C'
})
const isDelete = computed(() => {
  return router.currentRoute.value.params.operacao === 'D'
})
const isUpdate = computed(() => {
  return router.currentRoute.value.params.operacao === 'U'
})

const tituloPagina = computed(() => {
const operacao = router.currentRoute.value.params.operacao
  switch (operacao) {
    case 'I': return 'Inserir usuário';
    case 'U': return 'Atualizar usuário';
    case 'D': return 'Excluir usuário';
    default: return 'Consultar usuário';
  }
});

const formulario = ref({
  email: '',
  emailConfirmacao: '',
  nome: '',
  gerarSenha: false,
  ddd: '',
  celular: '',
  apelido: '',
  grupo: null,
  descGrupoDefault: '',
  matricula: ''
})

const opcoesGrupo = ref([])
onMounted(async () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  const operacao = localStorage.getItem('operacao');
  const token = localStorage.getItem('token');

  const response = await api.post('/acesso/listarGrupos', {} , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
    });
    localStorage.setItem('grupos', JSON.stringify(response.data));
    opcoesGrupo.value = []
    opcoesGrupo.value = response.data.map(item => ({
          label: item.descricao,
          value: item.codigo
    }))
    const grupoSelecionado = response.data.find(item => item.descricao === usuario.descricaoGrupoDefault);

 
  switch (operacao) {
    case 'I':
      formulario.value.email =  ''
      formulario.value.emailConfirmacao = ''
      formulario.value.nome = ''
      formulario.value.gerarSenha = false
      formulario.value.ddd = ''
      formulario.value.celular = ''
      formulario.value.apelido = ''
      formulario.value.grupo = null
      formulario.value.descGrupoDefault = ''
      formulario.value.matricula = ''
      break
    case 'U':
      formulario.value.email = usuario.email
      formulario.value.emailConfirmacao = ''
      formulario.value.nome = usuario.nome
      formulario.value.apelido   = usuario.apelido
      formulario.value.matricula = usuario.matricula
      formulario.value.isGerarSenha = false
      formulario.value.ddd       = usuario.celular.ddd
      formulario.value.celular   = usuario.celular.numero
      
 //     formulario.value.grupo     = grupoSelecionado.descricao;
 //     formulario.value.descGrupoDefault = usuario.descricaoGrupoDefault
 
      break
    case 'D':
      formulario.value.email = usuario.email
      formulario.value.emailConfirmacao = ''
      formulario.value.nome = usuario.nome
      formulario.value.gerarSenha = false
      formulario.value.ddd       = usuario.celular.ddd
      formulario.value.celular   = usuario.celular.numero
      formulario.value.apelido   = usuario.apelido
      formulario.value.grupo     = grupoSelecionado.descricao;
      formulario.value.descGrupoDefault = usuario.descricaoGrupoDefault
      formulario.value.matricula = usuario.matricula
      break
    default:
      formulario.value.email = usuario.email
      formulario.value.emailConfirmacao = ''
      formulario.value.nome = usuario.nome
      formulario.value.gerarSenha = false
      formulario.value.ddd       = usuario.celular.ddd
      formulario.value.celular   = usuario.celular.numero
      formulario.value.apelido   = usuario.apelido
      formulario.value.grupo     = grupoSelecionado.value;
      formulario.value.grupo     = grupoSelecionado.descricao;
      formulario.value.descGrupoDefault = usuario.descricaoGrupoDefault
      formulario.value.matricula = usuario.matricula
  }
})

const onSubmit = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const operacao = localStorage.getItem('operacao');
      const token = localStorage.getItem('token');
      const usuarioIn = {
        codigo: usuario.codigo,
        email:  formulario.value.email,
        nome:   formulario.value.nome,
        isGerarSenha: formulario.value.gerarSenha,
        celular:  {
                    ddi: 55,
                    ddd: formulario.value.ddd, 
                    numero: formulario.value.celular 
                  },
        apelido: formulario.value.apelido,
        matricula:  formulario.value.matricula
      }

      await api.post('/acesso/cadUsuario', usuarioIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { operacao: operacao }
      });

      let msg = '';
      switch (operacao) {
        case 'I': msg = 'Usuário incluído com sucesso!'; break;
        case 'U': msg = 'Usuário alterado com sucesso!'; break;
        case 'D': msg = 'Usuário excluído com sucesso!'; break;
      }
      $q.notify({
        color: 'positive',
        position: 'top',
        message: msg,
        icon: 'done'
      })

      localStorage.removeItem('operacao')
      localStorage.removeItem('usuario')
      router.push('/listusuarios')

    } 
    catch (error) {
      console.error("Erro no cadastro de usuario:", error);
      localStorage.removeItem('operacao')
      localStorage.removeItem('usuario')
    }

  }

// FUNÇÃO DE voltar
const voltar = () => {
    localStorage.removeItem('operacao')
    localStorage.removeItem('usuario')
    router.push('/listusuarios')
}
</script>
