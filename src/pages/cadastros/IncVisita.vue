<template>
 <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">Agendamento de visita</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-form @submit="onSubmit" class="q-gutter-md">
          
          <q-banner class="bg-grey-2 q-mb-lg rounded-borders">
            <template v-slot:avatar>
              <q-icon name="info" color="primary" />
            </template>
            <div class="text-subtitle2">Para fazer seu Agendamento preencha os campos abaixo:</div>
            <ul class="text-caption q-mb-none">
              <li>Após a confirmação, o boleto/PIX estará disponível no sistema.</li>
              <li>Apenas agendamentos pagos serão atendidos.</li>
            </ul>
          </q-banner>

          <q-stepper
            v-model="step"
            header-nav
            ref="stepper"
            color="primary"
            animated
            flat
            bordered
          >
            <q-step :name="1" title="Tipo de Visita" icon="settings" :done="step > 1">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-select
                    v-model="form.tipoVisita"
                    :options="opcoesTipoVisita"
                    label="Tipo de Visita *"
                    outlined
                    map-options
                    :rules="[val => !!val || 'Este campo é obrigatório']"
                  />
                </div>

                <template v-if="form.tipoVisita">
                  <div class="col-6">
                    <q-input v-model="form.duracao" label="Duração" outlined readonly dense bg-color="grey-2" />
                  </div>
                  <div class="col-6">
                    <q-input v-model="form.valorFMT" label="Valor por pessoa" outlined readonly dense bg-color="grey-2" />
                  </div>
                </template>

                <q-input 
                    v-model="form.dataVisita" 
                    label="Data da Visita *" 
                    outlined 
                    type="date"
                    class="col-6"
                    @update:model-value="escolheuDataVisita"
                    :rules="[val => !!val || 'Obrigatório']"
                  >
                </q-input>

                <q-select
                    class="col-6"
                    v-if="turnosOptions.length > 0"
                    v-model="turnoSelecionado"
                    :options="turnosOptions"
                    label="Horário da visita"
                    emit-value
                    outlined
                    map-options
                />

                <q-input 
                    v-model.number="form.qtdVisitantes" 
                    type="number" 
                    label="Nº de Visitantes (10-40) *" 
                    class="col-6"
                    outlined
                    :rules="[val => (val >= 10 && val <= 40) || 'Entre 10 e 40 pessoas']"
                  />

                <div class="col-6">
                  <q-select
                    v-model="form.aulas"
                    :options="opcoesTipoAula"
                    label="Escolha a(s) Aula(s) *"
                    outlined
                    multiple
                    use-chips
                    hint="Você pode selecionar múltiplas opções"
                  />
                </div>

                <div class="col-12">
                  <q-checkbox v-model="form.atendEspecial" label="Existe necessidade de atendimento especial?" />
                  <q-input
                    v-if="form.atendEspecial"
                    v-model="form.descAtendEspecial"
                    type="textarea"
                    label="Descreva as necessidades"
                    outlined
                    class="q-mt-sm"
                    :rules="[val => !!val || 'Este campo é obrigatório']"
                  />
                </div>
              </div>
            </q-step>

            <q-step :name="2" title="Escola" icon="school" :done="step > 2">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-input v-model="form.nomeEscola" label="Nome da Escola *" outlined :rules="[val => !!val || 'Obrigatório']" />
                </div>
                <div class="col-6">
                  <q-input v-model="form.cnpjEscola" label="CNPJ *" outlined mask="##.###.###/####-##" unmasked-value />
                </div>
                <div class="col-12">
                  <q-input v-model="form.cep" label="CEP *" outlined mask="#####-###" unmasked-value>
                    <template v-slot:after>
                      <q-btn icon="search" color="primary" @click="buscarCEP" flat round />
                    </template>
                  </q-input>
                </div>
                <div class="col-8">
                  <q-input v-model="form.logradouro" label="Logradouro" outlined readonly />
                </div>
                <div class="col-4">
                  <q-input v-model="form.numero" label="Nº" outlined />
                </div>
              </div>
            </q-step>

            <q-step :name="3" title="Pagamento" icon="payments">
              <div class="row q-col-gutter-md">
                <div class="col-12">
                  <q-checkbox v-model="form.boletoEscola" label="Gerar boleto em nome da Escola" />
                </div>
                
                <template v-if="!form.boletoEscola">
                  <div class="col-12">
                    <q-input v-model="form.nomePagador" label="Nome do Pagador *" outlined />
                  </div>
                  <div class="col-6">
                    <q-input v-model="form.cpfPagador" label="CPF *" outlined mask="###.###.###-##" unmasked-value />
                  </div>
                </template>
              </div>
            </q-step>

            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 3 ? 'Finalizar' : 'Próximo'" />
                <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Voltar" class="q-ml-sm" />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { api } from 'boot/axios'
import { ref, watch, onMounted, reactive } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const step = ref(1)

