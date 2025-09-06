<template>
  <v-card
    v-if="activeForm"
    title="Crea GDO"
    class="mt-10 mb-5"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-text-field
          v-model="customerGroup.name"
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
import { useCustomerGroupStore } from '@/stores/customerGroup';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const customerGroupStore = useCustomerGroupStore();
const { element: customerGroup, activeForm } = storeToRefs(customerGroupStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  customerGroupStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      customerGroupStore.initList(router);
      customerGroup.value = {};
      activeForm.value = false;
    }
  });
};
</script>
