<template>
  <div>
    <h1>Stato Ordine</h1>
    <p v-if="orderIdNumeric !== null">
      ID ordine decodificato: {{ orderIdNumeric }}
    </p>
    <p v-else>
      ID ordine non valido.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { decodeId } from '@/utils/hashids';

const props = defineProps({
  orderId: String,
});

const orderIdNumeric = ref(null);

onMounted(() => {
  const decoded = decodeId(props.orderId);
  if (decoded === null) {
    console.error('ID ordine non valido o corrotto');
  } else {
    orderIdNumeric.value = decoded;
    console.log('ID ordine reale:', decoded);
    // Puoi eseguire ulteriori operazioni qui
  }
});
</script>
