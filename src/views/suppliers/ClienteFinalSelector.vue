<template>
  <div>
    <label class="block text-gray-800 font-medium mb-1">Cliente final</label>
    <div class="relative">
      <input
        v-model="search"
        @focus="openModal = true"
        placeholder="Buscar cliente..."
        class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 cursor-pointer"
        readonly
      />
    </div>

    <ModalReutilizable :show="openModal" @close="openModal = false">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Seleccionar Cliente Final</h2>

        <input
          v-model="search"
          placeholder="Buscar cliente por nombre..."
          class="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />

        <ul class="max-h-60 overflow-auto space-y-1" v-if="filteredClientes.length">
          <li
            v-for="cliente in filteredClientes"
            :key="cliente.id"
            class="p-2 border rounded hover:bg-gray-100 cursor-pointer"
            @click="seleccionarCliente(cliente)"
          >
            {{ cliente.name }}
          </li>
        </ul>

        <div v-else class="text-gray-500 italic mb-4">No hay coincidencias.</div>

        <div class="space-y-2 mb-4" v-if="!filteredClientes.length">
          <input v-model="nuevoCliente.name" placeholder="Nombre" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.nit" placeholder="NIT" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.mail" placeholder="Correo electrónico" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.contact" placeholder="Contacto" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.reference" placeholder="Referencia" class="w-full border px-3 py-2 rounded" />
        </div>

        <div class="mt-4 text-right">
          <button
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            @click="agregarNuevoCliente"
            :disabled="!nuevoCliente.name"
          >
            Agregar nuevo cliente final
          </button>
        </div>
      </div>
    </ModalReutilizable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ModalReutilizable from '@/components/modal/ModalReutilizable.vue'
import { createSuppliers, getSuppliers } from '../../services/suppliers.service'

const props = defineProps({
  modelValue: String,
  dataClient: Object 
})

const emit = defineEmits(['update:modelValue', 'update:dataClient'])

const openModal = ref(false)
const clientes = ref([])
const search = ref('')

const nuevoCliente = ref({
  name: '',
  nit: '',
  mail: '',
  contact: '',
  reference: ''
})

// Cargar clientes
onMounted(async () => {
  try {
    const suppliers = await getSuppliers()

    clientes.value = suppliers.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
  }
})

// Sincronizar campo visible con el valor del modelo
watch(
  () => props.modelValue,
  newVal => {
    search.value = newVal
  },
  { immediate: true }
)

const filteredClientes = computed(() =>
  clientes.value.filter(c =>
    c.name?.toLowerCase().includes(search.value.toLowerCase())
  )
)

function seleccionarCliente(cliente) {
  emit('update:modelValue', cliente.name)
  emit('update:dataClient', cliente) // <-- aquí mandamos todo el objeto
  search.value = cliente.name
  openModal.value = false
}

// Agrega un nuevo cliente
async function agregarNuevoCliente() {
  if (nuevoCliente.value.name.trim()) {
    try {
      const response = await createSuppliers(nuevoCliente.value)
      const clienteCreado = response.data

      emit('update:modelValue', clienteCreado.name)
      emit('update:dataClient', clienteCreado) // <-- emitimos cliente completo
      search.value = clienteCreado.name
      openModal.value = false

      // También puedes actualizar la lista local si deseas mostrarlo al instante
      clientes.value.push(clienteCreado)
    } catch (error) {
      console.error('Error al crear nuevo cliente:', error)
    }
  }
}
</script>