<template>
  <SelectionTable
    :ready="ready"
    :items="raeProductGroups"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'Codice CER', value: 'cer_code', sortable: false },
      { title: 'Codice Raggruppamento', value: 'group_code', sortable: false }
    ]"
    fill
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
import storesUtils from '@/utils/stores';
import { useRaeProductGroupStore } from '@/stores/raeProductGroup';

const deleteLoading = reactive({});

const raeProductGroupStore = useRaeProductGroupStore();
const { element: raeProductGroup, activeForm, ready } = storeToRefs(raeProductGroupStore);
const raeProductGroups = storesUtils.getStoreList(raeProductGroupStore);

const openForm = (item) => {
  raeProductGroup.value = item;
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  raeProductGroupStore.deleteElement(item, function() {
    raeProductGroupStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
