<template>
  <div class="w-full">
    <div class="bg-white shadow-md rounded-xl p-6 mx-auto space-y-8 mb-10">
      <!-- Título -->
      <div>
        <h2 class="text-2xl font-bold text-blue-700">Cotización No. {{ cotizacion.numero }}</h2>
      </div>

      <!-- Datos Generales -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputLabel label="Fecha de Cotización" v-model="cotizacion.fechaCotizacion" type="text" />
        <InputLabel label="Agente Comercial" v-model="cotizacion.agenteComercial" />

        <div>
          <label class="block text-gray-800 font-medium mb-1">Cliente</label>
          <select v-model="cotizacion.cliente" class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800">
            <option value="T">Cliente directo</option>
            <option value="valorListaCompensar">Compensar</option>
            <option value="valorListaColsubsidio">Colsubsidio</option>
            <option value="valorListaCAFAM">Cafam</option>
            <option value="alorListaComfama">Comfama</option>
            <option value="valorListaConfenalco">Comfenalco</option>
          </select>
        </div>

        <ClienteFinalSelector v-model="cotizacion.empresa" v-model:dataClient="clienteSeleccionado" />
        <InputLabel label="Contacto" v-model="cotizacion.contacto" />
        <InputLabel label="Correo" v-model="cotizacion.correo" type="email" />
        <InputLabel label="Celular" v-model="cotizacion.celular" />
      </div>

      <!-- Detalles del Evento -->
      <div class="border-t pt-6 space-y-4">
        <h3 class="text-xl font-semibold text-gray-800">Detalles del Evento</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <InputLabel label="Nombre descriptivo del evento" v-model="cotizacion.vigencia" />
          <InputLabel label="Fecha Inicio Evento" v-model="cotizacion.fechaInicioEvento" type="date" />
          <InputLabel label="Fecha Fin Evento" v-model="cotizacion.fechaFinEvento" type="date" />
          <InputLabel label="Ubicación del Evento" v-model="cotizacion.ubicacion" />

          <MapSelector v-model="cotizacion.linkMaps" />
          <InputLabel label="Horario de Inicio" v-model="cotizacion.horarioInicio" type="time" />
          <InputLabel label="Horario de Finalización" v-model="cotizacion.horarioFin" type="time" />
          <InputLabel label="Número de Asistentes" v-model="cotizacion.asistentes" />
          <InputLabel label="Vigencia de Cotización" v-model="cotizacion.vigencia" />

          <div>
            <label class="block text-gray-800 font-medium mb-1">Unidad de Ejecución</label>
            <select v-model="cotizacion.unidadEjecucion"
              class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800">
              <option>Antioquia</option>
              <option>Cundinamarca</option>
              <option>Colombia</option>
              <option>Israel</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-800 font-medium mb-1">Tipo de Suelo</label>
            <select v-model="cotizacion.tipoSuelo"
              class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800">
              <option>Zona Cesped</option>
              <option>Zona Dura</option>
            </select>
          </div>

        </div>
      </div>

      <!-- Nota -->
      <!-- <div class="pt-6 text-gray-700 text-sm space-y-2">
        <p class="font-semibold">Nota:</p>
        <p>Esta cotización no implica la confirmación del servicio solicitado, ya que está sujeta a disponibilidad.</p>
        <ol class="list-decimal pl-6 space-y-1">
          <li>El cliente debe enviar comentarios y observaciones en el tiempo de vigencia de la cotización.</li>
          <li>Be One SAS analizará la disponibilidad del lugar y servicios ofrecidos.</li>
          <li>Se enviará una respuesta de confirmación, cancelación o fechas disponibles.</li>
        </ol>
      </div> -->

      <!-- Búsqueda y cantidad -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 relative border-t">
        <!-- Buscar Producto -->
        <div class="mt-5">
          <label class="block text-gray-800 font-medium mb-1">Buscar Producto</label>
          <input type="text" v-model="searchProducto" @focus="mostrarLista = true" @blur="ocultarListaConRetraso"
            @input="filtrarProductos" placeholder="Buscar producto por nombre..."
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800" />

          <ul v-if="mostrarLista && productosFiltrados.length"
            class="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto ">
            <li v-for="producto in productosFiltrados" :key="producto.id"
              @mousedown.prevent="seleccionarProducto(producto)"
              class="flex px-4 py-2 hover:bg-gray-100 cursor-pointer justify-between">

              <div>
                {{ producto.dispositivo }} /
                <span class="text-gray-400 text-[12px]">{{ producto.descripcion }}</span>
              </div>

              <div class="flex flex-col gap-2">
                <Badge :estado="producto.availabilityStatus" />
                <ConditionBadge :condition="producto.conditionStatus" />
              </div>
            </li>
          </ul>
        </div>

        <!-- Buscar Categoría -->
        <div class="relative mt-5">
          <label class="block text-gray-800 font-medium mb-1">Filtrar por categoría</label>
          <input type="text" v-model="searchCategoria" @input="filtrarCategorias" @focus="mostrarListaFilter = true"
            placeholder="Buscar categoría..." class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800" />

          <ul v-if="mostrarListaFilter && categoriasFiltradas.length"
            class="absolute z-10 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto">
            <li v-for="categoria in categoriasFiltradas" :key="categoria"
              @mousedown.prevent="seleccionarCategoria(categoria)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
              {{ categoria }}
            </li>
          </ul>

        </div>
      </div>

      <BarraInfo :motores="selectedProduct.qMotores" :amperios="selectedProduct.amperios" :precio="unitPrice" />

      <div class="flex gap-4 w-full align-center justify-end">
        <div class="w-full">
          <label class="block text-gray-800 font-medium mb-1">Q de Jornada</label>
          <input v-model="cotizacion.cantidadJornada" type="number" min="0"
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800" />
        </div>
        <div class="w-full">
          <label class="block text-gray-800 font-medium mb-1">Q de producto</label>
          <input v-model="cotizacion.cantidadProducto" type="number" min="0"
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800" />
        </div>


        <button @click="abrirModal"
          class="bg-[#dbeafe] w-full min-w-[220px] hover:bg-blue-200 text-blue-600 font-semibold py-2 px-6 rounded-lg shadow flex items-center justify-center gap-2">
          Agregar producto de tercero
        </button>


        <button @click="addProduct"
          class="bg-blue-600 w-full min-w-[220px] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center justify-center gap-2">
          Agregar
        </button>

      </div>
    </div>

    <div class=" w-full mb-10">
      <ResumenCotizacion :subtotal="100000" :iva="19000" :valorTotal="119000" :subtotalDescuento="90000"
        :ivaDescuento="17100" :valorTotalDescuento="107100" :subtotalFinal="95000" :ivaFinal="18050"
        :valorTotalFinal="113050" />

      <div class="mt-3">
        <button @click="startQuote"
          class="bg-blue-600 w-full min-w-[220px] hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center justify-center gap-2">
          Generar la cotización
        </button>
      </div>
    </div>

    <!-- Tabla de cotizaciones -->
    <div class="bg-white rounded-2xl shadow-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4">Lista de Cotizaciones</h2>

      <div class="overflow-x-auto w-full max-w-[1330px]">
        <table class="min-w-[1200px] table-auto border-separate border-spacing-y-3">
          <thead>
            <tr class="text-left text-sm text-gray-600">
              <th class="px-4 py-2">Id</th>

              <th class="px-4 py-2">Q de jornada</th>
              <th class="px-4 py-2">Q de producto</th>
              <th class="px-4 py-2">Categoria</th>
              <th class="px-4 py-2">Dispositivo</th>
              <th class="px-4 py-2">Descripción</th>
              <th class="px-4 py-2">Incluye transporte</th>
              <th class="px-4 py-2">Medidas</th>
              <th class="px-4 py-2">Link de foto</th>
              <th class="px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in items" :key="index" class="bg-gray-50 rounded-lg shadow-sm text-[12px]">
              <td class="px-4 py-3 text-gray-800 font-medium">{{ index + 1 }}</td>

              <td class="px-4 py-3">{{ item.qProducto }}</td>
              <td class="px-4 py-3">{{ item.qProducto }}</td>
              <td class="px-4 py-3">{{ item.category }}</td>
              <td class="px-4 py-3">{{ item.dispositivo }}</td>
              <td class="px-4 py-3">{{ item.descripcion }}</td>
              <td class="px-4 py-3">{{ item.incluyeTransporte }}</td>
              <td class="px-4 py-3">{{ item.medidas }}</td>
              <td class="px-4 py-3"><a :href="item.linkFoto" target="_blank">Link</a></td>
              <td class="px-4 py-3"><Badge :estado=" item.estado" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ModalReutilizable :show="modalNuevoProducto" @close="cerrarModal">
      <h2 class="text-xl font-bold text-blue-800 mb-4">Ingreso de producto de tercero</h2>
      <form @submit.prevent="guardarProducto">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-for="(field, index) in campos" :key="index">
            <label class="block text-gray-700 mb-1" :for="field.id">{{ field.label }}</label>
            <input :id="field.id" :type="field.type" v-model="producto[field.model]"
              class="w-full border border-gray-300 rounded px-3 py-2" />
          </div>
        </div>

        <div class="flex justify-end mt-4">
          <button type="button" class="mr-2 px-4 py-2 bg-gray-200 rounded" @click="cerrarModal">Cancelar</button>
          <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </form>
    </ModalReutilizable>

  </div>
