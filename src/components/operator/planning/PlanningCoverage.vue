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
        @collection-point-click="openPreloadDialog"
      />

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
  <v-dialog
    v-model="preloadDialog"
    max-width="520"
  >
    <v-card
      v-if="preloadPoint"
      :title="preloadPoint.name"
      :subtitle="preloadPoint.address"
    >
      <v-card-text>
        <v-switch
          v-model="preloadValue"
          :disabled="!isAdmin || preloadLoading"
          :loading="preloadLoading"
          label="Precarico"
          color="primary"
          hide-details
          @update:model-value="savePreload"
        />
        <p class="text-medium-emphasis mt-3 mb-0">
          Con il precarico attivo, nelle aree che lo accettano i prodotti di questo punto si ritirano il giorno
          prima della consegna.
        </p>
        <v-alert
          v-if="!isAdmin"
          type="info"
          variant="tonal"
          density="compact"
          class="mt-3"
        >
          Il precarico può essere modificato solo da un amministratore.
        </v-alert>
        <v-alert
          v-if="preloadError"
          type="error"
          variant="tonal"
          density="compact"
          class="mt-3"
        >
          {{ preloadError }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click="preloadDialog = false">
          Chiudi
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import CoverageCalendar from '@/components/operator/deliveryCoverage/CoverageCalendar';
import CoverageEntryForm from '@/components/operator/deliveryCoverage/CoverageEntryForm';
import CoverageEntryTable from '@/components/operator/deliveryCoverage/CoverageEntryTable';
import CoverageMap from '@/components/operator/deliveryCoverage/CoverageMap';

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

const preloadDialog = ref(false);
const preloadPoint = ref(null);
const preloadValue = ref(false);
const preloadLoading = ref(false);
const preloadError = ref('');

const openPreloadDialog = (point) => {
  preloadPoint.value = point;
  preloadValue.value = !!point.preloaded;
  preloadError.value = '';
  preloadDialog.value = true;
};

const savePreload = (value) => {
  preloadLoading.value = true;
  preloadError.value = '';
  collectionPointStore.element = { ...preloadPoint.value, preloaded: !!value };
  collectionPointStore.updateElement((data) => {
    preloadLoading.value = false;
    if (data.status == 'ok') {
      preloadPoint.value = { ...preloadPoint.value, preloaded: !!value };
      collectionPointStore.initList();
      return;
    }
    // Il backend rifiuta lo spegnimento con ordini precaricati in sospeso: lo
    // switch torna sul valore salvato e il motivo resta leggibile.
    preloadValue.value = !value;
    preloadError.value = data.message || 'Impossibile salvare il precarico';
  });
};
</script>
