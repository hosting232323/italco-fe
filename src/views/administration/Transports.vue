<template>
  <v-container>
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
import TransportForm from '@/components/administration/transports/Form';
import TransportTable from '@/components/administration/transports/Table';

import { storeToRefs } from 'pinia';
import { useTransportStore } from '@/stores/transport';

const transportStore = useTransportStore();
const { activeForm, element: transport } = storeToRefs(transportStore);

const openForm = () => {
  transport.value = {};
  activeForm.value = true;
};
</script>
