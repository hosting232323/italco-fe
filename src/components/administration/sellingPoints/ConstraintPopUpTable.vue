<template>
  <v-data-table
    :items="geographicZone.constraints"
    :headers="[
      { title: 'Giorno', value: 'day_of_week' },
      { title: 'Ordini massimi', value: 'max_orders' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.day_of_week="{ item }">
      {{ days.getDayByValue(item.day_of_week) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-delete"
        variant="text"
        :loading="deleteLoading[item.id]"
        @click="deleteItem(item)"
        :color="theme.current.value.primaryColor"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const theme = useTheme();
const router = useRouter();
const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);
const deleteLoading = reactive({});

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  geographicZoneStore.deleteEntity(item, 'constraint', router, function() {
    geographicZoneStore.initList(router);
    geographicZone.value.constraints = geographicZone.value.constraints.filter(
      constraint => constraint.id !== item.id
    );
    deleteLoading[item.id] = false;
  }, true);
};
</script>
