<template>
  <v-card
    v-if="coverageForm"
    :title="element.id ? `Modifica copertura fissa ID ${element.id}` : 'Nuova copertura fissa'"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-autocomplete
          v-model="element.user_id"
          label="Corriere"
          :items="deliveryUsers"
          item-title="nickname"
          item-value="id"
          :disabled="!!element.id"
          :rules="validation.requiredRules"
        />
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="element.start_date"
              type="date"
              label="Data di inizio"
              :class="isMobile ? '' : 'mr-2'"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="element.end_date"
              type="date"
              label="Data di fine"
              :class="isMobile ? '' : 'ml-2'"
              :rules="[...validation.requiredRules, endNotBeforeStart]"
            />
          </v-col>
        </v-row>
        <FormButtons
          :loading="loading"
          @cancel="coverageForm = false"
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
import validation from '@/utils/validation';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const form = ref(null);
const loading = ref(false);
const isMobile = mobile.setupMobileUtils();

const store = useDeliveryCoverageStore();
const { element, deliveryUsers, coverageForm } = storeToRefs(store);

const endNotBeforeStart = (value) => {
  if (!value || !element.value.start_date) return true;
  return value >= element.value.start_date || 'La data di fine non può precedere quella di inizio';
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  const done = (data) => {
    loading.value = false;
    if (data.status == 'ok') {
      store.initList();
      element.value = {};
      coverageForm.value = false;
    } else {
      alert(data.message);
    }
  };

  if (element.value.id) store.updateCoverage(done);
  else store.createCoverage(done);
};
</script>
