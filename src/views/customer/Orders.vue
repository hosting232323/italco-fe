<template>
  <v-container>
    <h1>Ordini</h1><hr>
    <DashboardFilters />
    <v-data-table
      :items="orders"
      :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
      :headers="[
        { title: 'ID', value: 'id' },
        { title: 'Servizio', value: 'service.name' },
        { title: 'Punto di Ritiro', value: 'collection_point.name' },
        { title: 'Note', value: 'customer_note' },
        { title: 'D.P.C.', value: 'dpc' },
        { title: 'D.R.C.', value: 'drc' },
        { title: 'Data Creazione', value: 'created_at' },
        { title: 'Stato', value: 'status' }
      ]"
    />
  </v-container>
</template>

<script setup>
import DashboardFilters from '@/components/DashboardFilters';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const theme = useTheme();
const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const collectionPointStore = useCollectionPointStore();
const { list: orders } = storeToRefs(orderStore);
orderStore.initList(router);
serviceStore.initList(router);
collectionPointStore.initList(router);
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
