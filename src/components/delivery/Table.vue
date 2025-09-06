<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-data-table
        v-if="ready"
        class="mt-5"
        :items="filteredOrders"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="[
          { title: 'ID', value: 'id' },
          { title: 'Tipo', value: 'type' },
          { title: 'Prodotti Servizi', value: 'productsServices' },
          { title: 'Punto Vendita', value: 'user.email' },
          { title: 'Destinatario', value: 'addressee' },
          { title: 'Recapito', value: 'addressee_contact' },
          { title: 'Punto di Ritiro', value: 'collection_point' },
          { title: 'Note Punto Vendita', value: 'customer_note' },
          { title: 'Note Operatori', value: 'operator_note' },
          { title: 'Azioni', key: 'actions' }
        ]"
      >
        <template #item.type="{ item }">
          {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
        </template>
        <template #item.productsServices="{ item }">
          <template
            v-for="product in Object.keys(item.products)"
            :key="product"
          >
            <b>{{ product }}</b>:
            {{ item.products[product].map(service => service.name).join(', ') }}
            <br>
          </template>
        </template>
        <template #item.addressee="{ item }">
          {{ item.addressee }}<br>
          <p style="font-size: smaller;">
            {{ item.address }}, {{ item.cap }}
          </p>
        </template>
        <template #item.collection_point="{ item }">
          {{ item.collection_point.name }}<br>
          <p style="font-size: smaller;">
            {{ item.collection_point.address }}, {{ item.collection_point.cap }}
          </p>
        </template>
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="order = item; dialog = true"
          />
        </template>
      </v-data-table>
    </template>
    <template #default>
      <Form @cancel="dialog = false" />
    </template>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useOrderStore } from '@/stores/order';
import Form from '@/components/delivery/Form';

const theme = useTheme();
const dialog = ref(false);
const orderStore = useOrderStore();
const { keyName } = defineProps(['keyName']);
const { list: orders, element: order, ready } = storeToRefs(orderStore);

const filteredOrders = computed(() => {
  if (keyName === 'Anomaly') {
    return [...(orders.value['In Progress'] || []), ...(orders.value['On Board'] || [])].filter(o => o.anomaly);
  } else if (keyName === 'Delay') {
    return [...(orders.value['In Progress'] || []), ...(orders.value['On Board'] || [])].filter(o => o.delay);
  } else {
    return orders.value[keyName] || [];
  }
});
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
