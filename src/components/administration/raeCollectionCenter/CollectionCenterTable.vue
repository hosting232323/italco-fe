<template>
  <SelectionTable
    :ready="ready"
    :items="raeCarriers"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Nome', value: 'company_name', sortable: false },
      { title: 'Indirizzo', value: 'address', sortable: false },
      { title: 'Codice Fiscale', value: 'fiscal_code', sortable: false },
      { title: 'Partita IVA', value: 'vat_number', sortable: false },
      { title: 'Codice di autorizzazione', value: 'authorization_code', sortable: false },
      { title: 'Data di autorizzazione', value: 'authorization_date', sortable: false }
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
import { useRaeCollectionCenterStore } from '@/stores/raeCollectionCenter';

const deleteLoading = reactive({});

const raeCollectionCenterStore = useRaeCollectionCenterStore();
const raeCarriers = storesUtils.getStoreList(raeCollectionCenterStore);
const { element: raeCollectionCenter, activeForm, ready } = storeToRefs(raeCollectionCenterStore);

const openForm = (item) => {
  raeCollectionCenter.value = item;
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  raeCollectionCenterStore.deleteElement(item, function() {
    raeCollectionCenterStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
