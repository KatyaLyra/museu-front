<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">Liberação de séries para visita</div>
      </q-card-section>
      <q-separator />
      <q-card-section>	
		<q-table
		hide-header
		:rows="seriesVisita"
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
			<q-btn label="Cancelar" type="reset" color="primary" flat class="q-ml-sm" @click="voltar" />
			<q-btn label="Confirmar" 
					type="submit" color="primary" icon="save" 
					@click="submitLibSeries"
					:disable="selected.length === 0"
					/>
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
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left', sortable: true },
]

const pagination = ref({
  sortBy: 'codigo', // Coluna que inicia ordenada
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
const submitLibSeries = async () => {
 try {
      const token = localStorage.getItem('token');

      const dadosIn = JSON.parse(JSON.stringify(selected.value));
      await api.post('/visitas/liberarSeries', dadosIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      router.push('/menu')

    } 
    catch (error) {
      console.error("Erro na liberação de séries para visita: ", error);
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

const series = ref([]); // Esta é a variável que sua tabela usa
const selected = ref([]);

export default {
	name: 'listaSeries',
	data() {
		return {
			seriesVisita:[]
		}
	},
	mounted() {
		this.consultarSeries()
	},
	methods: {
		async consultarSeries() {
			const token = localStorage.getItem('token');

			this.$q.loading.show({delay: 400 })
			try {
				const response = await api.post('/visitas/listarSeries', {} , {
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
				});
				this.seriesVisita = response.data;				
				series.value = response.data;
				selected.value = series.value.filter(h => h.comAgendaLiberada);
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
