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
    <h1 id="delivery-form">
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
  <v-dialog
    v-model="deliveryUserInfoForm"
    max-width="1500"
  >
    <DeliveryUserInfoForm />
  </v-dialog>
</template>

<script setup>
import TransportForm from '@/components/administration/transports/TransportForm';
import TransportTable from '@/components/administration/transports/TransportTable';
import DeliveryUserInfoForm from '@/components/administration/transports/DeliveryUserInfoForm';
import DeliveryUserInfoTable from '@/components/administration/transports/DeliveryUserInfoTable';

import { storeToRefs } from 'pinia';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const transportStore = useTransportStore();
const administrationUserStore = useAdministrationUserStore();
const { activeForm: activeTransportForm, element: transport } = storeToRefs(transportStore);
const { activeForm: deliveryUserInfoForm } = storeToRefs(administrationUserStore);

const openTransportForm = () => {
  transport.value = {};
  activeTransportForm.value = true;
};
</script>
