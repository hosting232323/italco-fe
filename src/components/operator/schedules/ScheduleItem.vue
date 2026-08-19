<template>
  <v-row
    no-gutters
    class="mt-2"
  >
    <v-col cols="1">
      <div
        class="drag-handle"
        style="cursor: grab;"
      >
        <v-icon>mdi-drag</v-icon>
      </div>
    </v-col>
    <v-col cols="4">
      <p>
        {{ element.index + 1 }}:
        {{ element.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro' }}
        ID {{ element.operation_type == 'Order' ? element.order_id : element.collection_point_id }}
      </p>
      <div style="font-size: smaller; padding-right: 5px;">
        {{ element.address }}, {{ element.cap }}
        <v-icon
          v-if="invalidAddress"
          icon="mdi-pencil"
          size="x-small"
          color="#C62828"
          style="cursor: pointer;"
          title="Indirizzo non riconosciuto: correggilo per posizionare la tappa"
          @click="addressFormFlag = true"
        />
        <v-dialog
          v-model="addressFormFlag"
          max-width="800"
        >
          <AddressForm
            :index="index"
            @close-form="addressFormFlag = false"
          />
        </v-dialog>
      </div>
    </v-col>
    <v-col cols="6">
      <div :class="['d-flex', 'align-center', isMobile ? 'flex-column' : '']">
        <v-text-field 
          v-model="element.start_time_slot" 
          label="Time Slot Start"
          type="time"
          :rules="validation.requiredRules" 
          dense
          hide-details
          :style="isMobile ? { margin: '15px 0', width: '' }: { width: '200px', marginRight: '15px' }"
        />
        <v-text-field 
          v-model="element.end_time_slot" 
          label="Time Slot End"
          type="time"
          :rules="validation.futureTime(element.start_time_slot)" 
          dense
          hide-details
          :style="isMobile ? { width: '' }: { width: '200px' }"
        />
      </div>
    </v-col>
    <v-col cols="1">
      <v-btn
        v-if="element.operation_type === 'Order' &&
          !orderUtils.isTerminatedOrder(element) &&
          schedule.schedule_items.filter(item => item.operation_type == 'Order').length > 1"
        variant="text"
        icon="mdi-delete"
        :color="theme.current.value.primaryColor"
        @click="removeOrder(element)"
      />
    </v-col>
  </v-row>
</template>

<script setup>
import AddressForm from '@/components/operator/schedules/ScheduleItemAddressForm';

import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import validation from '@/utils/validation';
import { useScheduleStore } from '@/stores/schedule';

const { index } = defineProps({
  index: {
    type: Number,
    required: true
  }
});

const theme = useTheme();
const isMobile = mobile.setupMobileUtils();
const addressFormFlag = ref(false);

const scheduleStore = useScheduleStore();
const { element: schedule, geocodeResults } = storeToRefs(scheduleStore);
const element = computed(() => schedule.value.schedule_items.find(item => item.index === index));

// La mappa ripiega sul CAP (pallino rosso) quando l'indirizzo non viene
// riconosciuto: in quel caso si offre la correzione.
const invalidAddress = computed(() => {
  if (!element.value.address) return true;

  const result = geocodeResults.value[`${element.value.address}|${element.value.cap}`];
  return result === null || result?.precision === 'cap';
});

if (!element.value?.id) {
  element.value.start_time_slot = '08:00';
  element.value.end_time_slot = '09:00';
}

const removeOrder = (order) => {
  const remainingItems = schedule.value.schedule_items.filter(
    item => !(item.operation_type === 'Order' && item.order_id === order.order_id)
  );

  const usedCollectionPointIds = new Set(
    remainingItems
      .filter(item => item.operation_type === 'Order')
      .flatMap(item =>
        Object.values(item.products || {})
          .filter(product => product.collection_point)
          .map(product => product.collection_point.id)
      )
  );

  schedule.value.schedule_items = remainingItems.filter(item => {
    if (item.operation_type === 'Order')
      return true;
    else if (item.operation_type === 'CollectionPoint')
      return usedCollectionPointIds.has(item.collection_point_id);
    else
      return false;
  });
};
</script>
