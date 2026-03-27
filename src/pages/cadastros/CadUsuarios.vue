<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-primary text-white">
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
			<q-btn 
				flat 
				round 
				color="primary" 
				icon="email" 
				size="sm"
				@click="enviarSenha(props.row)"
			>
				<q-tooltip>Enviar senha</q-tooltip>
			</q-btn>	
			<q-btn 
				flat 
				round 
				color="primary" 
				icon="manage_accounts" 
				size="sm"
				@click="librots(props.row)"
			>
				<q-tooltip>Liberar rotinas</q-tooltip>
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
import { useRouter } from 'vue-router' // Adicionado

const router = useRouter()

const columns = [
  { name: 'nome', label: 'Nome do usuário', field: 'nome', align: 'left', sortable: true },
  { name: 'grupoDefault', label: 'Grupo principal', field: 'grupoDefault', align: 'left', sortable: true },
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

const editar = (row) => {
	router.push({ name: 'cadastrousuario', params: { codigo: row.codigo } })
}
const librots = (row) => {
	router.push({ name: 'liberarRotinas', params: { codigo: row.codigo } })
}
</script>
<script>
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
//import { useRouter } from 'vue-router' // Adicionado

// Estados Reativos
//const router = useRouter()
const $q = useQuasar()

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
			this.$q.loading.show({ spinnerColor: 'brown-6', delay: 400 })
			try {
				const response = await api.post('/acesso/listarUsuarios')
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