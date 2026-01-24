<template>
  <v-card
    v-if="activeForm"
    :title="raeProduct.id ? `Modifica Prodotto Rae ${raeProduct.id}` : 'Crea Prodotto Rae'"
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
              v-model="raeProduct.name"
              label="Nome"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col
            cols="12"
            md="6"
          >
            <v-text-field
              v-model="raeProduct.code"
              :class="isMobile ? '' : 'ml-2'"
              label="Codice"
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
import { useRaeProductStore } from '@/stores/raeProduct';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const raeProductStore = useRaeProductStore();
const { element: raeProduct, activeForm } = storeToRefs(raeProductStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (raeProduct.value.id)
    raeProductStore.updateElement(router, callback);
  else
    raeProductStore.createElement(router, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    raeProduct.value = {};
    raeProductStore.initList(router);
    activeForm.value = false;
  }
};
</script>
