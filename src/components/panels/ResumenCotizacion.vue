<template>
    <div class="p-4 rounded-2xl shadow-md space-y-4">
        <div class="grid grid-cols-3 gap-4 text-sm text-gray-800">
            <!-- Subtotal -->
            <div class="space-y-2">
                <div class="font-bold text-center bg-cyan-400 text-white py-1 rounded">SUBTOTAL</div>
                <div class="flex justify-between border-t pt-1">
                    <span>SUB TOTAL:</span>
                    <span>{{ formato(subtotal) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>IVA:</span>
                    <span>{{ formato(iva) }}</span>
                </div>
                <div class="flex justify-between font-bold border-t pt-1">
                    <span>VALOR TOTAL:</span>
                    <span>{{ formato(valorTotal) }}</span>
                </div>
            </div>

            <!-- Con Descuento -->
            <div class="space-y-2">
                <div class="font-bold text-center bg-cyan-400 text-white py-1 rounded">CON DESCUENTO</div>
                <div class="flex justify-between border-t pt-1">
                    <span>SUB TOTAL:</span>
                    <span>{{ formato(subtotalDescuento) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>IVA:</span>
                    <span>{{ formato(ivaDescuento) }}</span>
                </div>
                <div class="flex justify-between font-bold border-t pt-1">
                    <span>VALOR TOTAL:</span>
                    <span>{{ formato(valorTotalDescuento) }}</span>
                </div>
            </div>

            <!-- Total -->
            <div class="space-y-2">
                <div class="font-bold text-center bg-cyan-400 text-white py-1 rounded">TOTAL</div>
                <div class="flex justify-between border-t pt-1">
                    <span>SUB TOTAL:</span>
                    <span>{{ formato(subtotalFinal) }}</span>
                </div>
                <div class="flex justify-between">
                    <span>IVA:</span>
                    <span>{{ formato(ivaFinal) }}</span>
                </div>
                <div class="flex justify-between font-bold border-t pt-1">
                    <span>VALOR TOTAL:</span>
                    <span>{{ formato(valorTotalFinal) }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    subtotal: Number,
    iva: Number,
    valorTotal: Number,
    subtotalDescuento: Number,
    ivaDescuento: Number,
    valorTotalDescuento: Number,
    subtotalFinal: Number,
    ivaFinal: Number,
    valorTotalFinal: Number
})

function formato(valor) {
    return valor != null ? `$ ${valor.toLocaleString()}` : '#VALUE!';
}
</script>