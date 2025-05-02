<template>
  <v-card
    :title="getFormTitle()"
    class="mt-10 mb-5"
    v-if="activeSecondForm"
  >
    <v-card-text>
      <p class="mb-2">
        Servizio: {{ order.services.map(service => service.name).join(', ') }}<br>
        Note Operatore: {{ order.operator_note }}
      </p>
      <v-form ref="form" @submit.prevent="submitForm">
        <v-textarea
          v-if="['Anomaly', 'Cancelled'].includes(order.status)"
          v-model="order.motivation"
          label="Motivazione"
          rows="3"
          :rules="['Anomaly', 'Cancelled'].includes(order.status) ? validation.requiredRules : []"
        />
        <v-file-input
          accept="image/*"
          label="Foto"
          :rules="validation.requiredRules"
        />
        <FormButtons
          :loading="loading"
          @cancel="activeSecondForm = false"
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
import { useOrderStore } from '@/stores/order';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const { element: order, activeSecondForm } = storeToRefs(orderStore);

const getFormTitle = () => {
  if (order.value.status === 'Completed')
    return `Completa Ordine ${order.value.id}`;
  else if (order.value.status === 'Cancelled')
    return `Annulla Ordine ${order.value.id}`;
  else if (order.value.status === 'Anomaly')
    return `Segnala Anomalia Ordine ${order.value.id}`;
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  orderStore.updateElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      order.value = {};
      activeSecondForm.value = false;
    }
  });
}
</script>
