<template>
  <v-card
    v-if="activeForm"
    :title="transport.id ? `Modifica Veicolo ${transport.id}` : 'Crea Veicolo'"
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
              v-model="transport.name"
              :class="isMobile ? '' : 'mr-2'"
              label="Nome"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="transport.plate"
              :class="isMobile ? '' : 'ml-2'"
              label="Targa"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-autocomplete
          v-model="transport.cap"
          label="Località"
          :items="addressUtils.getCapItems()"
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

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import addressUtils from '@/utils/address';
import validation from '@/utils/validation';
import { useTransportStore } from '@/stores/transport';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();

const transportStore = useTransportStore();
const { element: transport, activeForm } = storeToRefs(transportStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (transport.value.id)
    transportStore.updateElement(callback);
  else
    transportStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    transport.value = {};
    transportStore.initList();
    activeForm.value = false;
  }
};
</script>
