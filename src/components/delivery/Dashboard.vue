<template>
  <DeliveryForm />
  <DeliveryTable />
</template>

<script setup>
import DeliveryForm from '@/components/delivery/Form';
import DeliveryTable from '@/components/delivery/Table';

import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';

const router = useRouter();
const orderStore = useOrderStore();
orderStore.initList(router);
</script>
