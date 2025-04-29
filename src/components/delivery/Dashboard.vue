<template>
  <DashboardFilters />
  <DeliveryForm />
  <DeliveryTable />
</template>

<script setup>
import DeliveryForm from '@/components/delivery/Form';
import DeliveryTable from '@/components/delivery/Table';
import DashboardFilters from '@/components/DashboardFilters';

import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useCollectionPointStore } from '@/stores/collectionPoints';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const collectionPointStore = useCollectionPointStore();
const administrationUserStore = useAdministrationUserStore();
orderStore.initList(router);
serviceStore.initList(router);
collectionPointStore.initList(router);
administrationUserStore.initList(router);
</script>
