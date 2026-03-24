<template>
  <draggable
    v-model="schedule.schedule_items"
    item-key="id"
    class="mb-4"
    handle=".drag-handle"
  >
    <template #item="{ element }">
      <ScheduleItem
        :element="element"
        :not-found-addresses="notFoundAddresses"
      />
    </template>
  </draggable>
</template>

<script setup>
import ScheduleItem from '@/components/operator/schedules/ScheduleItem.vue';

import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import { useScheduleStore } from '@/stores/schedule';

defineProps({
  notFoundAddresses: {
    type: Array,
    required: true
  }
});

const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);
</script>
