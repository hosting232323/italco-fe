<template>
  <v-card :title="`ID Ordine: ${order.id}`">
    <v-card-text>
      <v-form ref="form" @submit.prevent="submitForm">
        <v-select
          label="Stato"
          v-model="status"
          :rules="validation.requiredRules"
          :items="STATUS_MAP[actualStatus].map(status => ({
            value: status,
            title: orderUtils.LABELS[status]
          }))"
        />
        <v-textarea
          v-if="['Anomaly', 'Cancelled', 'Delay'].includes(status)"
          v-model="order.motivation"
          label="Motivazione"
          rows="3"
          :rules="validation.requiredRules"
        />
        <v-file-input multiple
          v-if="['Completed', 'Anomaly', 'Cancelled', 'Delay'].includes(status)"
          accept="image/*"
          label="Foto"
          v-model="order.photos"
          :rules="['Completed', 'Anomaly'].includes(status) ? validation.arrayRules : []"
        />
        <FormButtons
          :loading="loading"
          @cancel="emits('cancel')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';

const form = ref(null);
const status = ref(null);
const loading = ref(false);
const router = useRouter();
const orderStore = useOrderStore();
const emits = defineEmits(['cancel']);
const { element: order } = storeToRefs(orderStore);

const STATUS_MAP = {
  'In Progress': ['On Board', 'Anomaly', 'Cancelled'],
  'On Board': ['Completed', 'Anomaly', 'Cancelled', 'Delay'],
  'Delay': ['Completed', 'Anomaly', 'Cancelled']
};
const actualStatus = order.value.status;

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  order.value.user_id = order.value.user.id;
  order.value.status = status.value;
  orderStore.updateElementWithFormData(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      order.value = {};
      emits('cancel');
    }
  });
}
</script>
