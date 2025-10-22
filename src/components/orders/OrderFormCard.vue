<template>
  <v-card
    v-if="activeForm"
    :title="order.id ? `Modifica Ordine ${order.id}` : 'Crea Ordine'"
    :subtitle="subtitle"
    class="mt-10"
  >
    <v-card-text v-if="order.dates_form">
      <DatesForm />
    </v-card-text>
    <v-card-text v-else-if="order.user_id">
      <OrderForm v-if="role != 'Delivery'" />
      <DeliveryForm v-else />
    </v-card-text>
    <v-card-text v-else>
      <CustomerForm @set-subtitle="setSubtitle" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import OrderForm from '@/components/orders/OrderForm';
import DeliveryForm from '@/components/delivery/DeliveryForm';
import CustomerForm from '@/components/orders/OrderCustomerForm';
import DatesForm from '@/components/orders/OrderDatesForm';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const userStore = useUserStore();
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const { activeForm, element: order } = storeToRefs(orderStore);
const subtitle = ref(order.user ? `Punto Vendita: ${order.user.nickname}` : '');

const setSubtitle = (value) => {
  subtitle.value = value;
};
</script>
