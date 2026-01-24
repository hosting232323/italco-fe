<template>
  <v-skeleton-loader
    v-if="!ready"
    type="table"
    :color="theme.current.value.secondaryColor"
    class="mt-5"
  />
  <v-data-table
    v-else
    :items="geographicZones"
    :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
    :headers="[
      { title: 'Nome', value: 'name', sortable: false },
      { title: 'CAP aggiunti e rimossi', value: 'codes', sortable: false },
      { title: 'Vincoli', value: 'constraints', sortable: false },
      { title: 'Azioni', key: 'actions', sortable: false }
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
    <template #[`item.actions`]="{ item }">
      <v-row no-gutters>
        <v-col cols="4">
          <v-btn
            icon="mdi-map-marker-outline"
            variant="text"
            :color="theme.current.value.primaryColor"
            @click="emits('openPopUp', item, 'geographicCode')"
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
            icon="mdi-delete"
            variant="text"
            :loading="deleteLoading[item.id]"
            :color="theme.current.value.primaryColor"
            @click="deleteItem(item)"
          />
        </v-col>
      </v-row>
    </template>
  </v-data-table>
</template>

<script setup>
import { reactive } from 'vue';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const theme = useTheme();
const router = useRouter();
const deleteLoading = reactive({});
const emits = defineEmits(['openPopUp']);

const geographicZoneStore = useGeographicZoneStore();
const { ready } = storeToRefs(geographicZoneStore);
const geographicZones = storesUtils.getStoreList(geographicZoneStore, router);

const deleteItem = (item) => {
  deleteLoading[item.id] = true;
  geographicZoneStore.deleteElement(item, router, function() {
    geographicZoneStore.initList(router);
    deleteLoading[item.id] = false;
  });
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
