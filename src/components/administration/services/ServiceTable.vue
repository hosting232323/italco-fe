<template>
  <SelectionTable
    :ready="ready"
    :items="services"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Tipo', value: 'type', sortable: false },
      { title: 'Descrizione', value: 'description', sortable: false },
      { title: 'Durata', value: 'duration', sortable: false },
      { title: 'Professionale', value: 'professional', sortable: false },
      { title: 'Max Giornaieri', value: 'max_services', sortable: false }
    ]"
    fill
  >
    <template #[`item.type`]="{ item }">
      {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
    </template>
    <template #[`item.duration`]="{ item }">
      {{ formatTime(item.duration) }}
    </template>
    <template #[`item.professional`]="{ item }">
      {{ item.professional ? 'Si' : 'No' }}
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        @click="openForm(item)"
      />
      <v-btn
        prepend-icon="mdi-label"
        text="Utenti associati"
        variant="text"
        v-bind="activatorProps"
        @click="service = item"
      />
      <v-btn
        prepend-icon="mdi-delete"
        text="Elimina"
        variant="text"
        :loading="deleteLoading[item.id]"
        @click="deleteItem(item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { reactive } from 'vue';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import storesUtils from '@/utils/stores';
import { useServiceStore } from '@/stores/service';

const { activatorProps } = defineProps({
  activatorProps: {
    type: Object,
    required: true
  }
});

const deleteLoading = reactive({});

const serviceStore = useServiceStore();
const { element: service, activeForm, ready } = storeToRefs(serviceStore);
const services = storesUtils.getStoreList(serviceStore);

const openForm = (item) => {
  service.value = item;
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  serviceStore.deleteElement(item, function() {
    serviceStore.initList();
    deleteLoading[item.id] = false;
  });
};

const formatTime = (value) => {
  if (!value) return '';
  return `${value} min`;
};
</script>
