<template>
  <SelectionTable
    :ready="ready"
    :items="transports"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Targa', value: 'plate', sortable: false },
      { title: 'Località', value: 'cap', sortable: false }
    ]"
  >
    <template #[`item.cap`]="{ item }">
      {{ addressUtils.getCityByCap(item.cap) }}
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        @click="openForm(item)"
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
import storesUtils from '@/utils/stores';
import addressUtils from '@/utils/address';
import { useTransportStore } from '@/stores/transport';

const deleteLoading = reactive({});

const transportStore = useTransportStore();
const { element: transport, activeForm, ready } = storeToRefs(transportStore);
const transports = storesUtils.getStoreList(transportStore);

const openForm = (item) => {
  transport.value = item;
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  transportStore.deleteElement(item, function() {
    transportStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
