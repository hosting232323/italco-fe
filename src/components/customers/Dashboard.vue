<template>
  <OrderForm />
  <hr class="mt-5 mb-2">
  <h2>Servizi disponibili</h2>
  <PriceList />
</template>

<script setup>
import OrderForm from '@/components/customers/Form';
import PriceList from '@/components/customers/PriceList';

import { useRouter } from 'vue-router';
import { useServiceStore } from '@/stores/service';
import { useaddresseesStore } from '@/stores/addressees';

const router = useRouter();
const serviceStore = useServiceStore();
const addresseesStore = useaddresseesStore();
serviceStore.initList(router);
addresseesStore.initList(router);
</script>
