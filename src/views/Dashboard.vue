<template>
  <v-dialog max-width="1500" v-model="activeForm">
    <template v-slot:activator>
      <v-container>
        <h1>
          Dashboard
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openForm"
            v-if="role != 'Delivery'"
          />
          <OrderImportation v-if="role == 'Admin'" />
        </h1><hr>
        <OrdersFilters />
        <OrderTable />
      </v-container>
    </template>
    <template v-slot:default>
      <OrderForm />
    </template>
  </v-dialog>
</template>

<script setup>
import OrderTable from '@/components/orders/Table';
import OrdersFilters from '@/components/orders/Filters';
import OrderForm from '@/components/orders/FormCard';
import OrderImportation from '@/components/administration/Importation';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
const userStore = useUserStore();
const orderStore = useOrderStore();
const { role, userId } = storeToRefs(userStore);
const { element: order, activeForm } = storeToRefs(orderStore);

const openForm = () => {
  order.value = {};
  if (role.value == 'Customer')
    order.value.user_id = userId.value;
  activeForm.value = true;
};
</script>
