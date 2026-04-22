<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-secondary text-white">
        <div class="text-h6">Cadastro de Usuários</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
		<q-table 
		:rows="usuarios"
		:columns="columns"
		rows-per-page-label="Registros por página:"
		no-data-label="Nenhum dado disponível"
		no-results-label="Nenhum registro encontrado"
		v-model:pagination="pagination"
		:rows-per-page-options="linhasPorPagina"
		:filter-method="myFilterMethod" 
		binary-state-sort
		row-key="id"
		flat
		bordered
		:grid="isMobile"
		>

		<template v-slot:top-right>
				<q-input
				borderless
				dense
				debounce="300"
				v-model="filter"
				placeholder="Pesquisar"
				>
				<template v-slot:append>
					<q-icon name="search" />
				</template>
				</q-input>
		</template>

		<template v-slot:item="props">
			<div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
			<q-card flat bordered class="q-py-sm">
				<q-card-section>
				<div v-for="col in props.cols.filter(col => col.name !== 'acoes')" :key="col.name" class="q-mb-xs">
					<div class="text-caption text-grey-8">{{ col.label }}</div>
					<div class="text-body2">{{ col.value }}</div>
				</div>
				</q-card-section>

				<q-separator />

				<q-card-actions align="center">
				<q-btn flat round color="primary" icon="search" size="sm" @click="consultar(props.row)">
					<q-tooltip>Consultar</q-tooltip>
				</q-btn>
				<q-btn flat round color="primary" icon="mode_edit" size="sm" @click="editar(props.row)">
					<q-tooltip>Editar</q-tooltip>
				</q-btn>
				<q-btn flat round color="primary" icon="delete" size="sm" @click="excluir(props.row)">
					<q-tooltip>Excluir</q-tooltip>
				</q-btn>
				<q-btn flat round color="primary" icon="email" size="sm" @click="enviarSenha(props.row)">
					<q-tooltip>Enviar senha</q-tooltip>
				</q-btn>
				<q-btn flat round color="primary" icon="manage_accounts" size="sm" @click="librots(props.row)">
					<q-tooltip>Liberar rotinas</q-tooltip>
				</q-btn>
				</q-card-actions>
			</q-card>
			</div>
		</template>

		<template v-slot:body-cell-acoes="props">
			<q-td :props="props" class="no-wrap">
				<div class="row items-center no-wrap q-gutter-x-xs">
				<q-btn 
					flat round color="primary" 
					icon="search" size="sm" 
					@click="consultar(props.row)">
					<q-tooltip>Consultar</q-tooltip>
				</q-btn>
				<q-btn 
					flat round color="primary" 
					icon="mode_edit" size="sm" 
					@click="editar(props.row)" >
					<q-tooltip>Editar</q-tooltip>
				</q-btn>
				<q-btn 
					flat round color="primary" 
					icon="delete" size="sm" 
					@click="excluir(props.row)">
					<q-tooltip>Excluir</q-tooltip>
				</q-btn>					
				<q-btn 
					flat round color="primary" 
					icon="email" size="sm" 
					@click="enviarSenha(props.row)" >
					<q-tooltip>Enviar senha</q-tooltip>
				</q-btn>
				<q-btn 
					flat round color="primary" 
					icon="manage_accounts" size="sm" 
					:disabled
					@click="librotsUsr(props.row)" >
					<q-tooltip>Liberar rotinas</q-tooltip>
				</q-btn>				
			</div>
			</q-td>
		</template>
		</q-table>
		<div class="row justify-center q-pa-md">
			<q-btn fab icon="add" color="primary" @click="adicionar" />
		</div>    
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router' // Adicionado
import { useQuasar } from 'quasar'

const $q = useQuasar()
const isMobile = computed(() => $q.screen.xs)

const router = useRouter()

const columns = [
  { name: 'nome', label: 'Nome do usuário', field: 'nome', align: 'left', sortable: true },
  { name: 'grupoDefault', label: 'Grupo principal', field: 'descricaoGrupoDefault', align: 'left', sortable: true },
  { name: 'acoes', label: '', field: 'acoes', align: 'center',style: 'width: 100px', headerStyle: 'width: 100px' } // Coluna para os botões
]

const pagination = ref({
  sortBy: 'nome', // Coluna que inicia ordenada
  descending: false,    // Ordem crescente (false) ou decrescente (true)
  page: 1,              // Página inicial
  rowsPerPage: 5       // <--- AQUI: define 10 registros por página
})

// Opções que o usuário pode escolher no seletor
const linhasPorPagina = [5, 10, 20, 50, 0] // 0 geralmente significa "Todos"


const myFilterMethod = (rows, terms) => {

	console.log('Filtrando por:', terms);
  const lowerTerms = terms.toLowerCase()
  return rows.filter(row => 
    row.nome.toLowerCase().includes(lowerTerms) 
)}

const adicionar = (row) => {
	localStorage.setItem('usuario', JSON.stringify(row));
	localStorage.setItem('operacao', 'I');
	router.push({ name: 'usuariocadastro', params: { operacao: 'I'}})
}
const consultar = (row) => {
	localStorage.setItem('usuario', JSON.stringify(row));
	localStorage.setItem('operacao', 'C');
	router.push({ name: 'usuariocadastro', params: { operacao: 'C'}})
}
const editar = (row) => {
	localStorage.setItem('usuario', JSON.stringify(row));
	localStorage.setItem('operacao', 'U');
	router.push({ name: 'usuariocadastro', params: { operacao: 'U'}})
}
const excluir = (row) => {
	localStorage.setItem('usuario', JSON.stringify(row));
	localStorage.setItem('operacao', 'D');
	router.push({ name: 'usuariocadastro', params: { operacao: 'D'}})
}
const librotsUsr = (row) => {
	localStorage.setItem('usuario', JSON.stringify(row));
	router.push({ name: 'liberarRotinasUsr', params: { codigo: row.codigo } })
}
</script>
<script>
import { api } from 'boot/axios'

export default {
	name: 'listaUsuarios',
	data() {
		return {
			usuarios:[]
		}
	},
	mounted() {
		this.consultarUsuarios()
	},
	methods: {
		async consultarUsuarios() {
			const token = localStorage.getItem('token');
			this.$q.loading.show({delay: 400 })
			try {
				const response = await api.post('/acesso/listarUsuarios', {}, {
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
				});
				this.usuarios = response.data
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

const enviarSenha = async (row) => {

    try {
      const token = localStorage.getItem('token');
      const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
      const userIn = {
          login:  row.email
      }

      const response = await api.post('/acesso/enviarNovaSenha', userIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const usrOut = response.data;

      if (usrOut) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usrOut));
        usuarioLogado.apelido = usrOut.apelido;
      }      
	$q.notify({
      color: 'positive',
      position: 'top',
      message: `Nova senha enviada para ${row.email}!`,
      icon: 'mail'
    });
      router.push('/menu')   
    } 
	catch (error) {
      console.error("Erro na autenticação ou token expirado:", error);
      localStorage.removeItem('token')
      localStorage.removeItem('usuarioLogado')
    }

  }
</script>