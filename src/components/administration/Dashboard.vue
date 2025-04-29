<template>
  <DashboardFilters />
  <v-data-table
    :items="orders"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Servizio', value: 'service.name' },
      { title: 'Punto Vendita', value: 'user.email' },
      { title: 'Punto di Ritiro', value: 'collection_point.name' },
      { title: 'Note Punto Vendita', value: 'customer_note' },
      { title: 'Note Operatori', value: 'operator_note' },
      { title: 'D.P.C.', value: 'dpc' },
      { title: 'D.R.C.', value: 'drc' },
      { title: 'Data Creazione', value: 'created_at' },
      { title: 'Gruppo Delivery', value: 'delivery_group.name' },
      { title: 'Stato', value: 'status' },
      { title: 'Motivation', value: 'motivation' }
    ]"
  />
</template>

<script setup>
import DashboardFilters from '@/components/DashboardFilters';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useCollectionPointStore } from '@/stores/collectionPoints';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const theme = useTheme();
const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const deliveryGroupStore = useDeliveryGroupStore();
const collectionPointStore = useCollectionPointStore();
const administrationUserStore = useAdministrationUserStore();
const { list: orders } = storeToRefs(orderStore);
orderStore.initList(router);
orderStore.initList(router);
serviceStore.initList(router);
deliveryGroupStore.initList(router);
collectionPointStore.initList(router);
administrationUserStore.initList(router);
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
