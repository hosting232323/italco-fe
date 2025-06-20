<template>
  <v-card
    title="Crea Aree Geografica"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitForm">
        <v-text-field
          v-model="geographicZone.name"
          label="Nome"
          :rules="validation.requiredRules"
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
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useGeographicZoneStore } from '@/stores/geographicZone';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const geographicZoneStore = useGeographicZoneStore();
const { element: geographicZone, activeForm } = storeToRefs(geographicZoneStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  geographicZoneStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      geographicZoneStore.initList(router);
      geographicZone.value = {};
      activeForm.value = false;
    }
  });
};
</script>
