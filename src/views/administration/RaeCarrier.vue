<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
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
        <CarrierForm />
        <CarrierTable :activator-props="activatorProps" />
      </v-container>
    </template>
  </v-dialog>
</template>

<script setup>
import CarrierForm from '@/components/administration/rae/CarrierForm';
import CarrierTable from '@/components/administration/rae/CarrierTable';

import { storeToRefs } from 'pinia';
import { useRaeCarrierStore } from '@/stores/raeCarrier';

const raeCarrierStore = useRaeCarrierStore();
const { activeForm, element: raeCarrier } = storeToRefs(raeCarrierStore);

const openForm = () => {
  raeCarrier.value = {};
  activeForm.value = true;
};
</script>
