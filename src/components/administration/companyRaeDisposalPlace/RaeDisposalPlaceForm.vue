<template>
  <v-card
    v-if="activeForm"
    :title="place.id ? `Modifica Luogo di Smaltimento ${place.id}` : 'Crea Luogo di Smaltimento'"
    class="mt-4 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field
              v-model="place.name"
              label="Nome"
              :rules="validation.requiredRules"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col
            cols="12"
            md="6"
            class="pr-md-2"
          >
            <v-text-field
              v-model="place.rae_registration"
              label="Estremi iscrizione Albo Gestori Ambientali"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="place.rae_grouping_place"
              label="Luogo di raggruppamento RAEE"
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
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

const { companyId } = defineProps({
  companyId: {
    type: Number,
    required: true
  }
});

const form = ref(null);
const loading = ref(false);

const store = useCompanyRaeDisposalPlaceStore();
const { activeForm, element: place } = storeToRefs(store);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (place.value.id)
    store.updateElement(companyId, callback);
  else
    store.createElement(companyId, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    place.value = {};
    store.initList(companyId);
    activeForm.value = false;
  }
};
</script>
