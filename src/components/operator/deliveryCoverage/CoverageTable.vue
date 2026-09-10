<template>
  <v-data-table
    :items="rows"
    :headers="[
      { title: 'Corriere', value: 'nickname', sortable: false },
      { title: 'Periodo', value: 'period', sortable: false },
      { title: 'Giorni coperti', value: 'days', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.period`]="{ item }">
      {{ formatDate(item.start_date) }} → {{ formatDate(item.end_date) }}
    </template>
    <template #[`item.days`]="{ item }">
      <template v-if="item.days.length">
        <v-chip
          v-for="day in item.days"
          :key="day.id"
          size="small"
          class="mr-1 mb-1"
        >
          {{ days.getDayByValue(day.day_of_week) }}
          {{ day.start_time.slice(0, 5) }}-{{ day.end_time.slice(0, 5) }}
        </v-chip>
      </template>
      <span
        v-else
        class="text-medium-emphasis"
      >Nessun giorno impostato</span>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-btn
        icon="mdi-calendar-clock"
        variant="text"
        :color="theme.current.value.primaryColor"
        @click="emits('manageDays', item)"
      />
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
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const theme = useTheme();
const deleteLoading = reactive({});
const emits = defineEmits(['manageDays']);

const store = useDeliveryCoverageStore();
const { coverages, deliveryUsers, element, coverageForm } = storeToRefs(store);

const rows = computed(() =>
  coverages.value.map((coverage) => ({
    ...coverage,
    nickname: deliveryUsers.value.find((user) => user.id === coverage.user_id)?.nickname || `ID ${coverage.user_id}`
  }))
);

const formatDate = (value) => {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

const editItem = (item) => {
  element.value = {
    id: item.id,
    user_id: item.user_id,
    start_date: item.start_date,
    end_date: item.end_date
  };
  coverageForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  store.deleteCoverage(item, () => {
    store.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
