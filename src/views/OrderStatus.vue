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

<script>
import { decodeId } from '@/utils/hashids';

export default {
  props: ['orderId'],
  data() {
    return {
      orderIdNumeric: null,
    };
  },
  mounted() {
    this.orderIdNumeric = decodeId(this.orderId);
    if (this.orderIdNumeric === null) {
      console.error('ID ordine non valido o corrotto');
    } else {
      // Qui puoi chiamare API o logica con orderIdNumeric
      console.log('ID ordine reale:', this.orderIdNumeric);
    }
  },
};
</script>
