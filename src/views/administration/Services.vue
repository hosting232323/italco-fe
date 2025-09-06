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
        <ServiceForm />
        <ServiceTable :activator-props="activatorProps" />
      </v-container>
    </template>
    <template #default>
      <ServicePopUp />
    </template>
  </v-dialog>
</template>

<script setup>
import ServiceForm from '@/components/administration/services/Form';
import ServicePopUp from '@/components/administration/services/PopUp';
import ServiceTable from '@/components/administration/services/Table';

import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

const serviceStore = useServiceStore();
const { activeForm, element: service } = storeToRefs(serviceStore);

const openForm = () => {
  service.value = {};
  activeForm.value = true;
};
</script>
