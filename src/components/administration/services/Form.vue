<template>
  <v-card
    :title="service.id ? `Modifica Servizio ${service.id}` : 'Crea Servizio'"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitForm">
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-text-field
                :class="isMobile ? '' : 'mr-2'"
                v-model="service.name"
                label="Nome"
                :rules="validation.requiredRules"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="service.type"
                label="Tipo"
                :items="orderUtils.TYPES"
                :rules="validation.requiredRules"
              />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col cols="12" md="6">
              <v-text-field
                :class="isMobile ? '' : 'mr-2'"
                v-model="service.description"
                label="Descrizione"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="service.max_services"
                label="Max Servizi Giornalieri (opzionale)"
                type="number"
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
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useServiceStore } from '@/stores/service';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const serviceStore = useServiceStore();
const isMobile = mobile.setupMobileUtils();
const { element: service, activeForm } = storeToRefs(serviceStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (service.value.id)
    serviceStore.updateElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        service.value = {};
        activeForm.value = false;
      }
    });
  else
    serviceStore.createElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        serviceStore.initList(router);
        service.value = {};
        activeForm.value = false;
      }
    });
};
</script>
