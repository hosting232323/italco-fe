<template>
  <v-card
    v-if="activeForm"
    :title="company.id ? `Modifica Company ${company.id}` : 'Crea Company'"
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
              v-model="company.name"
              label="Nome"
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
import { useCompanyStore } from '@/stores/company';

const form = ref(null);
const loading = ref(false);

const companyStore = useCompanyStore();
const { activeForm, element: company } = storeToRefs(companyStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (company.value.id)
    companyStore.updateElement(callback);
  else
    companyStore.createElement(callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    company.value = {};
    companyStore.initList();
    activeForm.value = false;
  }
};
</script>
