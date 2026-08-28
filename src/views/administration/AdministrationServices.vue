<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-container>
        <h1>
          Gestione Servizi
          <v-btn
            icon="mdi-plus"
            style="float: right;"
            variant="text"
            @click="openForm"
          />
        </h1><hr>
        <ServiceTable :activator-props="activatorProps" />
      </v-container>
    </template>
    <template #default>
      <ServicePopUp />
    </template>
  </v-dialog>
  <v-dialog
    v-model="activeForm"
    max-width="1500"
  >
    <ServiceForm />
  </v-dialog>
</template>

<script setup>
import ServiceForm from '@/components/administration/services/ServiceForm';
import ServicePopUp from '@/components/administration/services/ServicePopUp';
import ServiceTable from '@/components/administration/services/ServiceTable';

import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

const serviceStore = useServiceStore();
const { activeForm, element: service } = storeToRefs(serviceStore);

const openForm = () => {
  service.value = {};
  activeForm.value = true;
};
</script>
