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
      Utenti Delivery
    </h1><hr>
    <DeliveryUserInfoForm />
    <DeliveryUserInfoTable />
  </v-container>
</template>

<script setup>
import TransportForm from '@/components/administration/transports/TransportForm';
import TransportTable from '@/components/administration/transports/TransportTable';
import DeliveryUserInfoForm from '@/components/administration/transports/DeliveryUserInfoForm';
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
