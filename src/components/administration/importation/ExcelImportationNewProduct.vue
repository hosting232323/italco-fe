<template>
  <v-form
    ref="form"
    class="mt-3"
    @submit.prevent="submitForm"
  >
    <v-text-field
      v-model="productName"
      label="Prodotto"
      :rules="validation.requiredRules"
    />
    <v-select
      v-model="collectionPoint"
      label="Punto di ritiro"
      :items="collectionPoints.filter(collectionPoint => collectionPoint.user_id == customerId)"
      item-title="name"
      :rules="validation.requiredRules"
      return-object
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
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const { order } = defineProps({
  order: {
    type: Object,
    required: true
  },
  customerId: {
    type: Number,
    required: true
  }
});

const form = ref(null);
const router = useRouter();
const productName = ref('');
const collectionPoint = ref(null);
const emits = defineEmits(['closeForm', 'addProduct']);
const collectionPointStore = useCollectionPointStore();
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  emits('addProduct', order, productName.value, collectionPoint.value);
  emits('closeForm');
};
</script>
