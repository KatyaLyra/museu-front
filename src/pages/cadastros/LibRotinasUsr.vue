<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
		<q-card-section class="bg-secondary text-white">
        <div class="text-h6">Liberação de rotinas para usuário - {{usuario.nome}}</div>
      </q-card-section>
      <q-separator />
      <q-card-section>	
		<q-table
		hide-header
		:rows="rotinasLiberadas"
		:columns="columns"
		sortable: true
		rows-per-page-label="Registros por página:"
  		no-data-label="Nenhum dado disponível"
  		no-results-label="Nenhum registro encontrado"
		v-model:pagination="pagination"
  		:rows-per-page-options="linhasPorPagina"
		binary-state-sort
		row-key="codigo"
		flat
		selection="multiple"
        v-model:selected="selected"
		>
		<template v-slot:body-cell-grupo="props">
		<q-td :props="props">
				<q-btn 
				    v-if="props.row.liberadaGrupo === true"
					flat round color="primary" 
					icon="people" size="sm" 
					@click.stop >
					<q-tooltip>Liberada pelo grupo</q-tooltip>
				</q-btn>
		</q-td>
		</template>
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
					   v-if="!isConsulta"
					   @click="submitLibRotinas"
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

const usuario = JSON.parse(localStorage.getItem('usuario'));

const columns = [
  { name: 'descricao', label: 'Descrição', field: 'descricao', align: 'left', sortable: true },
  { name: 'grupo', label: '', field: 'grupo', align: 'center',style: 'width: 100px', headerStyle: 'width: 100px' } // Coluna para os botões
]

const pagination = ref({
  sortBy: 'descricao', // Coluna que inicia ordenada
  descending: false,    // Ordem crescente (false) ou decrescente (true)
  page: 1,              // Página inicial
  rowsPerPage: 5       // <--- AQUI: define 10 registros por página
})

// Opções que o usuário pode escolher no seletor
const linhasPorPagina = [5, 10, 20, 50, 0] // 0 geralmente significa "Todos"


// FUNÇÃO DE voltar
const voltar = () => {
    localStorage.removeItem('usuario')
    router.push('/listusuarios')
}
</script>
<script>
import { api } from 'boot/axios'
import { ref } from 'vue'

const rotinas = ref([]); // Esta é a variável que sua tabela usa
const selected = ref([]);

export default {
	name: 'listaRotinas',
	data() {
		return {
			rotinasLiberadas:[]
		}
	},
	mounted() {
		this.consultarRotinas()
	},
	methods: {
		async consultarRotinas() {
      		const usuario = JSON.parse(localStorage.getItem('usuario'));
			const token = localStorage.getItem('token');

			const usuarioIn = {
				codigo: usuario.codigo,
				email:  usuario.email
			}
			this.$q.loading.show({delay: 400 })
			try {
				const response = await api.post('/acesso/listarRotinasLiberadas', usuarioIn , {
						headers: {
							'Authorization': `Bearer ${token}`,
							'Content-Type': 'application/json'
						}
				});
				this.rotinasLiberadas = response.data;
				rotinas.value = response.data;
				selected.value = rotinas.value.filter(
					rotina => rotina.liberadaUsuario || rotina.liberadaGrupo
				);
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

const submitLibRotinas = async () => {
 try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      const token = localStorage.getItem('token');

      const dadosIn = {
          codigo: usuario.codigo,
          email:  usuario.email,
          nome:   usuario.nome,
		  rotinas: selected.value
      }
      await api.post('/acesso/liberarRotinas', dadosIn , {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      localStorage.removeItem('usuario')
      router.push('/listusuarios')

    } 
    catch (error) {
      console.error("Erro na liberação de rotinas do usuário: ", error);
      localStorage.removeItem('usuario')
    }
  
  $q.notify({
    type: 'positive',
    message: `${selected.value.length} items sent successfully!`
  });
  }
</script>
