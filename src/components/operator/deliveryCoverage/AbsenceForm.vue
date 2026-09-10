<template>
  <v-card
    v-if="absenceForm"
    :title="element.id ? `Modifica assenza ID ${element.id}` : 'Nuova assenza'"
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
              label="Dal"
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
              label="Al"
              :class="isMobile ? '' : 'ml-2'"
              :rules="[...validation.requiredRules, endNotBeforeStart]"
            />
          </v-col>
        </v-row>
        <v-text-field
          v-model="element.note"
          label="Nota (opzionale)"
        />
        <FormButtons
          :loading="loading"
          @cancel="absenceForm = false"
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
const { element, deliveryUsers, absenceForm } = storeToRefs(store);

// Un solo giorno di assenza è il caso più comune: la data di fine può
// coincidere con quella di inizio, deve solo non precederla.
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
      absenceForm.value = false;
    } else {
      alert(data.message);
    }
  };

  if (element.value.id) store.updateAbsence(done);
  else store.createAbsence(done);
};
</script>
