<template>
  <v-card
    :title="addressee.id ? `Modifica Anagrafica ${addressee.id}` : 'Crea Anagrafica'"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-text-field
          v-model="addressee.name"
          label="Nominativo"
        />
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="addressee.address"
              label="Indirizzo"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="addressee.city"
              label="Città"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="addressee.cap"
              label="Cap"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="addressee.province"
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
import { useaddresseesStore } from '@/stores/addressees';

const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const addresseesStore = useaddresseesStore();
const { element: addressee, activeForm } = storeToRefs(addresseesStore);

const submitForm = () => {
  loading.value = true;
  if (addressee.value.id)
    addresseesStore.updateElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        addressee.value = {};
        activeForm.value = false;
      }
    });
  else
    addresseesStore.createElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        addressee.value = {};
        addresseesStore.initList(router);
        activeForm.value = false;
      }
    });
};
</script>
