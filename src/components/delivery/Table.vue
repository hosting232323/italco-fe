<template>
  <v-data-table
    :items="orders"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Servizio', value: 'service.name' },
      { title: 'Punto Vendita', value: 'user.email' },
      { title: 'Note Punto Vendita', value: 'customer_note' },
      { title: 'Note Operatori', value: 'operator_note' },
      { title: 'Data', value: 'created_at' },
      { title: 'Stato', value: 'status' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            icon="mdi-check-circle"
            variant="text"
            @click="openForm(item, 'Completed')"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            icon="mdi-close-circle"
            variant="text"
            @click="openForm(item, 'Cancelled')"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            icon="mdi-alert-circle"
            variant="text"
            @click="openForm(item, 'Anomaly')"
          />
        </v-col>
      </v-row>
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

const openForm = (item, status) => {
  order.value = item;
  order.value.status = status;
  activeForm.value = true;
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
