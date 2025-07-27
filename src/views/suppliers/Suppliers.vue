<script setup>
import { ref, onMounted } from 'vue'
import TableDinamic from '../../components/tables/TableDinamic.vue'
import { getProducts } from '../../services/products.service'
import { getQuotation } from '../../services/quotation.service'
import { getSuppliers } from '../../services/suppliers.service'

const data = ref([])
const columns = ref([])

onMounted(async () => {
  try {

    

    const suppliers= await getSuppliers()
    data.value =suppliers .data
  console.log(data.value)
    columns.value = [
      { label: 'Id', field: 'id' },
      { label: 'Nombre', field: 'name' },
      { label: 'Nit', field: 'nit' },
      { label: 'Email', field: 'email'},
      { label: 'Phone', field: 'contact' },
      { label: 'Referencia', field: 'reference' },
    ]
  } catch (error) {
    console.error('Error al cargar productos:', error)
  }
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-semibold mb-4">Listado de Clientes</h1>
     
 <TableDinamic :data="data" :columns="columns">
      <template #foto="{ value }">
        <img
          v-if="value"
          :src="value"
          alt="Foto del dispositivo"
          class="w-12 h-12 object-cover rounded border"
        />
        <span v-else class="text-gray-400">N/A</span>
      </template>
    </TableDinamic>
    

  </div>
</template>