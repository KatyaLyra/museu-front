<template>
 <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">{{ tituloPagina }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>

        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-4">
                <q-input
                  v-model="formulario.data"
                  label="Data Bloqueada"
                  stack-label
                  type="date"
                  :readonly="isConsulta || isDelete"
                  :min="hoje"
                  :rules="isConsulta || isDelete ? [] : regrasData"
                />
              </div>

              <div class="col-12 col-sm-8">
                <q-input
                  v-model="formulario.descricao"
                  label="Motivo bloqueio"
                  maxlength="25"
                  :readonly="isConsulta || isDelete"
                  :rules="[val => !!val || 'Motivo do bloqueio é obrigatório']"
                />
              </div>
            </div>

            <div class="row justify-center q-gutter-md">
                <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="voltar" />
                <q-btn label="Confirmar" type="submit" color="primary" icon="save" v-if="!isConsulta"/>
             </div>
          </q-form>

      </q-card-section>
    </q-card>
  </q-page>
</template>


<script setup>
import { api } from 'boot/axios'
import { computed, onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()
const hoje = new Date().toISOString().split('T')[0];

const formulario = reactive({
  data: '',
  descricao: ''
})

const isConsulta = computed(() => {
  return router.currentRoute.value.params.operacao === 'C'
})

const isDelete = computed(() => {
  return router.currentRoute.value.params.operacao === 'D'
})

const regrasData = [
  val => !!val || 'Data é obrigatória',
  val => val >= hoje || 'A data não pode ser anterior a hoje'
]

const tituloPagina = computed(() => {
  const operacao = router.currentRoute.value.params.operacao
  switch (operacao) {
    case 'I': return 'Inserir bloqueio de agenda';
    case 'U': return 'Atualizar bloqueio de agenda';
    case 'D': return 'Excluir bloqueio de agenda';
    default: return 'Consultar bloqueio de agenda';    
  }
});

onMounted(() => {
 const databloqueio = JSON.parse(localStorage.getItem('dataBloqueio'));
 const operacao = localStorage.getItem('operacao');
  switch (operacao) {
    case 'I':
      formulario.data = hoje,
      formulario.descricao = ''
      break
    case 'U':
      formulario.data = databloqueio.dataBloqueioSTR
      formulario.descricao = databloqueio.motivoBloqueio
      break
    case 'D':
      formulario.data = databloqueio.dataBloqueioSTR
      formulario.descricao = databloqueio.motivoBloqueio
      break
    default:
      formulario.data = databloqueio.dataBloqueioSTR
      formulario.descricao = databloqueio.motivoBloqueio
  }
})

// FUNÇÃO DE voltar
const voltar = () => {
    localStorage.removeItem('operacao')
    localStorage.removeItem('dataBloqueio')
    router.push('/listbloqueiodatas')
}

const onSubmit = async () => {
    try {
 //     const databloqueio = JSON.parse(localStorage.getItem('dataBloqueio'));
      const operacao = localStorage.getItem('operacao');
      const token = localStorage.getItem('token');
//      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const databloqueioIn = {
          dataBloqueio:    `${formulario.data}T00:00:00`,
          motivoBloqueio:  formulario.descricao
      }
 //     const response = 
      await api.post('/visitas/cadBloqueioAgenda', databloqueioIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { operacao: operacao }
      });
  
      let msg = '';
      switch (operacao) {
        case 'I': msg = 'Bloqueio de data incluído com sucesso!'; break;
        case 'U': msg = 'Bloqueio de data alterado com sucesso!'; break;
        case 'D': msg = 'Bloqueio de data excluído com sucesso!'; break;
      }
      $q.notify({
        color: 'positive',
        position: 'top',
        message: msg,
        icon: 'done'
      })

      localStorage.removeItem('operacao')
      localStorage.removeItem('dataBloqueio')
      router.push('/listbloqueiodatas')

    } 
    catch (error) {
      console.error("Erro no cadastro de bloqueio de data:", error);
      localStorage.removeItem('operacao')
      localStorage.removeItem('dataBloqueio')
    }

  }
</script>