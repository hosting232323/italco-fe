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
import { useAddresseeStore } from '@/stores/addressees';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const router = useRouter();
const serviceStore = useServiceStore();
const addresseeStore = useAddresseeStore();
const collectionPointStore = useCollectionPointStore();
serviceStore.initList(router);
addresseeStore.initList(router);
collectionPointStore.initList(router);
</script>
