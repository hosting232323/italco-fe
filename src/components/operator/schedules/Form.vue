<template>
  <v-card
    v-if="!schedule.order_ids"
    title="Seleziona degli ordini per creare un Borderò"
  />
  <v-card
    v-else-if="schedule.order_ids.some(
      id => orders.some(
        order => order.id === id && order.status !== 'Pending'
      )
    )"
    title="Hai selezionato degli ordini già assegnati"
  />
  <v-card
    v-else
    title="Crea Borderò"
    :subtitle="`Ordini: ${schedule.order_ids.join(', ')}`"
  >
    <v-card-text>
      <v-form ref="form" @submit.prevent="assignDeliveryGroup">
        <v-row no-gutters>
          <v-col cols="12" md="4">
            <v-select
              v-model="schedule.delivery_group_id"
              :class="isMobile ? '' : 'mr-2'"
              label="Gruppo Delivery"
              :items="deliveryGroups"
              item-title="name"
              item-value="id"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="schedule.transport_id"
              :class="isMobile ? '' : 'ml-2 mr-2'"
              label="Veicolo"
              :items="transports"
              item-title="name"
              item-value="id"
              :rules="validation.requiredRules"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-text-field
              type="date"
              v-model="schedule.date"
              :class="isMobile ? '' : 'ml-2'"
              label="Data"
              :rules="validation.requiredRules"
            />
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
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const form = ref(null);
const router = useRouter();
const loading = ref(false);
const orderStore = useOrderStore();
const emits = defineEmits(['cancel']);
const scheduleStore = useScheduleStore();
const transportStore = useTransportStore();
const isMobile = mobile.setupMobileUtils();
const deliveryGroupStore = useDeliveryGroupStore();
const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore, router);
const transports = storesUtils.getStoreList(transportStore, router);
const deliveryGroups = storesUtils.getStoreList(deliveryGroupStore, router);

const assignDeliveryGroup = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  scheduleStore.createElement(router, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      orderStore.initList(router);
      scheduleStore.initList(router);
      schedule.value = {};
      emits('cancel');
    }
  });
};
</script>
