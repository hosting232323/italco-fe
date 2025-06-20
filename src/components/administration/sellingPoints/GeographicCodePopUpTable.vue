<template>
  <v-data-table
    :items="geographicZone.codes"
    :headers="[
      { title: 'CAP', value: 'code' },
      { title: 'Tipo', value: 'type' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.type="{ item }">
      {{ item.type ? 'Aggiunto' : 'Rimosso' }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-delete"
        variant="text"
        @click="deleteItem(item)"
        :color="theme.current.value.primaryColor"
      />
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const theme = useTheme();
const router = useRouter();
const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone } = storeToRefs(geographicZoneStore);

const deleteItem = (item) => {
  geographicZoneStore.deleteEntity(item, 'code', router, function() {
    geographicZoneStore.initList(router);
    geographicZone.value.codes = geographicZone.value.codes.filter(
      code => code.id !== item.id
    );
  }, true);
};
</script>
