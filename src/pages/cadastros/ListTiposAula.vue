<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Cadastro de tipos de aula</div>
      </q-card-section>
      <q-separator />
      <q-card-section>	
		<q-table
		:rows="tiposAula"
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
		<div class="row justify-center q-pa-md">
			<q-btn fab icon="add" color="primary" @click="adicionar">
				<q-tooltip>Incluir</q-tooltip>
			</q-btn>
		</div>    
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { useRouter } from 'vue-router' // Adicionado

const router = useRouter()

const columns = [
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left', sortable: true },
  { name: 'acoes', label: '', field: 'acoes', align: 'center',style: 'width: 100px', headerStyle: 'width: 100px' } // Coluna para os botões
]

const pagination = ref({
  sortBy: 'descricao', // Coluna que inicia ordenada
  descending: false,    // Ordem crescente (false) ou decrescente (true)
  page: 1,              // Página inicial
  rowsPerPage: 5       // <--- AQUI: define 10 registros por página
})

// Opções que o usuário pode escolher no seletor
const linhasPorPagina = [5, 10, 20, 50, 0] // 0 geralmente significa "Todos"

const adicionar = (row) => {
	localStorage.setItem('tipoaula', JSON.stringify(row));
	localStorage.setItem('operacao', 'I');
	router.push({ name: 'tipoaulacadastro', params: { operacao: 'I'}})
}
const editar = (row) => {
	localStorage.setItem('tipoaula', JSON.stringify(row));
	localStorage.setItem('operacao', 'U');
	router.push({ name: 'tipoaulacadastro', params: { operacao: 'U'}})
}
const excluir = (row) => {
	localStorage.setItem('tipoaula', JSON.stringify(row));
	localStorage.setItem('operacao', 'D');
	router.push({ name: 'tipoaulacadastro', params: { operacao: 'D'}})
}

</script>
<script>
import { api } from 'boot/axios'
import { ref } from 'vue'

export default {
	name: 'listaTiposAula',
	data() {
		return {
			tiposAula:[]
		}
	},
	mounted() {
		this.consultarTiposAula()
	},
	methods: {
		async consultarTiposAula() {
			this.$q.loading.show({delay: 400 })
			try {
				const response = await api.post('/visitas/consultarTiposAula')
				this.tiposAula = response.data
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
