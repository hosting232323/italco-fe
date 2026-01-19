<template>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <template #activator>
      <v-container>
        <h1>
          Dashboard
          <v-btn
            v-if="role && role != 'Delivery'"
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openForm"
          />
          <ExcelOrderImportation v-if="role == 'Admin'" />
          <PDFOrderImportation v-if="role == 'Admin'" />
        </h1><hr>
        <template v-if="role && role != 'Delivery'">
          <OrdersFilters />
          <OrderTable />
        </template>
        <DeliveryDashboard v-else-if="role == 'Delivery'" />
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
import DeliveryDashboard from '@/components/delivery/DeliveryDashboard';
import ExcelOrderImportation from '@/components/administration/excel/OrderImportation';
import PDFOrderImportation from '@/components/administration/pdf/OrderImportation';

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
