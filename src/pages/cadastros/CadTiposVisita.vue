<template>
  <q-page class="flex flex-center">
    <q-card style="width: 100%; max-width: 1200px" flat bordered>
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Cadastro de Tipos de Visita</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
			<q-markup-table>
			<thead>
				<tr>
				<th class="text-right">Descrição</th>
				<th class="text-right">Duração</th>
				<th class="text-right">Valor</th>
				<th class="text-right">Qtd. aulas</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(tipovisita, index) in tiposvisita">
				<td class="text-left">tipovisita.descricao</td>
				<td class="text-right">tipovisita.duracao</td>
				<td class="text-right">tipovisita.valor</td>
				<td class="text-right">tipovisita.qtdaulas</td>
				</tr>
			</tbody>
			</q-markup-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { api } from 'boot/axios'

export default {
	name: 'TiposVisita',
	dataq() {
		return {
			tiposvisita:[]
		}
	}
}
</script>