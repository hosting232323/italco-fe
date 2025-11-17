<template>
  <v-card
    v-if="activeForm"
    :title="service.id ? `Modifica Servizio ${service.id}` : 'Crea Servizio'"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="service.name"
              :class="isMobile ? '' : 'mr-2'"
              label="Nome"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-select
              v-model="service.type"
              label="Tipo"
              :items="orderUtils.TYPES"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="service.description"
              :class="isMobile ? '' : 'mr-2'"
              label="Descrizione"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="service.duration"
              label="Durata (minuti)"
              :class="isMobile ? '' : 'mr-2 ml-2'"
              type="number"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="service.max_services"
              label="Max Servizi Giornalieri (opzionale)"
              :class="isMobile ? '' : 'ml-2'"
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
    serviceStore.updateElement(router, callback);
  else
    serviceStore.createElement(router, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    service.value = {};
    serviceStore.initList(router);
    activeForm.value = false;
  }
};
</script>
