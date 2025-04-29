<template>
  <DashboardFilters />
  <OperatorForm />
  <OperatorTable />
</template>

<script setup>
import OperatorForm from '@/components/operator/Form';
import OperatorTable from '@/components/operator/Table';
import DashboardFilters from '@/components/DashboardFilters';

import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useCollectionPointStore } from '@/stores/collectionPoints';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const router = useRouter();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const deliveryGroupStore = useDeliveryGroupStore();
const collectionPointStore = useCollectionPointStore();
const administrationUserStore = useAdministrationUserStore();
orderStore.initList(router);
serviceStore.initList(router);
deliveryGroupStore.initList(router);
collectionPointStore.initList(router);
administrationUserStore.initList(router);
</script>
