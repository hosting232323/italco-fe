<template>
  <SelectionTable
    :ready="ready"
    :items="logs"
    :headers="[
      { title: 'Data', value: 'logs.created_at', sortable: false },
      { title: 'Metodo', value: 'logs.method', sortable: false },
      { title: 'Endpoint', value: 'logs.endpoint', sortable: false },
      { title: 'User', value: 'user.nickname', sortable: false }
    ]"
    item-value="logs.id"
    fill
  >
    <template #[`item.logs.created_at`]="{ item }">
      {{ days.formatDateTime(item.logs.created_at) }}
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-magnify-plus-outline"
        text="Dettaglio"
        variant="text"
        @click="openForm(item.logs)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import days from '@/utils/days';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { useLogStore } from '@/stores/log';

const logStore = useLogStore();
const { ready, activePopUp, selectedLog } = storeToRefs(logStore);
const logs = storesUtils.getStoreList(logStore);

const openForm = (item) => {
  selectedLog.value = item.id;
  activePopUp.value = true;
};
</script>
