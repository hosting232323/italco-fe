<template>
  <v-data-table
    :items="geographicZones"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Nome', value: 'name' },
      { title: 'CAP aggiunti e rimossi', value: 'codes' },
      { title: 'Vincoli', value: 'constraints' },
      { title: 'Azioni', key: 'actions' }
    ]"
  >
    <template v-slot:item.codes="{ item }">
      <div v-if="item.codes.length > 0">
        <div v-for="(code, index) in item.codes" :key="index">
          <b>{{ code.code }}</b>: {{ code.type ? 'Aggiunto' : 'Rimosso' }}
        </div>
      </div>
      <div v-else>
        Nessun CAP speciale
      </div>
    </template>
    <template v-slot:item.constraints="{ item }">
      <div v-if="item.constraints.length > 0">
        <div v-for="(constraint, index) in item.constraints" :key="index">
          <b>{{ constraint.day_of_week }}</b>: {{ constraint.max_orders }}
        </div>
      </div>
      <div v-else>
        Nessun vincolo
      </div>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            icon="mdi-delete"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            icon="mdi-store-clock"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="emits('openPopUp', item, 'constraint')"
          />
        </v-col>
        <v-col cols="4">
          <v-btn
            icon="mdi-map-marker-outline"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="emits('openPopUp', item, 'geographicCode')"
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
