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
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <GooglePlacesAutocomplete
              v-model="collectionPoint.address"
              :custom-class="isMobile ? '' : 'mr-2'"
              label="Indirizzo"
              :rules="validation.requiredRules"
              @address-components="handleAddressComponents"
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

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete.vue';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const collectionPointStore = useCollectionPointStore();
const { element: collectionPoint, activeForm } = storeToRefs(collectionPointStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (collectionPoint.value.id)
    collectionPointStore.updateElement(router, callback);
  else
    collectionPointStore.createElement(router, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    collectionPoint.value = {};
    collectionPointStore.initList(router);
    activeForm.value = false;
  }
};

const handleAddressComponents = (components) => {
  collectionPoint.value.address = components.address;
  collectionPoint.value.cap = components.cap;
};
</script>
