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
    <PageHeader
      id="delivery-form"
      title="Utenti Delivery"
    />
    <DeliveryUserInfoTable />
  </v-container>
  <v-dialog
    v-model="activeTransportForm"
    max-width="1500"
  >
    <TransportForm />
  </v-dialog>
  <v-dialog
    v-model="deliveryUserInfoForm"
    max-width="1500"
  >
    <DeliveryUserInfoForm />
  </v-dialog>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import TransportForm from '@/components/administration/transports/TransportForm';
import TransportTable from '@/components/administration/transports/TransportTable';
import DeliveryUserInfoForm from '@/components/administration/transports/DeliveryUserInfoForm';
import DeliveryUserInfoTable from '@/components/administration/transports/DeliveryUserInfoTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const theme = useTheme();
const transportStore = useTransportStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: activeTransportForm, element: transport } = storeToRefs(transportStore);
const { activeForm: deliveryUserInfoForm } = storeToRefs(administrationUserStore);

const openTransportForm = () => {
  transport.value = {};
  activeTransportForm.value = true;
};
</script>
