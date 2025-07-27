<template>
  <div>
    <label class="block text-gray-800 font-medium mb-1">{{ label }}</label>
    <input
      :type="type"
      v-model="inputValue"
      class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  label: String,
  modelValue: [String, Number],
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue ?? '')

// Escuchar cambios del padre
watch(() => props.modelValue, val => {
  inputValue.value = val ?? ''
})

// Emitir cambios al padre
watch(inputValue, val => {
  emit('update:modelValue', val)
})
</script>