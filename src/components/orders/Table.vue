<template>
  <v-data-table
    :items="orders"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="getHeaders()"
  >
    <template v-slot:item.type="{ item }">
      {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
    </template>
    <template v-slot:item.services="{ item }">
      {{ item.services ? item.services.map(service => service.name).join(', ') : '' }}
    </template>
    <template v-slot:item.products="{ item }">
      {{ item.products ? item.products.map(product => product.name).join(', ') : '' }}
    </template>
    <template v-slot:item.status="{ item }">
      {{ orderUtils.LABELS[item.status] }}
    </template>
    <template v-slot:item.actions="{ item }">
      <OperatorAction :item="item" v-if="role == 'Operator'" />
      <DeliveryAction :item="item" v-if="role == 'Delivery'" />
    </template>
  </v-data-table>
</template>

<script setup>
import DeliveryAction from '@/components/delivery/Actions';
import OperatorAction from '@/components/operator/Actions';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const theme = useTheme();
const userStore = useUserStore();
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const { list: orders } = storeToRefs(orderStore);

const getHeaders = () => {
  const headers = [
    { title: 'ID', value: 'id' },
    { title:'Tipo', value: 'type' },
    { title:'Prodotti', value: 'products' }
  ];
  if (role.value != 'Customer')
    headers.push({ title: 'Servizi', value: 'services' });
  headers.push(
    { title: 'Punto Vendita', value: 'user.email' },
    { title: 'Punto di Ritiro', value: 'collection_point.name' }
  );
  if (['Customer', 'Operator'].includes(role.value))
    headers.push({ title: 'Note', value: 'customer_note' });
  else
    headers.push(
      { title: 'Note Punto Vendita', value: 'customer_note' },
      { title: 'Note Operatori', value: 'operator_note' }
    );
  headers.push(
    { title: 'D.P.C.', value: 'dpc' },
    { title: 'D.R.C.', value: 'drc' },
    { title: 'Data Creazione', value: 'created_at' },
    { title: 'Stato', value: 'status' }
  );
  if (['Admin', 'Operator'].includes(role.value))
    headers.push(
      { title: 'Gruppo Delivery', value: 'delivery_group.name' },
      { title: 'Motivation', value: 'motivation' }
    );
  if (['Operator', 'Delivery'].includes(role.value))
    headers.push({ title: 'Azioni', key: 'actions' });
  return headers;
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
