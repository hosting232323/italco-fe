<template>
  <v-data-table
    :items="orders"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Servizio', value: 'service.name' },
      { title: 'Punto Vendita', value: 'user.email' },
      { title: 'Punto di Ritiro', value: 'collection_point.name' },
      { title: 'Note', value: 'customer_note' },
      { title: 'D.P.C.', value: 'dpc' },
      { title: 'D.R.C.', value: 'drc' },
      { title: 'Data Creazione', value: 'created_at' },
      { title: 'Stato', value: 'status' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const theme = useTheme();
const orderStore = useOrderStore();
const { list: orders, element: order, activeForm } = storeToRefs(orderStore);

const openForm = (item) => {
  order.value = item;
  activeForm.value = true;
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
