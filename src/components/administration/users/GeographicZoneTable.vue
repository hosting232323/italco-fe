<template>
  <v-data-table
    :items="geographicZones"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Nome', value: 'name' },
      { title: 'Provincia', value: 'province' },
      { title: 'Vincoli', value: 'constraint' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.constraint="{ item }">

      <div v-if="item.constraint">
        <div v-for="(constraint, index) in item.constraint" :key="index">
          {{ constraint.day_of_week }}: {{ constraint.max_orders }} ordini max
        </div>
      </div>
      <div v-else>
        Nessun vincolo
      </div>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="6">
          <v-btn
            icon="mdi-delete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
        <v-col cols="6">
          <v-btn
            icon="mdi-account-group"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="emits('openPopUp', item, 'geographicZone')"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { useTheme } from 'vuetify';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const theme = useTheme();
const router = useRouter();
const emits = defineEmits(['openPopUp']);
const geographicZoneStore = useGeographicZoneStore();
const geographicZones = storesUtils.getStoreList(geographicZoneStore, router);

const deleteItem = (item) => {
  geographicZoneStore.deleteElement(item, router, function() {
    geographicZoneStore.initList(router);
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