</template>


<script setup>
import InputLabel from '@/components/input/InputLabel.vue';
import { ref, reactive, onMounted, watch } from 'vue';
import { getProducts } from '../../services/products.service';
import { getCustomer } from '../../services/customer.service';
import ModalReutilizable from '../../components/modal/ModalReutilizable.vue';
import { createQuotation, getQuotation } from '../../services/quotation.service';
import ResumenCotizacion from '../../components/panels/ResumenCotizacion.vue';
import ClienteFinalSelector from '../suppliers/ClienteFinalSelector.vue';
import BarraInfo from '../../components/panels/BarraInfo.vue';
import { useAuth } from '../../composables/useAuth';
import { formatDateTime, formatIsoToCustom, getCurrentISODate } from '../../utils/date';
import MapSelector from '../../components/map/MapSelector.vue';
import { searchByKey } from '../../utils/filter';
import Badge from '../../components/badge/Badge.vue';
import ConditionBadge from '../../components/badge/ConditionBadge.vue';

const { user } = useAuth()
const productos = ref([]);
const selectedProduct = ref([])
const quotation = ref([])
const productosFiltrados = ref([]);
const categoria = ref([]);
const categoriasFiltradas = ref([]);
const searchProducto = ref('');
const searchCategoria = ref('');
const productosTotal = ref(0);
const mostrarLista = ref(false);
const mostrarListaFilter = ref(false);
const modalNuevoProducto = ref(false);
const clienteSeleccionado = ref({})
const unitPrice = ref(0)

