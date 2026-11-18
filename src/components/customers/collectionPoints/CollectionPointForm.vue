<template>
  <v-card
    v-if="activeForm"
    :title="collectionPoint.id ? `Modifica Punto di Ritiro ${collectionPoint.id}` : 'Crea Punto di Ritiro'"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-text-field
          v-model="collectionPoint.name"
          label="Nome"
          :rules="validation.requiredRules"
        />
        <v-autocomplete
          v-if="canPickExisting"
          v-model="collectionPoint.pickup_point_id"
          :items="pickupPoints"
          :item-title="pickupPointLabel"
          item-value="id"
          label="Punto di ritiro esistente"
          hint="Scegline uno già presente nel catalogo, oppure lascia vuoto e inserisci un indirizzo per crearne uno personale"
          persistent-hint
          clearable
          class="mb-4"
          @update:model-value="pickExisting"
        />
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <AddressAutocomplete
              v-model="collectionPoint.address"
              :api-key="GOOGLE_API_KEY"
              :formatted="true"
              :custom-class="isMobile ? '' : 'mr-2'"
              label="Indirizzo"
              :rules="validation.requiredRules"
              @address-components="handleAddressComponents"
              @coordinates="handleCoordinates"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="collectionPoint.cap"
              :class="isMobile ? '' : 'ml-2'"
              label="Cap"
              :rules="validation.capRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="6">
            <v-text-field 
              v-model="collectionPoint.opening_time" 
              label="Orario di apertura"
              type="time"
              :rules="validation.requiredRules" 
              dense
              :class="isMobile ? '' : 'mr-2'"
            />
          </v-col>
          <v-col cols="6">
            <v-text-field 
              v-model="collectionPoint.closing_time" 
              label="Orario di chiusura"
              type="time"
              :rules="validation.futureTime(collectionPoint.opening_time)" 
              dense
              :class="isMobile ? '' : 'ml-2'"
            />
          </v-col>
        </v-row>
        <v-switch
          v-if="isAdmin"
          v-model="collectionPoint.preloaded"
          label="Precarico"
          hint="Nelle aree che accettano precarichi i prodotti di questo punto si ritirano il giorno prima della consegna, se quel giorno il veicolo passa già dal punto"
          persistent-hint
          color="primary"
        />
        <FormButtons
          :loading="loading"
          @cancel="activeForm = false"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import { AddressAutocomplete } from 'generic-module';
import { GOOGLE_API_KEY } from '@/utils/googleMaps';

import { computed, ref, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useUserStore } from '@/stores/user';
import { usePickupPointStore } from '@/stores/pickupPoint';
import storesUtils from '@/utils/stores';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();
const collectionPointStore = useCollectionPointStore();
const { element: collectionPoint, activeForm } = storeToRefs(collectionPointStore);
// Il precarico cambia la pianificazione dei veicoli: lo imposta solo l'admin.
const { effectiveRole } = storeToRefs(useUserStore());
const isAdmin = computed(() => effectiveRole.value == 'Admin');

// Il catalogo dei punti di ritiro lo leggono admin e operatori; il cliente crea solo punti propri.
const canPickExisting = computed(() => ['Admin', 'Operator'].includes(effectiveRole.value));
const pickupPointStore = usePickupPointStore();
const pickupPoints = canPickExisting.value ? storesUtils.getStoreList(pickupPointStore) : ref([]);

const pickupPointLabel = (item) => `${item.name} · ${item.address} (${item.cap})`;

// Scegliere una voce ne copia l'indirizzo; il nome resta quello del cliente.
// Ritoccare l'indirizzo a mano la scollega: il punto diventa personale.
const pickExisting = (id) => {
  const pickupPoint = pickupPoints.value.find(item => item.id == id);
  if (!pickupPoint) {
    collectionPoint.value.pickup_point_id = null;
    return;
  }
  collectionPoint.value.address = pickupPoint.address;
  collectionPoint.value.cap = pickupPoint.cap;
  collectionPoint.value.lat = pickupPoint.lat;
  collectionPoint.value.lon = pickupPoint.lon;
  if (!collectionPoint.value.name) collectionPoint.value.name = pickupPoint.name;
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (collectionPoint.value.id)
    collectionPointStore.updateElement(callback);
  else
    collectionPointStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    collectionPoint.value = {};
    collectionPointStore.initList();
    activeForm.value = false;
  }
};

watch(() => [collectionPoint.value.address, collectionPoint.value.cap], ([address, cap]) => {
  const linked = pickupPoints.value.find(item => item.id == collectionPoint.value.pickup_point_id);
  if (linked && (linked.address != address || linked.cap != cap))
    collectionPoint.value.pickup_point_id = null;
});

const handleAddressComponents = (components) => {
  collectionPoint.value.address = components.address;
  collectionPoint.value.cap = components.cap;
};

// Senza posizione (testo ritoccato a mano) il backend geocodifica l'indirizzo.
const handleCoordinates = (coordinates) => {
  collectionPoint.value.lat = coordinates?.lat ?? null;
  collectionPoint.value.lon = coordinates?.lng ?? null;
};
</script>
