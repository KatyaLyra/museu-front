<template>
 <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">{{ tituloPagina }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>

        <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
              <div class="row q-col-gutter-sm">
                <q-input
                  v-model="form.descricao"
                  label="Nome da aula"
                  type="descricao"
                  class="col-12"
                  filled
                  lazy-rules
                  :readonly="isConsulta || isDelete"
                  :rules="[val => !!val || 'Nome da aula é obrigatório']"
                />
              </div>
              <div class="row justify-center q-gutter-md">
                <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="voltar" />
                <q-btn label="Confirmar" type="submit" color="primary" icon="save"  v-if="!isConsulta"/>
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

const form = reactive({
  descricao: ''
})

const isConsulta = computed(() => {
  return router.currentRoute.value.params.operacao === 'C'
})

const isDelete = computed(() => {
  return router.currentRoute.value.params.operacao === 'D'
})

const tituloPagina = computed(() => {
  const operacao = router.currentRoute.value.params.operacao
  switch (operacao) {
    case 'I': return 'Inserir tipo de aula';
    case 'U': return 'Atualizar tipo de aula';
    case 'D': return 'Excluir tipo de aula';
    default: return 'Consultar tipo de aula';
  }
});

onMounted(() => {
 const tipoAula = JSON.parse(localStorage.getItem('tipoaula'));
 const operacao = localStorage.getItem('operacao');
 
  switch (operacao) {
    case 'I':
      form.descricao = ''
      break
    case 'U':
      form.descricao = tipoAula.descricao
      break
    case 'D':
      form.descricao = tipoAula.descricao
      break
    default:
      form.descricao = tipoAula.descricao
  }
})

// FUNÇÃO DE voltar
const voltar = () => {
    localStorage.removeItem('operacao')
    localStorage.removeItem('tipoAula')
    router.push('/listtiposaula')
}

const onSubmit = async () => {
    try {
      const tipoAula = JSON.parse(localStorage.getItem('tipoaula'));
      const operacao = localStorage.getItem('operacao');
      const token = localStorage.getItem('token');
//      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const tipoAulaIn = {
          codigo:       tipoAula.codigo,
          descricao:    form.descricao
      }
      await api.post('/visitas/cadTipoAula', tipoAulaIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { operacao: operacao }
      });
 
      let msg = '';
      switch (operacao) {
        case 'I': msg = 'Tipo de aula incluído com sucesso!'; break;
        case 'U': msg = 'Tipo de aula alterado com sucesso!'; break;
        case 'D': msg = 'Tipo de aula excluído com sucesso!'; break;
      }
      $q.notify({
        color: 'positive',
        position: 'top',
        message: msg,
        icon: 'done'
      })

      localStorage.removeItem('operacao')
      localStorage.removeItem('tipoAula')
      router.push('/listtiposaula')

    } 
    catch (error) {
      console.error("Erro no cadastro de tipo de aula:", error);
      localStorage.removeItem('operacao')
      localStorage.removeItem('tipoAula')
    }

  }
</script>