<template>
  <v-card
    :title="order.id ? `Modifica Ordine ${order.id}` : 'Crea Ordine'"
    :subtitle="subtitle"
    class="mt-10"
    v-if="activeForm"
  >
    <v-card-text v-if="order.user_id">
      <OrderForm v-if="role != 'Delivery'" @goBack="goBack" />
      <DeliveryForm v-else />
    </v-card-text>
    <v-card-text v-else>
      <CustomerForm @setSubtitle="setSubtitle" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import OrderForm from '@/components/orders/Form';
import DeliveryForm from '@/components/delivery/Form';
import CustomerForm from '@/components/orders/CustomerForm';

import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const userStore = useUserStore();
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const { activeForm, element: order } = storeToRefs(orderStore);
const subtitle = ref(order.user ? `Punto Vendita: ${order.user.email}` : '');

const goBack = () => {
  order.value = {};
};

const setSubtitle = (value) => {
  subtitle.value = value;
};
</script>
