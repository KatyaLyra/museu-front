<template>
 <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">{{ tituloPagina }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-y-md">
          
          <div class="row q-col-gutter-md">
              <q-select class="col-12 col-sm-8 offset-sm-1"
                v-model="formulario.categoria"
                :options="opcoesCategoria"
                label="Categoria"
                emit-value
                map-options
                outlined
                :readonly="isConsulta || isDelete"
                :rules="[val => !!val || 'Campo obrigatório']"
              />
          </div>
          <div class="row q-col-md q-py-md" v-if="formulario.categoria === 'VISITA_GRUPO'">
              <q-checkbox  class="col-12 col-sm-4 offset-sm-1"
                v-model="formulario.comEscola" 
                label="Visita de escola" 
                :disable="isConsulta"
              />
              <q-select class="col-12 col-sm-6" v-if="formulario.comEscola"
                v-model="formulario.tipoEscola"
                :options="opcoesEscola"
                label="Tipo de escola"
                emit-value
                map-options
                outlined
                :readonly="isConsulta || isDelete"
                :rules="[val => !formulario.comEscola || (!!val || 'Campo obrigatório')]"
              />
          </div>
          <div class="row q-col-gutter-sm">
            <q-input
              v-model="formulario.descricao"
              label="Descrição da visita"
              type="descricao"
              class="col-12 col-sm-10 offset-sm-1"
              outlined
              :readonly="isConsulta || isDelete"
              :rules="[val => !!val || 'Campo obrigatório']"
            />
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 offset-sm-1">
              <q-input
                v-model="formulario.duracao"
                label="Duração"
                outlined
                :readonly="isConsulta || isDelete"
                :rules="[val => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                v-model="formulario.valorDesc"
                label="Valor % desconto (PIX)"
                mask="#.##"
                reverse-fill-mask
                outlined
                :readonly="isConsulta || isDelete"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 offset-sm-1">
              <q-input
                v-model="formulario.valor"
                label="Valor (individual)"
                prefix="R$"
                outlined
                :readonly="isConsulta || isDelete"
                :rules="[val => !!val || 'Campo obrigatório']"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-select
                v-model="formulario.qtdAulas"
                :options="opcoesAulas"
                label="Qtd. aulas"
                outlined
                :readonly="isConsulta || isDelete"
                :rules="[val => !!val || 'Campo obrigatório']"
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

const isConsulta = computed(() => {
  return router.currentRoute.value.params.operacao === 'C'
})

const isDelete = computed(() => {
  return router.currentRoute.value.params.operacao === 'D'
})

const formulario = ref({
  categoria: null,
  comEscola: false,
  tipoEscola: null,
  descricao:  null,
  duracao: '',
  valorDesc: 0,
  valor: 0,
  qtdAulas: null
})

const opcoesCategoria = [
  { label: 'Visita em grupo', value: 'VISITA_GRUPO' },
  { label: 'Visita individual', value: 'VISITA_INDIVIDUAL' }
]
const opcoesEscola = [
  { label: 'Escola Particular', value: 'PARTICULAR' },
  { label: 'Escola Pública', value: 'PUBLICA' }
]
const opcoesAulas = [1, 2, 3, 4, 5]

  const tituloPagina = computed(() => {
  const operacao = router.currentRoute.value.params.operacao
  switch (operacao) {
    case 'I': return 'Inserir tipo de visita';
    case 'U': return 'Atualizar tipo de visita';
    case 'D': return 'Excluir tipo de visita';
    default: return 'Consultar tipo de visita';
  }
});

onMounted(() => {
 const tipoVisita = JSON.parse(localStorage.getItem('tipovisita'));
 const operacao = localStorage.getItem('operacao');
 
formulario.value.descricao = tipoVisita.descricao
  switch (operacao) {
    case 'I':
      formulario.value.categoria = null
      formulario.value.comEscola = false
      formulario.value.tipoEscola = null
      formulario.value.descricao  = ''
      formulario.value.duracao    = ''
      formulario.value.qtdAulas   = null
      break
    case 'U':
      formulario.value.categoria     = tipoVisita.categoria
      formulario.value.comEscola     = tipoVisita.isComEscola
      formulario.value.tipoEscola    = tipoVisita.tipoEscola
      formulario.value.descricao     = tipoVisita.descricao
      formulario.value.duracao       = tipoVisita.duracaoVisita
      formulario.value.valorDesc     = tipoVisita.valorPercDesconto
      formulario.value.valor         = tipoVisita.valorAulaVisita
      formulario.value.qtdAulas      = tipoVisita.qtdAulaVisita
      break
    case 'D':
      formulario.value.categoria  = tipoVisita.categoria
      formulario.value.comEscola  = tipoVisita.isComEscola
      formulario.value.tipoEscola = tipoVisita.tipoEscola
      formulario.value.descricao  = tipoVisita.descricao
      formulario.value.duracao    = tipoVisita.duracaoVisita
      formulario.value.valorDesc  = tipoVisita.valorPercDesconto
      formulario.value.valor      = tipoVisita.valorAulaVisita
      formulario.value.qtdAulas   = tipoVisita.qtdAulaVisita
      break
    default:
      formulario.value.categoria  = tipoVisita.categoria
      formulario.value.comEscola  = tipoVisita.isComEscola
      formulario.value.tipoEscola = tipoVisita.tipoEscola
      formulario.value.descricao  = tipoVisita.descricao
      formulario.value.duracao    = tipoVisita.duracaoVisita
      formulario.value.valorDesc  = tipoVisita.valorPercDesconto
      formulario.value.valor      = tipoVisita.valorAulaVisita
      formulario.value.qtdAulas   = tipoVisita.qtdAulaVisita
  }
})

// FUNÇÃO DE voltar
const voltar = () => {
    localStorage.removeItem('operacao')
    localStorage.removeItem('tipoVisita')
    router.push('/listtiposvisita')
}

const onSubmit = async () => {
    try {
      const tipoVisita = JSON.parse(localStorage.getItem('tipovisita'));
      const operacao = localStorage.getItem('operacao');
      const token = localStorage.getItem('token');
      const tipoVisitaIn = {
          codigo:            tipoVisita.codigo,
          categoria:         formulario.value.categoria,
          isComEscola:       formulario.value.comEscola,
          tipoEscola:        formulario.value.tipoEscola,
          descricao:         formulario.value.descricao,
          duracaoVisita:     formulario.value.duracao,
          valorPercDesconto: formulario.value.valorDesc,
          valorAulaVisita:   formulario.value.valor,
          qtdAulaVisita:     formulario.value.qtdAulas       
      }
      await api.post('/visitas/cadTipoVisita', tipoVisitaIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        params: { operacao: operacao }
      });

  
      let msg = '';
      switch (operacao) {
        case 'I': msg = 'Tipo de visita incluído com sucesso!'; break;
        case 'U': msg = 'Tipo de visita alterado com sucesso!'; break;
        case 'D': msg = 'Tipo de visita excluído com sucesso!'; break;
      }
      $q.notify({
        color: 'positive',
        position: 'top',
        message: msg,
        icon: 'done'
      })

      localStorage.removeItem('operacao')
      localStorage.removeItem('tipoVisita')
      router.push('/listtiposvisita')

    } 
    catch (error) {
      console.error("Erro no cadastro de tipo de visita:", error);
      localStorage.removeItem('operacao')
      localStorage.removeItem('tipoVisita')
    }

  }
</script>