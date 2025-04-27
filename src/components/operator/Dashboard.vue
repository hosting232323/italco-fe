<template>
  <OperatorForm />
  <OperatorTable />
</template>

<script setup>
import OperatorForm from '@/components/operator/Form';
import OperatorTable from '@/components/operator/Table';

import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const router = useRouter();
const orderStore = useOrderStore();
const deliveryGroupStore = useDeliveryGroupStore();
orderStore.initList(router);
deliveryGroupStore.initList(router);
</script>
