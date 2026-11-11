<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-container class="table-page">
        <PageHeader title="Gestione Servizi">
          <v-btn
            prepend-icon="mdi-plus"
            text="Crea nuovo servizio"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="openForm"
          />
        </PageHeader>
        <ServiceFilters />
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
import PageHeader from '@/components/PageHeader';
import ServiceFilters from '@/components/administration/services/ServiceFilters';
import ServiceForm from '@/components/administration/services/ServiceForm';
import ServicePopUp from '@/components/administration/services/ServicePopUp';
import ServiceTable from '@/components/administration/services/ServiceTable';

import { onUnmounted } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

const theme = useTheme();
const serviceStore = useServiceStore();
const { activeForm, element: service, filters, ready } = storeToRefs(serviceStore);

// La lista servizi è condivisa con ordini e pianificazione: all'uscita si toglie il filtro.
onUnmounted(() => {
  filters.value = {};
  ready.value = false;
});

const openForm = () => {
  service.value = {};
  activeForm.value = true;
};
</script>
