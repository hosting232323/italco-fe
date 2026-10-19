<template>
  <SelectionTable
    :items="geographicZone.constraints"
    :headers="[
      { title: 'Giorno', value: 'day_of_week', sortable: false },
      { title: 'Ordini massimi', value: 'max_orders', sortable: false }
    ]"
  >
    <template #[`item.day_of_week`]="{ item }">
      {{ days.getDayByValue(item.day_of_week) }}
    </template>
    <template #actions="{ item }">
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
import days from '@/utils/days';
import { storeToRefs } from 'pinia';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const deleteLoading = reactive({});

const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  geographicZoneStore.deleteEntity(item, 'constraint', function() {
    geographicZoneStore.initList();
    geographicZone.value.constraints = geographicZone.value.constraints.filter(
      constraint => constraint.id !== item.id
    );
    deleteLoading[item.id] = false;
  }, true);
};
</script>
