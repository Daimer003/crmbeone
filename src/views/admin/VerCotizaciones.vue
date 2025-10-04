<script setup>
import { ref, onMounted } from "vue";
import { getQuotations } from "../../services/quotation.service";
import Badge from "../../components/badge/Badge.vue";
import ModalReutilizable from "../../components/modal/ModalReutilizable.vue";
import { useRouter } from "vue-router";

const { push } = useRouter()

const quotations = ref([]);
const isModalOpen = ref(false);
const selectedQuotation = ref(null);


const quotationVersions = ref([
  { id: 1, fecha: "v1 - 2025-09-01", data: { numero: "001", cliente: "Juan" } },
  { id: 2, fecha: "v2 - 2025-09-05", data: { numero: "001A", cliente: "Pedro" } },
  { id: 3, fecha: "v3 - 2025-09-08", data: { numero: "002", cliente: "María" } },
]);


function selectVersion(version) {
  // Clonamos los datos para edición
  selectedQuotation.value = { ...version.data, versionId: version.id };
}


const loadQuotations = async () => {
  try {
    const response = await getQuotations();
    quotations.value = response.data;
  } catch (error) {
    console.error("Error cargando cotizaciones:", error);
  }
};

const openModal = (quotation) => {
  selectedQuotation.value = { ...quotation }; // clonamos para no mutar directo
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedQuotation.value = null;
};

const saveChanges = () => {
  console.log("Guardar cambios:", selectedQuotation.value);
  // Aquí puedes hacer tu servicio updateQuotation(selectedQuotation.value)
  closeModal();
};

onMounted(() => {
  loadQuotations();
});


const seeTheQuote = (id) => {
  push(`/admin/cotizar/${id}`)
}

</script>

<template>
  <div class="overflow-x-auto w-full max-w-[100vw]">

    <!-- Título -->
    <div>
      <h2 class="text-2xl font-bold text-blue-700">Cotizaciones</h2>
    </div>

    <table class="min-w-[1800px] table-auto border-separate border-spacing-y-3">
      <thead>
        <tr class="text-left text-sm text-gray-600">
          <th class="px-4 py-2">#</th>
          <th class="px-4 py-2">ID</th>
          <th class="px-4 py-2">Número</th>
          <th class="px-4 py-2">Agente Comercial</th>
          <th class="px-4 py-2">Empresa</th>
          <th class="px-4 py-2">Cliente</th>
          <th class="px-4 py-2">Asistentes</th>
          <th class="px-4 py-2">Cantidad Jornada</th>
          <th class="px-4 py-2">Cantidad Producto</th>
          <th class="px-4 py-2">Ubicación</th>
          <th class="px-4 py-2">Tipo de Suelo</th>
          <th class="px-4 py-2">Unidad de Ejecución</th>
          <th class="px-4 py-2">Link de Mapa</th>
          <th class="px-4 py-2">Fecha Cotización</th>
          <th class="px-4 py-2">Inicio Evento</th>
          <th class="px-4 py-2">Fin Evento</th>
          <th class="px-4 py-2">Horario Inicio</th>
          <th class="px-4 py-2">Horario Fin</th>
          <th class="px-4 py-2">Celular</th>
          <th class="px-4 py-2">Correo</th>
          <th class="px-4 py-2">Contacto</th>
          <th class="px-4 py-2">Vigencia</th>
          <th class="px-4 py-2">Estado</th>
          <th class="px-4 py-2">Publicado</th>
          <th class="px-4 py-2">Creado</th>
          <th class="px-4 py-2">Actualizado</th>
          <th class="px-4 py-2">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(q, index) in quotations" :key="q.id"
          class="bg-gray-50 rounded-lg shadow-sm text-[12px] hover:bg-gray-100">
          <td class="px-4 py-3 font-medium">{{ index + 1 }}</td>
          <td class="px-4 py-3">{{ q.id }}</td>
          <td class="px-4 py-3">{{ q.numero }}</td>
          <td class="px-4 py-3">{{ q.agenteComercial }}</td>
          <td class="px-4 py-3">{{ q.empresa }}</td>
          <td class="px-4 py-3">{{ q.cliente }}</td>
          <td class="px-4 py-3">{{ q.asistentes }}</td>
          <td class="px-4 py-3">{{ q.cantidadJornada }}</td>
          <td class="px-4 py-3">{{ q.cantidadProducto }}</td>
          <td class="px-4 py-3">{{ q.ubicacion }}</td>
          <td class="px-4 py-3">{{ q.tipoSuelo }}</td>
          <td class="px-4 py-3">{{ q.unidadEjecucion }}</td>
          <td class="px-4 py-3">
            <a v-if="q.linkMaps" :href="q.linkMaps" target="_blank" class="text-blue-600 underline" @click.stop>Mapa</a>
          </td>
          <td class="px-4 py-3">{{ new Date(q.fechaCotizacion).toLocaleDateString() }}</td>
          <td class="px-4 py-3">{{ new Date(q.fechaInicioEvento).toLocaleDateString() }}</td>
          <td class="px-4 py-3">{{ new Date(q.fechaFinEvento).toLocaleDateString() }}</td>
          <td class="px-4 py-3">{{ q.horarioInicio }}</td>
          <td class="px-4 py-3">{{ q.horarioFin }}</td>
          <td class="px-4 py-3">{{ q.celular }}</td>
          <td class="px-4 py-3">{{ q.correo }}</td>
          <td class="px-4 py-3">{{ q.contacto }}</td>
          <td class="px-4 py-3">{{ q.vigencia }}</td>
          <td class="px-4 py-3">
            <Badge :estado="q.quotationStatus?.name" />
          </td>
          <td class="px-4 py-3">{{ q.isPublished ? "Sí" : "No" }}</td>
          <td class="px-4 py-3">{{ new Date(q.createdAt).toLocaleString() }}</td>
          <td class="px-4 py-3">{{ new Date(q.updatedAt).toLocaleString() }}</td>
          <td class="px-4 py-3">
            <button @click="seeTheQuote(q.id)" class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
              Ver
            </button>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>