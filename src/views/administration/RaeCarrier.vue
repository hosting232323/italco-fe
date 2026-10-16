<template>
  <v-container>
    <h1>
      Gestione Trasportatori
      <v-btn
        icon="mdi-plus"
        style="float: right;"
        variant="text"
        @click="openForm"
      />
    </h1><hr>
    <CarrierTable />
  </v-container>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <CarrierForm />
  </v-dialog>
</template>

<script setup>
import CarrierForm from '@/components/administration/raeCarrier/CarrierForm';
import CarrierTable from '@/components/administration/raeCarrier/CarrierTable';

import { storeToRefs } from 'pinia';
import { useRaeCarrierStore } from '@/stores/raeCarrier';

const raeCarrierStore = useRaeCarrierStore();
const { activeForm, element: raeCarrier } = storeToRefs(raeCarrierStore);

const openForm = () => {
  raeCarrier.value = {};
  activeForm.value = true;
};
</script>
