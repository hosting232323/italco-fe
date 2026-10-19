<template>
  <SelectionTable
    :ready="ready"
    :items="places"
    :headers="[
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Luogo di raggruppamento RAEE', value: 'rae_grouping_place', sortable: false }
    ]"
  >
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
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const deleteLoading = reactive({});

const store = useCompanyRaeDisposalPlaceStore();
const { list: places, element: place, activeForm, ready } = storeToRefs(store);

const openForm = (item) => {
  place.value = { ...item };
  activeForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  store.deleteElement(item, () => {
    store.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
