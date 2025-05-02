<template>
  <v-container>
    <h1>Ordini</h1><hr>
    <DashboardFilters />
    <OrderTable />
  </v-container>
</template>

<script setup>
import OrderTable from '@/components/orders/Table';
import DashboardFilters from '@/components/DashboardFilters';

import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useProductStore } from '@/stores/product';
import { useAddresseeStore } from '@/stores/addressee';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const productStore = useProductStore();
const addresseeStore = useAddresseeStore();
const deliveryGroupStore = useDeliveryGroupStore();
const collectionPointStore = useCollectionPointStore();
orderStore.initList(router);
serviceStore.initList(router);
productStore.initList(router);
addresseeStore.initList(router);
deliveryGroupStore.initList(router);
collectionPointStore.initList(router);
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
