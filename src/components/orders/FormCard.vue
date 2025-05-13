<template>
  <v-card
    :title="order.id ? `Modifica Ordine ${order.id}` : 'Crea Ordine'"
    :subtitle="subtitle"
    class="mt-10"
    v-if="activeForm"
  >
    <v-card-text v-if="order.user_id">
      <OrderForm @goBack="goBack" />
    </v-card-text>
    <v-card-text v-else>
      <CustomerForm />
    </v-card-text>
  </v-card>
</template>

<script setup>
import OrderForm from '@/components/orders/Form';
import CustomerForm from '@/components/orders/CustomerForm';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
const { activeForm, element: order } = storeToRefs(orderStore);
const subtitle = ref(order.user ? `Punto Vendita: ${order.user.email}` : '');

const goBack = () => {
  order.value = {};
};
</script>
