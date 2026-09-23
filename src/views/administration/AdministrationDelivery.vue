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
    <TransportTable />
    <h1>
      Utenti Delivery
    </h1><hr>
    <DeliveryUserInfoTable />
  </v-container>
  <v-dialog
    v-model="activeTransportForm"
    max-width="1500"
  >
    <TransportForm />
  </v-dialog>
</template>

<script setup>
import TransportForm from '@/components/administration/transports/TransportForm';
import TransportTable from '@/components/administration/transports/TransportTable';
import DeliveryUserInfoTable from '@/components/administration/transports/DeliveryUserInfoTable';

import { storeToRefs } from 'pinia';
import { useTransportStore } from '@/stores/transport';

const transportStore = useTransportStore();
const { activeForm: activeTransportForm, element: transport } = storeToRefs(transportStore);

const openTransportForm = () => {
  transport.value = {};
  activeTransportForm.value = true;
};
</script>
