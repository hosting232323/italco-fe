<template>
  <v-card
    v-if="activeForm"
    title="Crea Aree Geografica"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-autocomplete
          v-model="geographicZone.name"
          :items="addressUtils.getProvinces()"
          label="Provincia"
          :rules="validation.requiredRules"
          clearable
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
import addressUtils from '@/utils/address';
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
