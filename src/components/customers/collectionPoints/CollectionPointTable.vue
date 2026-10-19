<template>
  <SelectionTable
    :ready="ready"
    :items="collectionPoints"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Indirizzo', value: 'address', sortable: false },
      { title: 'Cap', value: 'cap', sortable: false },
      { title: 'Orari', value: 'opening_closing', sortable: false }
    ]"
    :fill="fill"
  >
    <template #[`item.opening_closing`]="{ item }">
      {{ formatTime(item.opening_time) }} - {{ formatTime(item.closing_time) }}
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
import { useCollectionPointStore } from '@/stores/collectionPoint';

const { fill } = defineProps({
  fill: {
    type: Boolean,
    default: false
  }
});

const deleteLoading = reactive({});

const collectionPointStore = useCollectionPointStore();
const { element: collectionPoint, activeForm, ready } = storeToRefs(collectionPointStore);
const collectionPoints = storesUtils.getStoreList(collectionPointStore);

const openForm = (item) => {
  collectionPoint.value = item;
  activeForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  collectionPointStore.deleteElement(item, function() {
    collectionPointStore.initList();
    deleteLoading[item.id] = false;
  });
};

const formatTime = (value) => {
  if (!value) return '-';
  const [h, m] = value.split(':');
  return `${h}:${m}`;
};
</script>
