<template>
  <v-card :title="`ID Ordine: ${order.id}`">
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-select
          v-if="!['Completed', 'Cancelled'].includes(actualStatus)"
          v-model="status"
          label="Stato"
          :items="STATUS_MAP[actualStatus].map(status => ({
            value: status,
            title: orderUtils.LABELS.find(label => label.value == status).title
          }))"
        />
        <v-textarea
          v-if="status === 'Cancelled' || order.delay || order.anomaly"
          v-model="order.motivation"
          label="Motivazione"
          rows="3"
          :rules="validation.requiredRules"
        />
        <v-file-input
          v-if="['Completed', 'Cancelled'].includes(status) || order.delay || order.anomaly"
          v-model="order.photos"
          multiple
          accept="image/*"
          label="Foto"
          :rules="(status === 'Completed' || order.anomaly) ? validation.arrayRules : []"
        />
        <v-row>
          <v-col
            cols="6"
            :class="isMobile ? 'd-flex flex-column' : 'd-flex justify-center align-center'"
          >
            <v-radio-group v-model="order.delay">
              <label class="mr-2">In ritardo</label>
              <v-radio
                label="Sì"
                :value="true"
              />
              <v-radio
                label="No"
                :value="false"
              />
            </v-radio-group>
            <div
              v-if="order.delay"
              :style="isMobile ? { width: '100%' } : { width: '50%', height: '100%' }"
              :class="isMobile ? 'd-flex flex-column' : 'd-flex justify-center align-center'"
            >
              <v-text-field
                v-model="order.start_time_slot"
                label="Time Slot Start"
                type="time"
                :rules="validation.requiredRules"
                dense
                hide-details
                :style="isMobile ? { margin: '15px 0', width: '100%' } : { maxWidth: '115px', marginRight: '15px' }"
              />
              <v-text-field
                v-model="order.end_time_slot"
                label="Time Slot End"
                type="time"
                :rules="validation.futureTime(order)"
                dense
                hide-details
                :style="isMobile ? { width: '100%' } : { maxWidth: '115px' }"
              />
            </div>
          </v-col>
          <v-col cols="6">
            <v-radio-group v-model="order.anomaly">
              <label class="mr-2">Con Anomalia</label>
              <v-radio
                label="Sì"
                :value="true"
              />
              <v-radio
                label="No"
                :value="false"
              />
            </v-radio-group>
          </v-col>
        </v-row>
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
import mobile from '@/utils/mobile';
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
const isMobile = mobile.setupMobileUtils();
const { element: order } = storeToRefs(orderStore);

const STATUS_MAP = {
  'In Progress': ['On Board', 'Cancelled', 'At Warehouse'],
  'On Board': ['Completed', 'Cancelled', 'At Warehouse'],
  'At Warehouse': ['On Board']
};
const actualStatus = order.value.status;

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  order.value.user_id = order.value.user.id;
  if (status.value) order.value.status = status.value;
  orderStore.updateElementWithFormData(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      orderStore.initListDelivery(router);
      order.value = {};
      emits('cancel');
    }
  });
};
</script>
