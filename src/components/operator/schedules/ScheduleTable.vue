<template>
  <SelectionTable
    :ready="ready"
    :items="schedules"
    :headers="[
      { title: 'ID', value: 'id', sortable: false },
      { title: 'Data', value: 'date', sortable: false },
      { title: 'Utenti Delivery', value: 'users', sortable: false },
      { title: 'Veicolo', key: 'transport.name', sortable: false },
      { title: 'Pianificazione', key: 'schedule_items', sortable: false }
    ]"
    fill
  >
    <template #[`item.schedule_items`]="{ item }">
      <div
        v-for="scheduleItem in item.schedule_items.sort((a, b) => a.index - b.index)"
        :key="scheduleItem.index"
      >
        <template v-if="scheduleItem.operation_type == 'Activity'">
          Attività: <b>{{ scheduleItem.title }}</b>
          <span v-if="scheduleItem.duration_minutes"> ({{ activityUtils.formatDuration(scheduleItem.duration_minutes) }})</span>
          <span v-if="scheduleItem.address"> Indirizzo: <b>{{ scheduleItem.address }}</b></span>
        </template>
        <template v-else>
          {{ scheduleItem.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro' }}
          ID: <b>{{ scheduleItem.operation_type == 'Order' ? scheduleItem.order_id : scheduleItem.collection_point_id }}</b>
          <v-icon
            v-if="scheduleItem.has_preload"
            icon="mdi-package-up"
            size="x-small"
            title="Include un precarico da ritirare per il giorno dopo"
          />
          Indirizzo: <b>{{ scheduleItem.address }}</b>
        </template>
      </div>
    </template>
    <template #[`item.users`]="{ item }">
      <div v-if="item.users && item.users.length">
        <span
          v-for="(user, index) in item.users"
          :key="index"
        >
          {{ user.nickname }}<span v-if="index < item.users.length - 1">, </span>
        </span>
      </div>
      <span v-else>-</span>
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-pencil"
        text="Modifica"
        variant="text"
        :loading="!!editLoading[item.id]"
        @click="editElement(item)"
      />
      <v-btn
        prepend-icon="mdi-file-export"
        text="Esporta"
        variant="text"
        :loading="!!exportLoading[item.id]"
        @click="exportElement(item)"
      />
      <v-btn
        prepend-icon="mdi-delete"
        text="Elimina"
        variant="text"
        :loading="!!deleteLoading[item.id]"
        @click="deleteItem(item)"
      />
    </template>
  </SelectionTable>
</template>

<script setup>
import SelectionTable from '@/components/SelectionTable';

import { reactive } from 'vue';
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import activityUtils from '@/utils/activity';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useRaeProductStore } from '@/stores/raeProduct';

const editLoading = reactive({});
const deleteLoading = reactive({});
const exportLoading = reactive({});
const emits = defineEmits(['open-dialog']);

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const raeProductStore = useRaeProductStore();
const { ready, element: schedule } = storeToRefs(scheduleStore);
const schedules = storesUtils.getStoreList(scheduleStore);

// Il borderò si ricarica dal server: la riga della lista può essere vecchia
// e salvarla toglierebbe le modifiche fatte nel frattempo da altri.
const editElement = (item) => {
  editLoading[item.id] = true;

  http.makeRequest('schedule/filter', 'POST', {
    body: { filters: [{ model: 'Schedule', field: 'id', value: item.id }] }
  }, function (data) {
    editLoading[item.id] = false;
    if (data.status == 'ok' && data.schedules && data.schedules.length > 0) {
      schedule.value = data.schedules[0];
      emits('open-dialog');
    } else
      alert(data.message || 'Borderò non trovato, ricarica la pagina');
  });
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;

  scheduleStore.deleteElement(item, function() {
    orderStore.initList();
    scheduleStore.initList();
    raeProductStore.initList();
    deleteLoading[item.id] = false;
  });
};

const exportElement = async (item) => {
  exportLoading[item.id] = true;

  http.downloadRequest(
    `export/schedule/${item.id}`,
    'GET',
    {},
    () => exportLoading[item.id] = false
  );
};
</script>
