<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Cadastro de Tipos de Visita</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
		<q-table
		:rows="tiposVisita"
		:columns="columns"
		rows-per-page-label="Registros por página:"
  		no-data-label="Nenhum dado disponível"
  		no-results-label="Nenhum registro encontrado"
		v-model:pagination="pagination"
  		:rows-per-page-options="linhasPorPagina"
		binary-state-sort
		row-key="id"
		flat
		bordered
		>
		<template v-slot:body-cell-acoes="props">
			<q-td :props="props">
			<q-btn 
				flat 
				round 
				color="primary" 
				icon="mode_edit" 
				size="sm"
				@click="editar(props.row)"
			>
				<q-tooltip>Editar</q-tooltip>
			</q-btn>
			
			<q-btn 
				flat 
				round 
				color="primary" 
				icon="delete" 
				size="sm"
				@click="excluir(props.row)"
			>
				<q-tooltip>Excluir</q-tooltip>
			</q-btn>
			</q-td>
		</template>
		</q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref } from 'vue'

const columns = [
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left', sortable: true },
  { name: 'duracao', label: 'Duração', field: 'duracaoVisita', align: 'left', sortable: true },
  { name: 'valor', label: 'Valor', field: 'valorAulaVisitaFMT', align: 'center', sortable: true },
  { name: 'qtd', label: 'Qtd. aulas', field: 'qtdAulaVisita', align: 'center', sortable: true },
  { name: 'acoes', label: '', field: 'acoes', align: 'center' } // Coluna para os botões
]

const pagination = ref({
  sortBy: 'descricao', // Coluna que inicia ordenada
  descending: false,    // Ordem crescente (false) ou decrescente (true)
  page: 1,              // Página inicial
  rowsPerPage: 10       // <--- AQUI: define 10 registros por página
})

// Opções que o usuário pode escolher no seletor
const linhasPorPagina = [5, 10, 20, 50, 0] // 0 geralmente significa "Todos"
</script>
<script>
import { api } from 'boot/axios'
//import { ref } from 'vue'

export default {
	name: 'TiposVisita',
	data() {
		return {
			tiposVisita:[]
		}
	},
	mounted() {
		this.consultarTiposVisita()
	},
	methods: {
		async consultarTiposVisita() {
			try {
				const response = await api.post('/visitas/consultarTiposVisita')
				this.tiposVisita = response.data
			} catch (error) {
				console.error(error)
			}
		}

	}
}


</script>