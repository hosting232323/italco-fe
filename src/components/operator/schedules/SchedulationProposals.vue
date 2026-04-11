<template>
  <v-row>
    <v-col
      v-for="(suggestion, index) in suggestions"
      :key="index"
      cols="12"
      md="4"
    >
      <SchedulationProposalCard
        :suggestion="suggestion"
        :index="index"
        @update:suggestion="(updated) => Object.assign(suggestion, updated)"
        @open-schedule="emits('open-schedule', $event)"
        @orders-changed="emits('orders-changed')"
        @order-form="emits('order-form')"
      />
    </v-col>
    <v-col
      v-if="suggestions.length > 0"
      cols="12"
      md="4"
    >
      <v-card
        class="new-proposal-card"
        variant="outlined"
        title="Nuova proposta"
      >
        <v-card-text>
          <DraggableOrderList
            v-model="newSuggestionOrdersModel"
            :group="{ name: 'orders', pull: false, put: true }"
            class="new-proposal-dropzone"
            empty-text="Trascina qui un ordine per creare una nuova proposta"
            empty-state-class="text-medium-emphasis pa-4 text-center"
            @change="emits('create-suggestion', $event)"
          />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <template v-if="availableDeliveryUsers.length > 0">
    <h2 class="mt-5">
      Utenti disponibili
    </h2>
    <draggable
      :list="availableDeliveryUsers"
      :group="{ name: 'users', pull: 'clone', put: false }"
      :clone="cloneUser"
      item-key="id"
    >
      <template #item="{ element }">
        <v-chip
          :text="element.nickname"
          class="draggable-chip ma-1"
          draggable
        />
      </template>
    </draggable>
  </template>
  <template v-if="availableTransports.length > 0">
    <h2 class="mt-5">
      Veicoli disponibili
    </h2>
    <draggable
      :list="availableTransports"
      :group="{ name: 'transports', pull: 'clone', put: false }"
      :clone="cloneTransport"
      item-key="id"
    >
      <template #item="{ element }">
        <v-chip
          :text="element.name"
          class="draggable-chip ma-1"
          draggable
        />
      </template>
    </draggable>
  </template>
</template>

<script setup>
import DraggableOrderList from '@/components/operator/schedules/DraggableOrderList.vue';
import SchedulationProposalCard from '@/components/operator/schedules/SchedulationProposalCard.vue';

import { computed } from 'vue';
import draggable from 'vuedraggable';

const props = defineProps({
  suggestions: {
    type: Array,
    required: true
  },
  newSuggestionOrders: {
    type: Array,
    required: true
  },
  availableDeliveryUsers: {
    type: Array,
    required: true
  },
  availableTransports: {
    type: Array,
    required: true
  }
});

const emits = defineEmits([
  'update:newSuggestionOrders',
  'create-suggestion',
  'orders-changed',
  'open-schedule',
  'order-form'
]);

const newSuggestionOrdersModel = computed({
  get: () => props.newSuggestionOrders,
  set: (value) => emits('update:newSuggestionOrders', value)
});

const cloneUser = (user) => {
  return { ...user };
};

const cloneTransport = (transport) => {
  return { ...transport };
};
</script>

<style scoped>
.new-proposal-card {
  border-style: dashed;
}

.new-proposal-dropzone {
  min-height: 120px;
}

.draggable-chip {
  cursor: grab;
}

.draggable-chip:active {
  cursor: grabbing;
}
</style>
