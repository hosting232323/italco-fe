<template>
  <v-card
    :title="product.id ? `Modifica Prodotto ${product.id}` : 'Crea Prodotto'"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitForm">
        <v-row no-gutters>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'mr-2'"
              v-model="product.name"
              label="Nome"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-text-field
              :class="isMobile ? '' : 'ml-2'"
              v-model="product.description"
              label="Descrizione"
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
import { useProductStore } from '@/stores/product';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const productStore = useProductStore();
const { element: product, activeForm } = storeToRefs(productStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (product.value.id)
    productStore.updateElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        product.value = {};
        activeForm.value = false;
      }
    });
  else
    productStore.createElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        product.value = {};
        productStore.initList(router);
        activeForm.value = false;
      }
    });
};
</script>
