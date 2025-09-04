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

        <draggable
          v-model="schedule.orders"
          item-key="id"
          class="mb-4"
          handle=".drag-handle"
        >
          <template #item="{ element }">
            <div class="d-flex align-center order-item">
              <div class="drag-handle" style="cursor: grab;">
                <v-icon>mdi-drag</v-icon>
              </div>
              <div :class="['d-flex', 'justify-space-between', isMobile ? '' : 'align-center', isMobile ? 'flex-column' : '']" style="width: 100%;">
                <p>Ordine #{{ element.id }}</p>
                <div :class="['d-flex', isMobile ? 'flex-column' : '']">
                  <v-text-field 
                    v-model="element.start_time_slot" 
                    label="Time Slot Start"
                    type="time"
                    :rules="validation.requiredRules" 
                    dense hide-details 
                    :style="isMobile ? { margin: '15px 0', width: '' }: { width: '200px', marginRight: '15px' }"
                  />
                  <v-text-field 
                    v-model="element.end_time_slot" 
                    label="Time Slot End"
                    type="time"
                    :rules="validation.futureTime(element)" 
                    dense hide-details 
                    :style="isMobile ? { width: '' }: { width: '200px' }"
                  />
                </div>
                
              </div>
            </div>
          </template>
        </draggable>
        <FormButtons :loading="loading" @cancel="emits('cancel')" />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
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

if (!schedule.value.orders) schedule.value.orders = [];

const syncOrders = () => {
  const existingMap = Object.fromEntries(
    schedule.value.orders.map(o => [o.id, o])
  );

  schedule.value.orders = schedule.value.order_ids.map((id, index) => {
    const existing = existingMap[id];
    if (existing) 
      return { ...existing, schedule_index: index };
    else 
      return {
        id,
        start_time_slot: '',
        end_time_slot: '',
        schedule_index: index
      };
  });
};

syncOrders();

watch(
  () => schedule.value.order_ids,
  () => syncOrders(),
  { deep: true }
);

watch(
  () => schedule.value.orders,
  (newOrders) => newOrders.forEach((o, i) => o.schedule_index = i),
  { deep: true }
);

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

<style scoped>
.order-item {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