// Estado reativo do formulário
const form = reactive({
  tipoVisita: null,
  duracao: '',
  valor: '',
  valorFMT: '', 
  qtdaulas: 0,
  isComEscola: false,
  dataVisita: '',
  qtdVisitantes: 10,
  aulas: [],
  atendEspecial: false,
  descAtendEspecial: '',
  nomeEscola: '',
  cnpjEscola: '',
  cep: '',
  logradouro: '',
  numero: '',
  boletoEscola: true,
  setEscola: true,
  nomePagador: '',
  cpfPagador: ''
})

const opcoesTipoVisita = ref([])
const opcoesTipoAula = ref([])
const dataSelecionada = ref('')
const turnoSelecionado = ref(null)
const turnosOptions = ref([])

const loadingTiposVisita = ref(false)
const loadingTiposAula = ref(false)

const carregarTiposVisita = async () => {
  const token = localStorage.getItem('token');

  opcoesTipoVisita.value = []
  loadingTiposVisita.value = true
  try {
      const response = await api.post('/visitas/consultarTiposVisita', {} , {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      });
      opcoesTipoVisita.value = response.data
      opcoesTipoVisita.value = response.data.map(item => ({
            label: item.descricao,
            value: item.codigo,
            // Mantenha os dados que o watch vai precisar:
            duracao: item.duracaoVisita,
            valorFMT: item.valorAulaVisitaFMT,
            qtdaulas: item.qtdAulaVisita,
            isComEscola: item.isComEscola,
            categoriaCodigo: item.categoria?.codigo // Facilitando o acesso
          }))
  } 
  catch (error) {
    console.error("Erro ao carregar tipos de visita:", error)
  } 
  finally {
    loadingTiposVisita.value = false
  }
}

const carregarTiposAula = async () => {
  const token = localStorage.getItem('token');

  opcoesTipoAula.value = []
  loadingTiposAula.value = true
  try {
      const response = await api.post('/visitas/consultarTiposAula', {} , {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      });
      opcoesTipoAula.value = response.data
      opcoesTipoAula.value = response.data.map(item => ({
      label: item.descricao, // ou o campo que você quer exibir
      value: item.codigo    // ou o identificador
    }))
  } 
  catch (error) {
    console.error("Erro ao carregar tipos de aula:", error)
  } 
  finally {
    loadingTiposAula.value = false
  }
}

onMounted(() => {
  // Dispara as duas chamadas simultaneamente
  carregarTiposVisita()
  carregarTiposAula()
})

// A MÁGICA: Observar a mudança no Tipo de Visita
watch(() => form.tipoVisita, (newVal) => {
  if (!newVal || typeof newVal !== 'object') return

  // 1. Achar o objeto selecionado (newVal já é o objeto se usarmos emit-value)
  const tvisita = newVal 

  // 2. Atualizar campos automáticos
  form.duracao = newVal.duracao
  form.valorFMT = newVal.valorFMT
  form.qtdaulas = newVal.qtdaulas
  form.isComEscola = newVal.isComEscola

  // 3. Lógica de Categoria (Desabilitar Qtd Visitantes)
  if (tvisita.categoria?.codigo === 2) {
    form.qtdVisitantes = 1
  } else {
    form.qtdVisitantes = null
  }

  // 4. Lógica de Abas/Pagador

  if (!tvisita.isComEscola) {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    form.nomePagador = usuarioLogado.nome
    form.setEscola  = false
    step.value = 3
    form.boletoEscola = false
  }
  else {
      form.setEscola = true
  }
  
  // Limpar aulas se o novo tipo não permitir
  if (tvisita.qtdaulas === 0) form.value.tiposAulaSelecionados = []

})

const escolheuDataVisita = async (valor) => {
  if (!valor) return

  // 1. Validar Fim de Semana (0 = Domingo, 6 = Sábado)
  // Nota: O getDay() do JS puro funciona, mas o Quasar tem helpers se preferir
  const dt = new Date(valor + 'T00:00:00') 
  const diaSemana = dt.getDay()

  if (diaSemana === 0 || diaSemana === 6) { // Adicionei sábado (6) também, conforme a lógica comum
    turnosOptions.value = []
    dataSelecionada.value = ''
    $q.notify({
        color: 'positive',
        position: 'top',
        message: 'Não estamos aceitando agendamento para o final de semana!',
        icon: 'done'
    })
    dataSelecionada.value = ''
    return
  }

  try {
    const parametros = { dataAgenda: `${form.dataVisita}T00:00:00` }
    const token = localStorage.getItem('token');

    const response = await api.post('/visitas/verificarDataVisita', parametros , {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
      });

      // Se turnosVisita vier como string JSON, fazemos o parse
      const turnos = typeof response.data.horariosAgenda === 'string' 
                     ? JSON.parse(response.data.horariosAgenda) 
                     : response.data.horariosAgenda

      // Mapear para o formato que o q-select entende { label, value }
      turnosOptions.value = turnos.map(item => ({
        label: item.descricao,
        value: item.codigoCompleto
      }))
    } 
    catch (error) {
      turnosOptions.value = []
      dataSelecionada.value = ''
      console.error("Erro ao carregar tipos de aula:", error)
    } 
}

watch(() => form.boletoEscola, () => {

  if (!form.setEscola) 
      form.boletoEscola = form.setEscola

})
</script>
