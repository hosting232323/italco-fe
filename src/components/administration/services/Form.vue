<template>
  <v-card
    :title="service.id ? `Modifica Servizio ${service.id}` : 'Crea Servizio'"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form @submit.prevent="submitForm">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="service.name"
              label="Nome"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="service.description"
              label="Descrizione"
            />
          </v-col>
        </v-row>
        <v-btn type="submit" text="Invia" block />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useServiceStore } from '@/stores/service';

const serviceStore = useServiceStore();
const isMobile = mobile.setupMobileUtils();
const { element: service, activeForm } = storeToRefs(serviceStore);

const submitForm = () => {
  if (service.value.id)
    serviceStore.updateElement(function (data) {
      if (data.status == 'ok') {
        service.value = {};
        activeForm.value = false;
      }
    });
  else
    serviceStore.createElement(function (data) {
      if (data.status == 'ok') {
        serviceStore.initList();
        service.value = {};
        activeForm.value = false;
      }
    });
};
</script>
