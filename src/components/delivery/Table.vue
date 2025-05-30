<template>
  <v-dialog max-width="1500" v-model="dialog">
    <template v-slot:activator>
      <v-data-table
        class="mt-5"
        :items="orders[keyName]"
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
        <template v-slot:item.type="{ item }">
          {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
        </template>
        <template v-slot:item.productsServices="{ item }">
          <template v-for="product in Object.keys(item.products)">
            <b>{{ product }}</b>:
            {{ item.products[product].map(service => service.name).join(', ') }}
            <br>
          </template>
        </template>
        <template v-slot:item.addressee="{ item }">
          {{ item.addressee }}<br>
          <p style="font-size: smaller;">{{ item.address }}, {{ item.cap }}</p>
        </template>
        <template v-slot:item.collection_point="{ item }">
          {{ item.collection_point.name }}<br>
          <p style="font-size: smaller;">{{ getAddress(item.collection_point) }}</p>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-btn
            icon="mdi-pencil"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="order = item; dialog = true"
          />
        </template>
      </v-data-table>
    </template>
    <template v-slot:default>
      <Form @cancel="dialog = false" />
    </template>
  </v-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useOrderStore } from '@/stores/order';

import Form from '@/components/delivery/Form';

const theme = useTheme();
const dialog = ref(false);
const orderStore = useOrderStore();
const { keyName } = defineProps(['keyName']);
const { list: orders, element: order } = storeToRefs(orderStore);

const getAddress = (item) => {
  return item.address + ', ' + item.city + ', ' + item.province + ', ' + item.cap;
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
