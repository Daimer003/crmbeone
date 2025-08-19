<template>
  <div>
    <label class="block text-gray-800 font-medium mb-1">Cliente final</label>
    <div class="relative flex items-center gap-2">
      <input v-model="search" @focus="openModal = true" placeholder="Buscar cliente..."
        class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 cursor-pointer" readonly />
      <button v-if="props.dataClient && props.dataClient.name" @click="abrirModalEdicion"
        class="h-full min-h-[42px] max-w-[40px] min-w-[40px] bg-[#dbeafe] hover:bg-[#bfdbfe] flex items-center justify-center rounded"
        title="Editar cliente">
        <IconEdit class="text-black cursor-pointer" />
      </button>
    </div>


    <!-- Modal de búsqueda/creación -->
    <ModalReutilizable :show="openModal" @close="openModal = false">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">Seleccionar Cliente Final</h2>

        <input v-model="search" placeholder="Buscar cliente por nombre..."
          class="w-full border border-gray-300 rounded px-3 py-2 mb-4" />

        <ul class="max-h-60 overflow-auto space-y-1" v-if="filteredClientes.length">
          <li v-for="cliente in filteredClientes" :key="cliente.id"
            class="p-2 border rounded hover:bg-gray-100 cursor-pointer" @click="seleccionarCliente(cliente)">
            {{ cliente.name }}
          </li>
        </ul>

        <div v-else class="text-gray-500 italic mb-4">No hay coincidencias.</div>

        <!-- Formulario nuevo cliente -->
        <div class="space-y-2 mb-4" v-if="!filteredClientes.length">
          <input v-model="nuevoCliente.name" placeholder="Nombre" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.nit" placeholder="NIT" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.email" placeholder="Correo electrónico"
            class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.phone" placeholder="Contacto" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.document" placeholder="Documento" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.contactName" placeholder="Contacto de referencia"
            class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.reference" placeholder="Referencia" class="w-full border px-3 py-2 rounded" />

          <!-- Selector DIRECTO / INDIRECTO -->
          <div class="flex items-center gap-4 mt-3">
            <label class="flex items-center gap-1">
              <input type="radio" value="INDIRECTO" v-model="nuevoCliente.type" />
              INDIRECTO
            </label>
            <label class="flex items-center gap-1">
              <input type="radio" value="DIRECTO" v-model="nuevoCliente.type" />
              DIRECTO
            </label>
          </div>
        </div>

        <div class="mt-4 text-right">
          <button class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" @click="agregarNuevoCliente"
            :disabled="!nuevoCliente.name">
            Agregar nuevo cliente final
          </button>
        </div>
      </div>
    </ModalReutilizable>

    <!-- Modal de edición -->
    <ModalReutilizable :show="modalEditar" @close="modalEditar = false">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Editar Cliente</h2>

        <div class="space-y-2">
          <input v-model="nuevoCliente.name" placeholder="Nombre" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.nit" placeholder="NIT" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.email" placeholder="Correo electrónico"
            class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.phone" placeholder="Contacto" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.document" placeholder="Documento" class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.contactName" placeholder="Contacto de referencia"
            class="w-full border px-3 py-2 rounded" />
          <input v-model="nuevoCliente.reference" placeholder="Referencia" class="w-full border px-3 py-2 rounded" />
        </div>

        <div class="mt-4 text-right">
          <button class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" @click="actualizarCliente"
            :disabled="!nuevoCliente.name">
            Guardar cambios
          </button>
        </div>
      </div>
    </ModalReutilizable>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import ModalReutilizable from '@/components/modal/ModalReutilizable.vue'
import { createClient, getSuppliers, updateClient } from '../../services/suppliers.service'
import IconEdit from '../../Icons/IconEdit.vue'

const props = defineProps({
  modelValue: String,
  dataClient: Object
})

const emit = defineEmits(['update:modelValue', 'update:dataClient'])

const openModal = ref(false)
const modalEditar = ref(false)
const clientes = ref([])
const search = ref('')

const nuevoCliente = ref({
  name: undefined,
  nit: undefined,
  email: undefined,
  phone: undefined,
  document: undefined,
  contactName: undefined,
  reference: undefined,
  type: 'INDIRECTO'
})

// Obtener lista de clientes
onMounted(async () => {
  try {
    const suppliers = await getSuppliers()
    clientes.value = suppliers.data
  } catch (error) {
    console.error('Error al obtener clientes:', error)
  }
})

// Sincronizar input con valor recibido
watch(
  () => props.modelValue,
  newVal => {
    search.value = newVal || ''
  },
  { immediate: true }
)

// Si se recibe dataClient (modo edición), prellenamos
watch(
  () => props.dataClient,
  (cliente) => {
    if (cliente && cliente.name) {
      search.value = cliente.name
    }
  },
  { immediate: true }
)

// Filtro de clientes
const filteredClientes = computed(() =>
  clientes.value.filter(c =>
    c.name?.toLowerCase().includes(search.value.toLowerCase())
  )
)

// Seleccionar cliente
function seleccionarCliente(cliente) {
  emit('update:modelValue', cliente.name)
  emit('update:dataClient', cliente)
  search.value = cliente.name
  openModal.value = false
}

// Crear nuevo cliente
async function agregarNuevoCliente() {
  if (nuevoCliente.value.name.trim()) {
    try {
      const response = await createClient(nuevoCliente.value)
      const clienteCreado = response.data

      emit('update:modelValue', clienteCreado.name)
      emit('update:dataClient', clienteCreado)
      search.value = clienteCreado.name
      openModal.value = false

      clientes.value.push(clienteCreado)
    } catch (error) {
      console.error('Error al crear nuevo cliente:', error)
    }
  }
}

// Abrir modal de edición
function abrirModalEdicion() {
  if (props.dataClient) {
    nuevoCliente.value = { ...props.dataClient }
    modalEditar.value = true
  }
}

// Actualizar cliente
async function actualizarCliente() {
  try {
    const response = await updateClient(nuevoCliente.value.id, nuevoCliente.value)
    const clienteActualizado = response.data

    // Actualizar lista
    const index = clientes.value.findIndex(c => c.id === clienteActualizado.id)
    if (index !== -1) {
      clientes.value[index] = clienteActualizado
    }

    emit('update:modelValue', clienteActualizado.name)
    emit('update:dataClient', clienteActualizado)
    search.value = clienteActualizado.name
    modalEditar.value = false
  } catch (error) {
    console.error('Error al actualizar cliente:', error)
  }
}
</script>