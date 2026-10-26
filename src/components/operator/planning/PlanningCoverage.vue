<template>
  <div>
    <p class="text-medium-emphasis my-3">
      Copertura geografica settimanale: per ogni giorno della settimana uno o più blocchi, ciascuno con
      i CAP coperti, il veicolo assegnato e la fascia oraria. Dalla mappa puoi anche decidere quali punti di
      ritiro accettano il precarico.
    </p>

    <v-alert v-if="loadError" type="error" variant="tonal" class="my-4">
      <div class="d-flex align-center justify-space-between ga-4">
        <span>{{ loadError }}</span>
        <v-btn variant="text" @click="store.initList()">Riprova</v-btn>
      </div>
    </v-alert>
    <v-skeleton-loader
      v-else-if="!ready"
      type="card, table"
      :color="theme.current.value.secondaryColor"
    />
    <template v-else-if="ready">
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

      <PageHeader
        title="Blocchi di copertura"
        level="h2"
        class="mt-8"
      >
        <v-btn
          prepend-icon="mdi-plus"
          text="Crea nuovo blocco"
          variant="text"
          :color="theme.current.value.primaryColor"
          @click="openEntryForm"
        />
      </PageHeader>
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
import PageHeader from '@/components/PageHeader';
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
const { ready, entries, element, entryForm, loadError } = storeToRefs(store);

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
