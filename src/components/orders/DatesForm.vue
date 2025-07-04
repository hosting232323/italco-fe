<template>
  <v-form ref="form" @submit.prevent="submitForm">
    Seleziona le date per l'ordine:
    <v-row no-gutters class="mt-2">
      <v-col cols="12" md="6">
        <DateField 
          v-model="order.dpc"
          label="Data Prevista dal Cliente"
          :classStyle="isMobile ? '' : 'ml-2 mr-2'"
          :allowedDates="allowedDpcDates"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col cols="12" md="6">
        <DateField 
          v-model="order.drc"
          label="Data Richiesta dal Cliente"
          :classStyle="isMobile ? '' : 'ml-2'"
          :rules="validation.requiredRules"
        />
      </v-col>
    </v-row>
    <FormButtons
      :loading="loading"
      @cancel="order.dates_form = false"
    />
  </v-form>
</template>

<script setup>
import DateField from '@/components/DateField';
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import http from '@/utils/http';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const allowedDpcDates = ref([]);
const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const { element: order, activeForm } = storeToRefs(orderStore);

http.getRequest('check-constraints', {
  cap: order.value.cap
}, (data) => {
  if (data.status === 'ok')
    allowedDpcDates.value = data.dates;
}, 'GET', router);

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  const callback = (data) => {
    loading.value = false;
    if (data.status === 'ok') {
      order.value = {};
      orderStore.initList(router);
      activeForm.value = false;
    }
  };

  if (order.value.id)
    orderStore.updateElement(router, callback);
  else
    orderStore.createElement(router, callback);
};
</script>
