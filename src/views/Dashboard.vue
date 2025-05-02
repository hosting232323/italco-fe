<template>
  <v-container>
    <h1>
      Dashboard
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
        v-if="['Admin', 'Operator'].includes(role)"
      />
    </h1><hr>
    <template v-if="role == 'Customer'">
      <CustomersForm />
      <hr class="mt-5 mb-2">
      <h2>Servizi disponibili</h2>
      <PriceList />
    </template>
    <template v-else>
      <OrderForm v-if="role != 'Delivery'" />
      <OperatorForm v-if="role == 'Operator'" />
      <DeliveryForm v-if="role == 'Delivery'" />
      <DashboardFilters />
      <OrderTable />
    </template>
  </v-container>
</template>

<script setup>
import OrderTable from '@/components/orders/Table';
import OperatorForm from '@/components/operator/Form';
import DeliveryForm from '@/components/delivery/Form';
import CustomersForm from '@/components/customers/Form';
import OrderForm from '@/components/orders/ExternalForm';
import PriceList from '@/components/customers/PriceList';
import DashboardFilters from '@/components/DashboardFilters';

import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useProductStore } from '@/stores/product';
import { useAddresseeStore } from '@/stores/addressee';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const productStore = useProductStore();
const addresseeStore = useAddresseeStore();
const deliveryGroupStore = useDeliveryGroupStore();
const collectionPointStore = useCollectionPointStore();
const { role } = storeToRefs(userStore);
orderStore.initList(router);
serviceStore.initList(router);
productStore.initList(router);
addresseeStore.initList(router);
deliveryGroupStore.initList(router);
collectionPointStore.initList(router);
const { element: order, activeForm } = storeToRefs(orderStore);

const openForm = () => {
  order.value = {};
  activeForm.value = true;
};
</script>
