<template>
  <v-container class="table-page">
    <PageHeader title="Punti di Ritiro">
      <v-btn
        prepend-icon="mdi-plus"
        text="Crea nuovo punto di ritiro"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="openForm"
      />
    </PageHeader>
    <PickupPointTable />
  </v-container>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <PickupPointForm />
  </v-dialog>
</template>

<script setup>
import PageHeader from '@/components/PageHeader';
import PickupPointForm from '@/components/operator/pickupPoints/PickupPointForm';
import PickupPointTable from '@/components/operator/pickupPoints/PickupPointTable';

import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { usePickupPointStore } from '@/stores/pickupPoint';

const theme = useTheme();
const pickupPointStore = usePickupPointStore();
const { activeForm, element: pickupPoint } = storeToRefs(pickupPointStore);

const openForm = () => {
  pickupPoint.value = {};
  activeForm.value = true;
};
</script>
