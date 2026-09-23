<template>
  <v-container>
    <PageHeader title="Veicoli">
      <v-btn
        prepend-icon="mdi-plus"
        text="Crea nuovo veicolo"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openTransportForm"
      />
    </PageHeader>
    <TransportTable />
    <PageHeader title="Utenti Delivery" />
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
import PageHeader from '@/components/PageHeader';
import TransportForm from '@/components/administration/transports/TransportForm';
import TransportTable from '@/components/administration/transports/TransportTable';
import DeliveryUserInfoTable from '@/components/administration/transports/DeliveryUserInfoTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useTransportStore } from '@/stores/transport';

const theme = useTheme();
const transportStore = useTransportStore();
const { activeForm: activeTransportForm, element: transport } = storeToRefs(transportStore);

const openTransportForm = () => {
  transport.value = {};
  activeTransportForm.value = true;
};
</script>
