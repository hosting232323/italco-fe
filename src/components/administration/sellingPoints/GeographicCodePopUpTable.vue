<template>
  <SelectionTable
    :items="geographicZone.codes"
    :headers="[
      { title: 'CAP', value: 'code', sortable: false },
      { title: 'Tipo', value: 'type', sortable: false }
    ]"
  >
    <template #[`item.type`]="{ item }">
      {{ item.type ? 'Aggiunto' : 'Rimosso' }}
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
import { storeToRefs } from 'pinia';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const deleteLoading = reactive({});

const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  geographicZoneStore.deleteEntity(item, 'code', function() {
    geographicZoneStore.initList();
    geographicZone.value.codes = geographicZone.value.codes.filter(
      code => code.id !== item.id
    );
    deleteLoading[item.id] = false;
  }, true);
};
</script>