const items = ref([])


const cotizacion = reactive({
  numero: 117,
  fechaCotizacion: "",
  agenteComercial: '',
  cliente: '',
  empresa: '',
  contacto: '',
  correo: '',
  celular: '',
  fechaInicioEvento: "",
  fechaFinEvento: "",
  ubicacion: '',
  linkMaps: '',
  horarioInicio: '00:00',
  horarioFin: '00:00',
  asistentes: 10,
  vigencia: '15 días',
  unidadEjecucion: 'Nivel Nacional',
  tipoSuelo: '',
  cantidadJornada: 2,
  cantidadProducto: 3,
  quotationStatusId: 1
});

const addProductBox = ref({

})

//Auto completa el campo Agente comercial
onMounted(async () => {
  cotizacion.fechaCotizacion = formatDateTime(getCurrentISODate())
  cotizacion.agenteComercial = user.value.fullName
})

/**
 * !Corregir reference, es un numero de celular
 * !Coregir la variable de mail 
 */
watch(clienteSeleccionado, (nuevoCliente) => {
  console.log(nuevoCliente)
  cotizacion.contacto = nuevoCliente.phone
  cotizacion.correo = nuevoCliente.email
  cotizacion.celular = nuevoCliente.reference
})

function abrirModal() {
  modalNuevoProducto.value = true;
}

function cerrarModal() {
  modalNuevoProducto.value = false;
}

//*Obtiene los productos
onMounted(async () => {
  try {
    const response = await getProducts();
    productos.value = response.data;
    productosFiltrados.value = response.data;

    // Extraer categorías únicas
    const categoriasUnicas = [
      ...new Set(productos.value.map((p) => p.categoria).filter(Boolean)),
    ];
    categoria.value = categoriasUnicas;
    categoriasFiltradas.value = categoriasUnicas;
  } catch (error) {
    console.error('Error al cargar productos:', error);
  }

  try {
    const customer = await getCustomer();
    console.log('Clientes cargados:', customer.data);
  } catch (error) {
    console.error('Error al cargar clientes:', error);
  }
});


/**
 * Cotizaciones
 */
const myQuotes = async () => {
  try {
    const response = await getQuotation()
    quotation.value = response.data
    console.log(response.data)
  } catch (error) {
    console.error('Error al cargar la cotizaciones:', error);
  }
}

//*Obtiene las cotizaciones creadas de la orden
onMounted(async () => {
  myQuotes()
})

const filtrarProductos = () => {
  const termProducto = searchProducto.value.toLowerCase().trim();
  const termCategoria = searchCategoria.value.toLowerCase().trim();

  productosFiltrados.value = productos.value.filter(p => {
    const coincideProducto = p.nombre?.toLowerCase().includes(termProducto);
    const coincideCategoria = p.categoria?.toLowerCase().includes(termCategoria);
    return coincideProducto && coincideCategoria;
  });
};

//Las categorias de los productos
const filtrarCategorias = () => {
  const term = searchCategoria.value.toLowerCase().trim();
  categoriasFiltradas.value = categoria.value.filter((c) =>
    c.toLowerCase().includes(term)
  );
};

