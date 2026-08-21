<template>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <h1>
          Ordini
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openForm"
          />
          <ExcelImportation v-if="role == 'Admin'" />
          <PdfImportation v-if="role == 'Admin'" />
        </h1><hr>
        <OrdersFilters />
        <OrderTable />
      </v-container>
    </template>
    <template #default>
      <OrderForm />
    </template>
  </v-dialog>
</template>

<script setup>
import OrderTable from '@/components/orders/OrderTable';
import OrderForm from '@/components/orders/OrderFormCard';
import OrdersFilters from '@/components/orders/OrderFilters';
import PdfImportation from '@/components/administration/importation/PdfImportation';
import ExcelImportation from '@/components/administration/importation/ExcelImportation';

import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const userStore = useUserStore();
const orderStore = useOrderStore();
const { role, userId } = storeToRefs(userStore);
const { element: order, activeForm } = storeToRefs(orderStore);

const openForm = () => {
  order.value = {};
  orderStore.addressValid = false;
  if (role.value == 'Customer')
    order.value.user_id = userId.value;
  activeForm.value = true;
};
</script>
