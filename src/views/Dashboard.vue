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
      <OrderForm v-if="role != 'Delivery'" />
      <!-- <OperatorForm v-if="role == 'Operator'" />
      <DeliveryForm v-if="role == 'Delivery'" /> -->
    </template>
  </v-dialog>
</template>

<script setup>
import OrderTable from '@/components/orders/Table';
import OrdersFilters from '@/components/orders/Filters';
import OrderForm from '@/components/orders/FormCard';
import OrderImportation from '@/components/administration/Importation';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useAddresseeStore } from '@/stores/addressee';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const addresseeStore = useAddresseeStore();
const deliveryGroupStore = useDeliveryGroupStore();
const collectionPointStore = useCollectionPointStore();
const { role, userId } = storeToRefs(userStore);
orderStore.initList(router);
serviceStore.initList(router);
addresseeStore.initList(router);
deliveryGroupStore.initList(router);
collectionPointStore.initList(router);
const { element: order, activeForm } = storeToRefs(orderStore);

const openForm = () => {
  order.value = {};
  if (role.value == 'Customer')
    order.value.user_id = userId.value;
  activeForm.value = true;
};
</script>
