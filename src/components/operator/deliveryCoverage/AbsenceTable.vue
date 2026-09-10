<template>
  <v-data-table
    :items="rows"
    :headers="[
      { title: 'Corriere', value: 'nickname', sortable: false },
      { title: 'Periodo', value: 'period', sortable: false },
      { title: 'Nota', value: 'note', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.period`]="{ item }">
      {{ formatDate(item.start_date) }} → {{ formatDate(item.end_date) }}
    </template>
    <template #[`item.note`]="{ item }">
      {{ item.note || '—' }}
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
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const theme = useTheme();
const deleteLoading = reactive({});

const store = useDeliveryCoverageStore();
const { absences, deliveryUsers, element, absenceForm } = storeToRefs(store);

const rows = computed(() =>
  absences.value.map((absence) => ({
    ...absence,
    nickname: deliveryUsers.value.find((user) => user.id === absence.user_id)?.nickname || `ID ${absence.user_id}`
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
    end_date: item.end_date,
    note: item.note
  };
  absenceForm.value = true;
};

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  store.deleteAbsence(item, () => {
    store.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
