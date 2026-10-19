<template>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <template #activator>
      <v-container class="orders-page">
        <PageHeader title="Ordini">
          <PdfImportation v-if="role == 'Admin'" />
          <ExcelImportation v-if="role == 'Admin'" />
          <v-btn
            prepend-icon="mdi-plus"
            text="Crea nuovo ordine"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm"
          />
        </PageHeader>
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
import PageHeader from '@/components/PageHeader';
import OrderTable from '@/components/orders/OrderTable';
import OrderForm from '@/components/orders/OrderFormCard';
import OrdersFilters from '@/components/orders/OrderFilters';
import PdfImportation from '@/components/administration/importation/PdfImportation';
import ExcelImportation from '@/components/administration/importation/ExcelImportation';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const theme = useTheme();
const userStore = useUserStore();
const orderStore = useOrderStore();
// effectiveRole: il super admin in una company vede l'import Excel/PDF come un admin.
const { effectiveRole: role, userId } = storeToRefs(userStore);
const { element: order, activeForm } = storeToRefs(orderStore);

const openForm = () => {
  order.value = {};
  orderStore.addressValid = false;
  if (role.value == 'Customer')
    order.value.user_id = userId.value;
  activeForm.value = true;
};
</script>

<style scoped>
/* Da desktop la pagina occupa la viewport: titolo, filtri e comandi restano
   fermi e scorre solo la tabella (vedi OrderTable). */
@media (min-width: 960px) {
  .orders-page {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow-y: auto;
  }
}
</style>
