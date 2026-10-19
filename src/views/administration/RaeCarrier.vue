<template>
  <v-container class="table-page">
    <PageHeader title="Gestione Trasportatori">
      <v-btn
        prepend-icon="mdi-plus"
        text="Crea nuovo trasportatore"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm"
      />
    </PageHeader>
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
import PageHeader from '@/components/PageHeader';
import CarrierForm from '@/components/administration/raeCarrier/CarrierForm';
import CarrierTable from '@/components/administration/raeCarrier/CarrierTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRaeCarrierStore } from '@/stores/raeCarrier';

const theme = useTheme();
const raeCarrierStore = useRaeCarrierStore();
const { activeForm, element: raeCarrier } = storeToRefs(raeCarrierStore);

const openForm = () => {
  raeCarrier.value = {};
  activeForm.value = true;
};
</script>
