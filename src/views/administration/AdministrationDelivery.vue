<template>
  <v-container>
    <h1>
      Crea un utente Customer
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openCreateDeliveryUserForm"
      />
    </h1><hr class="mt-2">
    <UserForm :role="'Delivery'"/>
    <UserTable :role="'Delivery'" />
    <h1>
      Veicoli
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <TransportForm />
    <TransportTable />
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
const { activeForm, element: transport } = storeToRefs(transportStore);
const { activeForm: administrationUserForm, element: administrationUser } = storeToRefs(administrationUserStore);

const openForm = () => {
  transport.value = {};
  activeForm.value = true;
};

const openCreateDeliveryUserForm = () => {
  administrationUser.value = {};
  administrationUserForm.value = true;
};
</script>
