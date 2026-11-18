<template>
  <v-card
    v-if="activeForm"
    :title="pickupPoint.id ? `Modifica Punto di Ritiro ${pickupPoint.id}` : 'Crea Punto di Ritiro'"
    :subtitle="pickupPoint.id && pickupPoint.customers?.length
      ? 'Indirizzo e CAP si aggiornano anche nei punti di ritiro dei clienti collegati'
      : undefined"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-text-field
          v-model="pickupPoint.name"
          label="Nome"
          :rules="validation.requiredRules"
        />
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <AddressAutocomplete
              v-model="pickupPoint.address"
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
              v-model="pickupPoint.cap"
              :class="isMobile ? '' : 'ml-2'"
              label="Cap"
              :rules="validation.capRules"
            />
          </v-col>
        </v-row>
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

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { usePickupPointStore } from '@/stores/pickupPoint';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();
const pickupPointStore = usePickupPointStore();
const { element: pickupPoint, activeForm } = storeToRefs(pickupPointStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (pickupPoint.value.id)
    pickupPointStore.updateElement(callback);
  else
    pickupPointStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    pickupPoint.value = {};
    pickupPointStore.initList();
    activeForm.value = false;
  }
};

const handleAddressComponents = (components) => {
  pickupPoint.value.address = components.address;
  pickupPoint.value.cap = components.cap;
};

// Senza posizione (testo ritoccato a mano) il backend geocodifica l'indirizzo.
const handleCoordinates = (coordinates) => {
  pickupPoint.value.lat = coordinates?.lat ?? null;
  pickupPoint.value.lon = coordinates?.lng ?? null;
};
</script>
