<template>
  <v-data-table
    :items="orders"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Servizio', value: 'service.name' },
      { title: 'Punto Vendita', value: 'user.email' },
      { title: 'Data', value: 'created_at' },
      { title: 'Stato', value: 'status' },
      { title: 'Note', value: 'note' },
      { title: 'Gruppo', value: 'group' },
      { title: 'Motivation', value: 'motivation' }
    ]"
  />
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const theme = useTheme();
const orderStore = useOrderStore();
const { list: orders } = storeToRefs(orderStore);
orderStore.initList();
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
