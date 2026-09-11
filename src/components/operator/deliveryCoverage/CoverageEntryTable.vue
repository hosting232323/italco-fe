<template>
  <v-data-table
    :items="rows"
    :headers="[
      { title: 'Giorno', value: 'day_of_week', sortable: false },
      { title: 'Veicolo', value: 'transport_name', sortable: false },
      { title: 'Fascia oraria', value: 'slot', sortable: false },
      { title: 'CAP', value: 'caps', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.day_of_week`]="{ item }">
      {{ days.getDayByValue(item.day_of_week) }}
    </template>
    <template #[`item.slot`]="{ item }">
      {{ coverage.formatSlot(item) }}
    </template>
    <template #[`item.caps`]="{ item }">
      <v-chip
        v-for="cap in item.caps"
        :key="cap"
        size="small"
        class="mr-1 mb-1"
      >
        {{ cap }}
      </v-chip>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon="mdi-pencil"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="editItem(item)"
      />
      <v-btn
        icon="mdi-delete"
        variant="text"
        :loading="deleteLoading[item.id]"
        :color="theme.current.value.primaryColor"
        @click="deleteItem(item)"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { computed, reactive } from 'vue';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import coverage from '@/utils/coverage';
import storesUtils from '@/utils/stores';
import { useTransportStore } from '@/stores/transport';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const theme = useTheme();
const deleteLoading = reactive({});

const store = useDeliveryCoverageStore();
const { entries, element, entryForm } = storeToRefs(store);

const transportStore = useTransportStore();
const transports = storesUtils.getStoreList(transportStore);

const rows = computed(() =>
  entries.value.map((entry) => ({
    ...entry,
    transport_name:
      transports.value.find((transport) => transport.id === entry.transport_id)?.name || `ID ${entry.transport_id}`
  }))
);

const editItem = (item) => {
  element.value = {
    id: item.id,
    day_of_week: item.day_of_week,
    transport_id: item.transport_id,
    start_time: item.start_time.slice(0, 5),
    end_time: item.end_time.slice(0, 5),
    caps: [...item.caps]
  };
  entryForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  store.deleteEntry(item, () => {
    store.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
