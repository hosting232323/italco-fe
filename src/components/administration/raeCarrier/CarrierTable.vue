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
import { useRaeCarrierStore } from '@/stores/raeCarrier';

const deleteLoading = reactive({});

const raeCarrierStore = useRaeCarrierStore();
const { element: raeCarrier, activeForm, ready } = storeToRefs(raeCarrierStore);

const raeCarriers = storesUtils.getStoreList(raeCarrierStore);

const openForm = (item) => {
  raeCarrier.value = item;
  activeForm.value = true;

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  raeCarrierStore.deleteElement(item, function() {
    raeCarrierStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
