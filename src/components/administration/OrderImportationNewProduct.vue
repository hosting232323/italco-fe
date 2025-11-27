<template>
  <v-form
    ref="form"
    @submit.prevent="submitForm"
  >
    <v-text-field
      label="Prodotto"
      v-model="product"
      :rules="validation.requiredRules"
    />
    <FormButtons
      :loading="false"
      @cancel="emits('closeForm')"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import validation from '@/utils/validation';

const { order } = defineProps({
  order: {
    type: Object,
    required: true
  }
});

const form = ref(null);
const product = ref('');
const emits = defineEmits(['closeForm']);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  order.products[product.value] = [];
  emits('closeForm');
};
</script>
