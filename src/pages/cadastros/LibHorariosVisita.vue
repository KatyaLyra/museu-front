<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">Liberação de horários para visita</div>
      </q-card-section>
      <q-separator />
      <q-card-section>	
		<q-table
		hide-header
		:rows="horariosVisita"
		:columns="columns"
		sortable: true
		rows-per-page-label="Registros por página:"
  		no-data-label="Nenhum dado disponível"
  		no-results-label="Nenhum registro encontrado"
		v-model:pagination="pagination"
  		:rows-per-page-options="linhasPorPagina"
		binary-state-sort
		row-key="codigoCompleto"
		flat
		selection="multiple"
        v-model:selected="selected"
		>
		</q-table>
		<template v-slot:top-selection>
        <div class="text-subtitle1">
          {{ selected.length }} {{ selected.length === 1 ? 'item selecionado' : 'itens selecionados' }}
        </div>
        <q-space />
        <q-btn color="negative" label="Excluir" icon="delete" @click="deleteSelected" />
      </template>
		<div class="row justify-center q-gutter-md">
                <q-btn label="Enviar" 
				       type="submit" color="primary" icon="save" 
					   @click="submitLibHorarios"
					   :disable="selected.length === 0"
					   />
                <q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="voltar" />
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { useRouter } from 'vue-router' // Adicionado
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

const columns = [
  { name: 'descricaoCompleta', label: 'Descrição', field: 'descricaoCompleta', align: 'left', sortable: true },
  { name: 'acoes', label: '', field: 'acoes', align: 'center',style: 'width: 100px', headerStyle: 'width: 100px' } // Coluna para os botões
]

const pagination = ref({
  sortBy: 'codigoCompleto', // Coluna que inicia ordenada
  descending: false,    // Ordem crescente (false) ou decrescente (true)
  page: 1,              // Página inicial
  rowsPerPage: 5       // <--- AQUI: define 10 registros por página
})

// Opções que o usuário pode escolher no seletor
const linhasPorPagina = [5, 10, 20, 50, 0] // 0 geralmente significa "Todos"

// FUNÇÃO DE voltar
const voltar = () => {
    router.push('/menu')
}
const submitLibHorarios = async () => {
 try {
      const token = localStorage.getItem('token');

      const dadosIn = JSON.parse(JSON.stringify(selected.value));
      await api.post('/visitas/liberarHorarios', dadosIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      router.push('/menu')

    } 
    catch (error) {
      console.error("Erro na liberação de horários para visita: ", error);
    }
  
  $q.notify({
    type: 'positive',
    message: `${selected.value.length} items sent successfully!`
  });
  }
</script>
<script>
import { api } from 'boot/axios'
import { ref } from 'vue'

const horarios = ref([]); // Esta é a variável que sua tabela usa
const selected = ref([]);

export default {
	name: 'listaHorarios',
	data() {
		return {
			horariosVisita:[]
		}
	},
	mounted() {
		this.consultarHorarios()
	},
	methods: {
		async consultarHorarios() {
			const token = localStorage.getItem('token');

			this.$q.loading.show({delay: 400 })
			try {
				const response = await api.post('/visitas/listarHorariosAgenda', {} , {
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
				});
				this.horariosVisita = response.data;				
				horarios.value = response.data;
				selected.value = horarios.value.filter(h => h.comAgendaLiberada);
			} 
			catch (error) {
				console.log('Falha de conexão com o servidor'+error);
				this.rows = []; // Limpa a tabela para não travar
			}
			finally {
				this.$q.loading.hide()
			}
		}
	}
}
</script>
