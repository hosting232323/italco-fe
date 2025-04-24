<template>
  <v-data-table
    :items="orders"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Servizio', value: 'service' },
      { title: 'Punto Vendita', value: 'point_of_sale' },
      { title: 'Data', value: 'created_at' },
      { title: 'Stato', value: 'status' },
      { title: 'Note', value: 'note' },
      { title: 'Gruppo', value: 'group' },
      { title: 'Motivation', value: 'motivation' }
    ]"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
const { list: orders } = storeToRefs(orderStore);
orderStore.initList();
</script>
