<template>
  <div
    v-if="loadingDates"
    class="loading-wrapper"
  >
    Loading<span class="dots" />
  </div>
  <v-form
    v-else
    ref="form"
    @submit.prevent="submitForm"
  >
    Seleziona le date per l'ordine:
    <v-row
      no-gutters
      class="mt-2"
    >
      <v-col
        cols="12"
        md="6"
      >
        <DateField 
          v-model="order.dpc"
          label="Data Prevista dal Cliente"
          :class-style="isMobile ? '' : 'ml-2 mr-2'"
          :allowed-dates="allowedDpcDates"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <DateField 
          v-model="order.drc"
          label="Data Richiesta dal Cliente"
          :class-style="isMobile ? '' : 'ml-2'"
          :rules="validation.requiredRules"
          :allowed-dates="nextTwoMonths"
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
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const form = ref(null);
const router = useRouter();
const loading = ref(false);
const loadingDates = ref(true);
const allowedDpcDates = ref([]);
const userStore = useUserStore();
const orderStore = useOrderStore();
const isMobile = mobile.setupMobileUtils();
const { role } = storeToRefs(userStore);
const { element: order, activeForm } = storeToRefs(orderStore);

const getDateRangeArray = () => {
  const result = [];
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + 2);

  for (let date = new Date(today); date <= endDate; date.setDate(date.getDate() + 1)) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // mesi da 0 a 11
    const day = String(date.getDate()).padStart(2, '0');
    result.push(`${year}-${month}-${day}`);
  }

  return result;
};

const nextTwoMonths = getDateRangeArray();

if (role.value == 'Customer')
  http.postRequest('check-constraints', {
    cap: order.value.cap,
    services_id: [
      ...new Set(Object.values(order.value.products).flat().map(s => s.id))
    ]
  }, (data) => {
    if (data.status === 'ok')
      allowedDpcDates.value = data.dates; 
    else 
      allowedDpcDates.value = []; 
    loadingDates.value = false;
  }, 'POST', router);
else {
  allowedDpcDates.value = nextTwoMonths;
  loadingDates.value = false;
}

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (order.value.id && order.value.photos && order.value.photos.length > 0)
    orderStore.updateElementWithFormData(router, callback);
  else if (order.value.id)
    orderStore.updateElement(router, callback);
  else
    orderStore.createElement(router, callback);
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

<style scoped>
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  color: #555;
  user-select: none;
}

.dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
  display: inline-block;
  width: 1em;
  text-align: left;
}

@keyframes dots {
  0%, 20% {
    content: '';
  }
  40% {
    content: '.';
  }
  60% {
    content: '..';
  }
  80%, 100% {
    content: '...';
  }
}
</style>
