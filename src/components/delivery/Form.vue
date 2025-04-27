<template>
  <v-card
    :title="getFormTitle()"
    class="mt-10 mb-5"
    v-if="activeForm"
  >
    <v-card-text>
      <p class="mb-2">
        Servizio: {{ order.service.name }}<br>
        Note Operatore: {{ order.operator_note }}
      </p>
      <v-form @submit.prevent="submitForm">
        <v-textarea
          v-if="['Anomaly', 'Cancelled'].includes(order.status)"
          v-model="order.motivation"
          label="Motivazione"
          rows="3"
        />
        <v-file-input
          accept="image/*"
          label="Foto"
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
import { useOrderStore } from '@/stores/order';

const loading = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const { element: order, activeForm } = storeToRefs(orderStore);

const getFormTitle = () => {
  if (order.value.status === 'Completed')
    return `Completa Ordine ${order.value.id}`;
  else if (order.value.status === 'Cancelled')
    return `Annulla Ordine ${order.value.id}`;
  else if (order.value.status === 'Anomaly')
    return `Segnala Anomalia Ordine ${order.value.id}`;
};

const submitForm = () => {
  loading.value = true;
  orderStore.updateElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      order.value = {};
      activeForm.value = false;
    }
  });
}
</script>
