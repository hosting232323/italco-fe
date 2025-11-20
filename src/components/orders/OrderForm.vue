<template>
  <v-form
    ref="form"
    @submit.prevent="submitForm"
  >
    <v-tabs
      v-if="role == 'Admin' && order.id"
      v-model="activeTab"
      background-color="primary"
      dark
      grow
      class="mb-3"
    >
      <v-tab>Operator</v-tab>
      <v-tab>Delivery</v-tab>
    </v-tabs>
    <div v-show="activeTab === 0">
      <OrderOperatorForm />
    </div>
    <div v-show="activeTab === 1">
      <OrderDeliveryForm />
    </div>
    <p v-if="errorMsg">
      {{ errorMsg }}
    </p>
    <FormButtons
      :loading="loading"
      @cancel="exitFunction"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import OrderDeliveryForm from '@/components/orders/OrderDeliveryForm';
import OrderOperatorForm from '@/components/orders/OrderOperatorForm';

import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const form = ref(null);
const activeTab = ref(0);
const errorMsg = ref('');
const router = useRouter();
const loading = ref(false);

const userStore = useUserStore();
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const { element: order, activeForm } = storeToRefs(orderStore);

const exitFunction = () => {
  if (order.value.id || role.value == 'Customer') {
    order.value = {};
    activeForm.value = false;
  } else
    order.value = {};
};

const submitForm = async () => {
  errorMsg.value = '';
  if (!(await form.value.validate()).valid) return;

  if (!order.value.products || Object.keys(order.value.products).length === 0) {
    errorMsg.value = 'Devi aggiungere almeno un prodotto o servizio all\'ordine.';
    return;
  }

  if (['Admin', 'Operator'].includes(role.value) || !order.value.id)
    order.value.dates_form = true;
  else {
    loading.value = true;
    if (order.value.photos && order.value.photos.length > 0)
      orderStore.updateElementWithFormData(router, callback);
    else
      orderStore.updateElement(router, callback);
  }
};

const callback = (data) => {
  loading.value = false;
  if (data.status === 'ok') {
    order.value = {};
    orderStore.initList(router);
    activeForm.value = false;
  }
};
</script>
