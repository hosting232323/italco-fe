<template>
  <draggable
    v-model="model"
    :group="group"
    item-key="order_id"
    class="draggable-order-list"
    ghost-class="draggable-ghost"
    @change="emits('change', $event)"
  >
    <template #item="{ element }">
      <v-list-item
        class="draggable-order-item mb-2"
        prepend-icon="mdi-drag"
        rounded="lg"
      >
        <v-list-item-title class="no-truncate">
          ID {{ element.order_id }}: {{ element.address }} ({{ element.cap }})
          <template v-if="element.status == 'Acquired'">
            <v-icon
              color="warning"
              size="16"
              class="ml-1"
              title="Ordine senza data booking"
            >
              mdi-alert-circle
            </v-icon>
            <v-icon
              size="16"
              class="ml-1"
              style="cursor:pointer"
              @click="openOrderForm(element)"
            >
              mdi-pencil
            </v-icon>
          </template>
        </v-list-item-title>
      </v-list-item>
    </template>
    <template #footer>
      <div
        v-if="model.length === 0"
        :class="emptyStateClass"
      >
        {{ emptyText }}
      </div>
    </template>
  </draggable>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  },
  group: {
    type: Object,
    required: true
  },
  emptyText: {
    type: String,
    required: true
  },
  emptyStateClass: {
    type: String,
    default: 'text-medium-emphasis pa-3'
  }
});

const orderStore = useOrderStore();
const { element: order } = storeToRefs(orderStore);

const emits = defineEmits(['update:modelValue', 'change', 'order-form']);

const openOrderForm = (item) => {
  order.value = storesUtils.exclude_keys(item, ['products']);
  order.value.schedulation = true;
  order.value.id = item.order_id;
  emits('order-form');
};

const model = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
});
</script>

<style scoped>
.no-truncate {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

.draggable-order-list {
  min-height: 56px;
}

.draggable-order-item {
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.draggable-ghost {
  opacity: 0.5;
}
</style>
