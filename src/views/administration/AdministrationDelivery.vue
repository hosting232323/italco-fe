<template>
  <v-container>
    <h1>
      Veicoli
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openTransportForm"
      />
    </h1><hr>
    <TransportForm />
    <TransportTable />
    <h1>
      Gestione Utenti Delivery
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openDeliveryUserForm"
      />
    </h1><hr class="mt-2">
    <UserForm settedRole="Delivery" />
    <UserTable settedRole="Delivery" />
  </v-container>
</template>

<script setup>
import UserForm from '@/components/administration/users/UserForm';
import UserTable from '@/components/administration/users/UserTable';
import TransportForm from '@/components/administration/transports/TransportForm';
import TransportTable from '@/components/administration/transports/TransportTable';

import { storeToRefs } from 'pinia';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const transportStore = useTransportStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: activeTransportForm, element: transport } = storeToRefs(transportStore);
const { activeForm: activeDeliveryUserForm, element: deliveryUser } = storeToRefs(administrationUserStore);

const openTransportForm = () => {
  transport.value = {};
  activeTransportForm.value = true;
};

const openDeliveryUserForm = () => {
  deliveryUser.value = {};
  activeDeliveryUserForm.value = true;
};
</script>
