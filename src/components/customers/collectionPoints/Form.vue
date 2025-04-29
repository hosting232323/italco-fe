<template>
  <v-card
    title="Crea Punto di Ritiro"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="collectionPoint.name"
          label="Nome"
        />
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="collectionPoint.address"
              label="Indirizzo"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="collectionPoint.city"
              label="Città"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="collectionPoint.cap"
              label="Cap"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="collectionPoint.province"
              label="Provincia"
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
import { useCollectionPointStore } from '@/stores/collectionPoints';

const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const collectionPointStore = useCollectionPointStore();
const { element: collectionPoint, activeForm } = storeToRefs(collectionPointStore);

const submitForm = () => {
  loading.value = true;
  collectionPointStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      collectionPoint.value = {};
      activeForm.value = false;
    }
  });
};
</script>