//Producto seleccionado 
const seleccionarProducto = (producto) => {
  selectedProduct.value = producto
  searchProducto.value = producto.nombre;
  productosTotal.value = producto.total

  //Filtra el valor unitario del cliente que corresponde
  unitPrice.value = searchByKey(cotizacion.cliente, producto)

  mostrarLista.value = false;
};

const seleccionarCategoria = (cat) => {
  searchCategoria.value = cat;
  mostrarListaFilter.value = false;
  filtrarProductos();
};

const ocultarListaConRetraso = () => {
  setTimeout(() => {
    mostrarLista.value = false;
    mostrarListaFilter.value = false;
  }, 200);
};

watch(searchCategoria, filtrarProductos, filtrarCategorias);


const producto = ref({
  idCatalogo: null,
  nombre: '',
  valorCuadroCotizador: null,
  cop: null,
  linkFotoDispositivo: '',
  dispositivo: '',
  descripcion: '',
  incluyeTransporteBogMde: '',
  valorListaCAFAM: null,
  valorListaColsubsidio: null,
  valorListaComfama: null,
  valorListaCompensar: null,
  valorListaConfenalco: null,
  valorCuadroCotizador1: null,
  verificarPrestacionProvExterno: ''
})

const campos = [
  { id: 'idCatalogo', label: 'ID Catálogo', model: 'idCatalogo', type: 'number' },
  { id: 'idCatalogo', label: 'ID Cotizador', model: 'idCatalogo', type: 'number' },
  { id: 'verificarPrestacionProvExterno', label: 'Proveedor', model: 'verificarPrestacionProvExterno', type: 'text' },
  { id: 'nombre', label: 'Descripción producto', model: 'nombre', type: 'text' },

  { id: 'Cotización del proveedor', label: 'Cotización del proveedor', model: 'Cotización del proveedor', type: 'file' },
  { id: 'Imagen del producto', label: 'Imagen del producto', model: 'Cotización del proveedor', type: 'file' },

  { id: 'cop', label: 'Costo del producto', model: 'cop', type: 'number' },
  { id: 'dispositivo', label: 'Categoria', model: 'dispositivo', type: 'text' },
  { id: 'incluyeTransporteBogMde', label: 'Incluye Transporte Bog-Mde', model: 'incluyeTransporteBogMde', type: 'text' },
  { id: 'Fecha de carga', label: 'Fecha de carga', model: 'Fecha de carga', type: 'text' },
]

//Iniciar un cotización
const addProduct = async () => {
  try {
    console.log(selectedProduct.value)
    items.value.push({
      quotationId: 7,
      productId: selectedProduct.value.id,
      qProducto: 2,
      category: selectedProduct.value.categoria,
      dispositivo:  selectedProduct.value.dispositivo,
      descripcion:  selectedProduct.value.descripcion,
      incluyeTransporte: selectedProduct.value.incluyeTransporteBogMde,
      medidas: selectedProduct.value.medidas,
      linkFoto: selectedProduct.value.linkFotoDispositivo,
      estado: selectedProduct.value.availabilityStatus,
    })


    console.log(items)
    searchProducto.value = ''
    // const response = await createQuotation(cotizacion)
    // console.log(response)


  } catch (error) {
    throw Error('La creacion de la cotización fallo')
  }
}

//Iniciar un cotización
const startQuote = async () => {




  try {
    const data = {
      numero: cotizacion.numero,
      fechaCotizacion: cotizacion.fechaCotizacion,
      agenteComercial: cotizacion.agenteComercial,
      cliente: cotizacion.cliente,
      empresa: cotizacion.empresa,
      contacto: cotizacion.contacto,
      correo: cotizacion.correo,
      celular: cotizacion.celular,
      fechaInicioEvento: formatDateTime(cotizacion.fechaInicioEvento),
      fechaFinEvento: formatDateTime(cotizacion.fechaFinEvento),
      ubicacion: cotizacion.ubicacion,
      linkMaps: cotizacion.linkMaps,
      horarioInicio: cotizacion.horarioInicio,
      horarioFin: cotizacion.horarioFin,
      asistentes: cotizacion.asistentes,
      vigencia: cotizacion.vigencia,
      unidadEjecucion: cotizacion.unidadEjecucion,
      tipoSuelo: cotizacion.tipoSuelo,
      cantidadJornada: cotizacion.cantidadJornada,
      cantidadProducto: cotizacion.cantidadProducto,
      quotationStatusId: cotizacion.quotationStatusId,
      items: [
        { productId: selectedProduct.value.id, quantity: 2, unitPrice: 2000, total: 4000 },
      ]
    }

    const response = await createQuotation(data)
    console.log(response)

    myQuotes()
  } catch (error) {
    throw Error('La creacion de la cotización fallo')
  }
}


</script>
