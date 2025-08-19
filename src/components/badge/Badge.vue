<template>
  <span
    :class="[
      'px-3 py-1 text-xs font-medium rounded-full max-h-[24px]',
      colorClass
    ]"
  >
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  estado: {
    type: String,
    required: true
  }
})

const colorClass = computed(() => {
  switch (props.estado) {
    case 'EN_RESERVA':
      return 'bg-yellow-100 text-yellow-800'
    case 'DISPONIBLE':
      return 'bg-green-100 text-green-800'
    case 'NO_DISPONIBLE':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
})

const label = computed(() => {
  switch (props.estado) {
    case 'EN_RESERVA':
      return 'En reserva'
    case 'DISPONIBLE':
      return 'Disponible'
    case 'NO_DISPONIBLE':
      return 'No disponible'
    default:
      return props.estado
  }
})
</script>