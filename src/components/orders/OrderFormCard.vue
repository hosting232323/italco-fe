<template>
  <v-card
    v-if="activeForm"
    :title="order.id ? `Modifica Ordine ${order.id}` :
      (order.cloned_order_id ? `Clona Ordine ${order.cloned_order_id}` : 'Crea Ordine')"
    :subtitle="subtitle"
    class="mt-10"
  >
    <v-card-text v-if="order.dates_form">
      <DatesForm />
    </v-card-text>
    <v-card-text v-else-if="order.user_id">
      <OrderForm />
    </v-card-text>
    <v-card-text v-else>
      <CustomerForm @set-subtitle="setSubtitle" />
    </v-card-text>
  </v-card>
</template>

<script setup>
import customer from '@/utils/customer';
import OrderForm from '@/components/orders/OrderForm';
import DatesForm from '@/components/orders/OrderDatesForm';
import CustomerForm from '@/components/orders/OrderCustomerForm';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useOrderStore } from '@/stores/order';

const orderStore = useOrderStore();
const { activeForm, element: order } = storeToRefs(orderStore);
const subtitle = ref(order.user ? `Punto Vendita: ${customer.customerName(order.user)}` : '');

const setSubtitle = (value) => {
  subtitle.value = value;
};
</script>
