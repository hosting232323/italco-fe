<template>
  <v-data-table
    :items="managedCoverage.days"
    :headers="[
      { title: 'Giorno', value: 'day_of_week', sortable: false },
      { title: 'Dalle', value: 'start_time', sortable: false },
      { title: 'Alle', value: 'end_time', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.day_of_week`]="{ item }">
      {{ days.getDayByValue(item.day_of_week) }}
    </template>
    <template #[`item.start_time`]="{ item }">
      <v-text-field
        v-model="edited[item.id].start_time"
        type="time"
        density="compact"
        hide-details
        variant="plain"
      />
    </template>
    <template #[`item.end_time`]="{ item }">
      <v-text-field
        v-model="edited[item.id].end_time"
        type="time"
        density="compact"
        hide-details
        variant="plain"
        :error="edited[item.id].end_time <= edited[item.id].start_time"
      />
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        v-if="isDirty(item)"
        icon="mdi-content-save"
        variant="text"
        :color="theme.current.value.primaryColor"
        :loading="rowLoading[item.id]"
        @click="saveRow(item)"
      />
      <v-btn
        icon="mdi-delete"
        variant="text"
        :color="theme.current.value.primaryColor"
        :loading="rowLoading[item.id]"
        @click="deleteRow(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive, watch } from 'vue';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const theme = useTheme();
const rowLoading = reactive({});
const edited = reactive({});

const store = useDeliveryCoverageStore();
const { managedCoverage } = storeToRefs(store);

// Copia locale modificabile degli orari, riallineata a ogni refresh dei dati.
watch(
  () => managedCoverage.value?.days,
  (days) => {
    (days || []).forEach((day) => {
      edited[day.id] = {
        start_time: day.start_time.slice(0, 5),
        end_time: day.end_time.slice(0, 5)
      };
    });
  },
  { immediate: true, deep: true }
);

const isDirty = (item) =>
  edited[item.id] &&
  (edited[item.id].start_time !== item.start_time.slice(0, 5) ||
    edited[item.id].end_time !== item.end_time.slice(0, 5));

const saveRow = (item) => {
  if (edited[item.id].end_time <= edited[item.id].start_time) {
    alert('L\'orario di fine deve essere successivo a quello di inizio');
    return;
  }
  rowLoading[item.id] = true;
  store.updateCoverageDay(item.id, { ...edited[item.id] }, (data) => {
    rowLoading[item.id] = false;
    if (data.status == 'ok') store.initList();
    else alert(data.message);
  });
};

const deleteRow = (item) => {
  rowLoading[item.id] = true;
  store.deleteCoverageDay(item.id, (data) => {
    rowLoading[item.id] = false;
    if (data.status == 'ok') store.initList();
    else alert(data.message);
  });
};
</script>
