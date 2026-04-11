<template>
  <v-card
    :color="theme.current.value.primaryColor"
    :title="`Proposta Borderò ${index + 1}`"
  >
    <template #append>
      <v-btn
        icon="mdi-open-in-new"
        variant="text"
        :disabled="orders.some(order => order.status == 'Acquired')"
        @click="emits('open-schedule', suggestion)"
      />
    </template>
    <v-card-text>
      <v-list style="border-radius: 5px;">
        <p class="ml-4">
          Punti di Ritiro:
        </p>
        <v-list-item
          v-for="item in getScheduleItemsByType('CollectionPoint')"
          :key="item.collection_point_id"
        >
          <v-list-item-title class="no-truncate">
            ID {{ item.collection_point_id }}: {{ item.address }} ({{ item.cap }})
          </v-list-item-title>
        </v-list-item>
        <v-divider />
        <p class="ml-4 mt-4">
          Ordini:
        </p>
        <DraggableOrderList
          v-model="orders"
          :group="{ name: 'orders', pull: true, put: true }"
          class="ml-3 mr-3"
          empty-text="Trascina qui un ordine"
          @change="emits('orders-changed')"
          @order-form="emits('order-form')"
        />
        <v-divider />
        <p class="ml-4 mt-4">
          Utenti Delivery:
        </p>
        <draggable
          v-model="deliveryUsers"
          :group="{ name: 'users', pull: false, put: 'users' }"
          item-key="id"
          class="draggable-area ml-3 mr-3"
        >
          <template #item="{ element }">
            <v-chip
              :text="element.nickname"
              closable
              class="draggable-chip mr-2 mt-2"
              @click:close="removeUser(element.id)"
            />
          </template>
        </draggable>
        <v-divider class="mt-4 mb-4" />
        <p class="ml-4 mt-4">
          Veicolo:
        </p>
        <draggable
          v-model="transports"
          :group="{
            name: 'transports',
            pull: false,
            put: (to, from) =>
              from.options.group.name === 'transports' &&
              transports.length === 0
          }"
          item-key="id"
          class="draggable-area ml-3 mr-3"
        >
          <template #item="{ element }">
            <v-chip
              :text="element.name"
              closable
              class="draggable-chip mr-2 mt-2"
              @click:close="clearTransports"
            />
          </template>
        </draggable>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script setup>
import DraggableOrderList from '@/components/operator/schedules/DraggableOrderList.vue';

import { computed } from 'vue';
import { useTheme } from 'vuetify';
import draggable from 'vuedraggable';

const props = defineProps({
  suggestion: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const theme = useTheme();
const emits = defineEmits(['open-schedule', 'orders-changed', 'update:suggestion', 'order-form']);

const orders = computed({
  get: () => props.suggestion.orders,
  set: (value) => emits('update:suggestion', { ...props.suggestion, orders: value })
});

const deliveryUsers = computed({
  get: () => props.suggestion.delivery_users,
  set: (value) => emits('update:suggestion', { ...props.suggestion, delivery_users: value })
});

const transports = computed({
  get: () => props.suggestion.transports,
  set: (value) => emits('update:suggestion', { ...props.suggestion, transports: value })
});

const getScheduleItemsByType = (operationType) => {
  return props.suggestion.schedule_items?.filter(item => item.operation_type === operationType) ?? [];
};

const removeUser = (userId) => {
  deliveryUsers.value = deliveryUsers.value.filter(user => user.id !== userId);
};

const clearTransports = () => {
  transports.value = [];
};
</script>

<style scoped>
.no-truncate {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

.draggable-area {
  min-height: 30px;
  display: flex;
  flex-wrap: wrap;
}

.draggable-chip {
  cursor: grab;
}

.draggable-chip:active {
  cursor: grabbing;
}
</style>
