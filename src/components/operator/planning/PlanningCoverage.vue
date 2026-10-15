<template>
  <div>
    <p class="text-medium-emphasis my-3">
      Copertura geografica settimanale: per ogni giorno della settimana uno o più blocchi, ciascuno con
      i CAP coperti, il veicolo assegnato e la fascia oraria. Dalla mappa puoi anche decidere quali punti di
      ritiro accettano il precarico.
    </p>

    <v-skeleton-loader
      v-if="!ready"
      type="card, table"
      :color="theme.current.value.secondaryColor"
    />
    <template v-else>
      <v-btn-toggle
        v-model="viewMode"
        class="mb-4"
        color="primary"
        mandatory
        density="comfortable"
      >
        <v-btn value="calendar">
          <v-icon start>
            mdi-calendar
          </v-icon>
          Calendario
        </v-btn>
        <v-btn value="map">
          <v-icon start>
            mdi-map
          </v-icon>
          Mappa
        </v-btn>
      </v-btn-toggle>

      <CoverageCalendar
        v-if="viewMode === 'calendar'"
        :entries="entries"
      />
      <CoverageMap
        v-else
        :entries="entries"
        :preload-areas="preloadPoint?.preload_areas || []"
        :drawing-preload-area="drawingPreloadArea"
        @collection-point-click="openPreloadCard"
        @preload-polygon-drawn="draftPolygon = $event"
      >
        <template #overlay>
          <CollectionPointPreloadCard
            :point="preloadPoint"
            :is-admin="isAdmin"
            :drawing="drawingPreloadArea"
            :draft-polygon="draftPolygon"
            @update:drawing="setDrawing"
            @close="closePreloadCard"
          />
        </template>
      </CoverageMap>

      <h2 class="mt-8">
        Blocchi di copertura
        <v-btn
          icon="mdi-plus"
          style="float: right;"
          variant="text"
          @click="openEntryForm"
        />
      </h2><hr>
      <CoverageEntryTable />
    </template>
  </div>
  <v-dialog
    v-model="entryForm"
    max-width="1500"
  >
    <CoverageEntryForm />
  </v-dialog>
</template>

<script setup>
import CoverageCalendar from '@/components/operator/deliveryCoverage/CoverageCalendar';
import CoverageEntryForm from '@/components/operator/deliveryCoverage/CoverageEntryForm';
import CoverageEntryTable from '@/components/operator/deliveryCoverage/CoverageEntryTable';
import CoverageMap from '@/components/operator/deliveryCoverage/CoverageMap';
import CollectionPointPreloadCard from '@/components/operator/deliveryCoverage/CollectionPointPreloadCard';

import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const theme = useTheme();
const viewMode = ref('calendar');

const store = useDeliveryCoverageStore();
const { ready, entries, element, entryForm } = storeToRefs(store);

const userStore = useUserStore();
const { effectiveRole } = storeToRefs(userStore);
const isAdmin = computed(() => effectiveRole.value == 'Admin');

const collectionPointStore = useCollectionPointStore();

store.initList();

// La mappa legge la lista punti di ritiro: se un'altra pagina l'ha filtrata per un
// cliente, qui servono tutti i punti della company.
if (collectionPointStore.customerId) {
  collectionPointStore.customerId = null;
  collectionPointStore.ready = false;
}

const openEntryForm = () => {
  element.value = { caps: [] };
  entryForm.value = true;
};

// La card legge il punto dallo store, cosi' dopo un salvataggio mostra i dati aggiornati.
const preloadPointId = ref(null);
const preloadPoint = computed(
  () => collectionPointStore.list.find((point) => point.id === preloadPointId.value) || null
);
const drawingPreloadArea = ref(false);
const draftPolygon = ref(null);

const openPreloadCard = (point) => {
  preloadPointId.value = point.id;
  setDrawing(false);
};

const closePreloadCard = () => {
  preloadPointId.value = null;
  setDrawing(false);
};

const setDrawing = (value) => {
  drawingPreloadArea.value = value;
  draftPolygon.value = null;
};
</script>
