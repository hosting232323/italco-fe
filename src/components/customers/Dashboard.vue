<template>
  <OrderForm />
  <hr class="mt-5 mb-2">
  <h2>Servizi disponibili</h2>
  <PriceList />
</template>

<script setup>
import OrderForm from '@/components/customers/Form';
import PriceList from '@/components/customers/PriceList';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useServiceStore } from '@/stores/service';

const userStore = useUserStore();
const serviceStore = useServiceStore();
const { userId } = storeToRefs(userStore);
serviceStore.initList({ customer_id: 4 });
</script>
