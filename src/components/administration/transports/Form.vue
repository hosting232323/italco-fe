<template>
  <v-card
    :title="transport.id ? `Modifica Veicolo ${transport.id}` : 'Crea Veicolo'"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitForm">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="transport.name"
              label="Nome"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="transport.plate"
              label="Targa"
              :rules="validation.requiredRules"
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
import { useTransportStore } from '@/stores/transport';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const transportStore = useTransportStore();
const { element: transport, activeForm } = storeToRefs(transportStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (transport.value.id)
    transportStore.updateElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        transport.value = {};
        activeForm.value = false;
      }
    });
  else
    transportStore.createElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        transport.value = {};
        transportStore.initList(router);
        activeForm.value = false;
      }
    });
};
</script>
