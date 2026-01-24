<template>
  <v-data-table
    :items="geographicZone.codes"
    :headers="[
      { title: 'CAP', value: 'code', sortable: false },
      { title: 'Tipo', value: 'type', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
    ]"
  >
    <template #[`item.type`]="{ item }">
      {{ item.type ? 'Aggiunto' : 'Rimosso' }}
    </template>
    <template #[`item.actions`]="{ item }">
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
import { reactive } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const theme = useTheme();
const router = useRouter();
const deleteLoading = reactive({});

const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  geographicZoneStore.deleteEntity(item, 'code', router, function() {
    geographicZoneStore.initList(router);
    geographicZone.value.codes = geographicZone.value.codes.filter(
      code => code.id !== item.id
    );
    deleteLoading[item.id] = false;
  }, true);
};
</script>
