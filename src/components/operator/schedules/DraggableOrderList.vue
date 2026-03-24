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
import draggable from 'vuedraggable';

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

const emits = defineEmits(['update:modelValue', 'change']);

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
