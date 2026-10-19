<template>
  <SelectionTable
    :ready="ready"
    :items="geographicZones"
    :headers="[
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'CAP aggiunti e rimossi', value: 'codes', sortable: false },
      { title: 'Vincoli', value: 'constraints', sortable: false }
    ]"
  >
    <template #[`item.codes`]="{ item }">
      <div v-if="item.codes.length > 0">
        <div
          v-for="(code, index) in item.codes"
          :key="index"
        >
          <b>{{ code.code }}</b>: {{ code.type ? 'Aggiunto' : 'Rimosso' }}
        </div>
      </div>
      <div v-else>
        Nessun CAP speciale
      </div>
    </template>
    <template #[`item.constraints`]="{ item }">
      <div v-if="item.constraints.length > 0">
        <div
          v-for="(constraint, index) in item.constraints"
          :key="index"
        >
          <b>{{ days.getDayByValue(constraint.day_of_week) }}</b>:
          {{ constraint.max_orders }}
        </div>
      </div>
      <div v-else>
        Nessun vincolo
      </div>
    </template>
    <template #actions="{ item }">
      <v-btn
        prepend-icon="mdi-map-marker-outline"
        text="CAP"
        variant="text"
        @click="emits('openPopUp', item, 'geographicCode')"
      />
      <v-btn
        prepend-icon="mdi-store-clock"
        text="Vincoli"
        variant="text"
        @click="emits('openPopUp', item, 'constraint')"
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
import days from '@/utils/days';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const deleteLoading = reactive({});
const emits = defineEmits(['openPopUp']);

const geographicZoneStore = useGeographicZoneStore();
const { ready } = storeToRefs(geographicZoneStore);
const geographicZones = storesUtils.getStoreList(geographicZoneStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  geographicZoneStore.deleteElement(item, function() {
    geographicZoneStore.initList();
    deleteLoading[item.id] = false;
  });
};
</script>
