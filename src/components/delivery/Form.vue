<template>
  <p class="mb-2">
    Servizio: {{ order.services.map(service => service.name).join(', ') }}<br>
    Note Operatore: {{ order.operator_note }}
  </p>
  <v-form ref="form" @submit.prevent="submitForm">
    <v-textarea
      v-if="['Anomaly', 'Cancelled', 'Delay'].includes(order.status)"
      v-model="order.motivation"
      label="Motivazione"
      rows="3"
      :rules="['Anomaly', 'Cancelled', 'Delay'].includes(order.status) ? validation.requiredRules : []"
    />
    <v-file-input multiple
      accept="image/*"
      label="Foto"
      v-model="order.photos"
      :rules="['Completed', 'Anomaly'].includes(order.status) ? validation.requiredRules : []"
    />
    <FormButtons
      :loading="loading"
      @cancel="activeForm = false"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const { element: order, activeForm } = storeToRefs(orderStore);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  orderStore.updateElementWithFormData(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      order.value = {};
      activeForm.value = false;
    }
  });
}
</script>
