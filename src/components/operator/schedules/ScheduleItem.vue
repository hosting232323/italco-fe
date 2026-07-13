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
import { computed } from 'vue';
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

const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);
const element = computed(() => schedule.value.schedule_items.find(item => item.index === index));

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
