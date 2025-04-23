<template>
  <v-data-table
    :items="services"
    :headers="[
      { title: 'ID', value: 'id' },
      { title: 'Nome', value: 'name' },
      { title: 'Descrizione', value: 'description' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        variant="text"
        @click="openForm(item)"
      />
      <v-btn
        icon="mdi-label"
        variant="text"
        @click="openPopUp(item)"
        v-bind="activatorProps"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

const serviceStore = useServiceStore();
const props = defineProps(['activatorProps']);
const { list: services, element: service, activeForm } = storeToRefs(serviceStore);

const openForm = (item) => {
  service.value = item;
  activeForm.value = true;
};

const openPopUp = (item) => {
  service.value = item;
};
</script>
