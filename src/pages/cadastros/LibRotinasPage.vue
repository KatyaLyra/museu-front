<template>
  <div class="q-pa-md">
    <draggable 
      v-model="myList" 
      item-key="id" 
      tag="div" 
      class="row q-gutter-sm"
    >
      <template #item="{element}">
        <q-card class="col-3 cursor-pointer">
          <q-card-section>
            {{ element.name }}
          </q-card-section>
        </q-card>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const myList = ref([
  { id: 1, name: 'Task 1' },
  { id: 2, name: 'Task 2' },
  { id: 3, name: 'Task 3' }
])
</script>