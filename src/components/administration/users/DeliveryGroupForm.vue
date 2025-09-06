<template>
  <v-card
    v-if="activeForm"
    title="Crea Gruppo Delivery"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-text-field
          v-model="deliveryGroup.name"
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
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: deliveryGroup, activeForm } = storeToRefs(deliveryGroupStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  deliveryGroupStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      deliveryGroupStore.initList(router);
      deliveryGroup.value = {};
      activeForm.value = false;
    }
  });
};
</script>
