<template>
  <v-card
    v-if="managedCoverage"
    title="Giorni della settimana coperti"
    :subtitle="`${nickname} · ${formatDate(managedCoverage.start_date)} → ${formatDate(managedCoverage.end_date)}`"
  >
    <template #append>
      <v-btn
        icon="mdi-plus"
        variant="text"
        @click="formFlag = true"
      />
    </template>
    <v-card-text>
      <CoverageDayForm
        v-if="formFlag"
        @close-form="formFlag = false"
      />
      <CoverageDayTable v-if="managedCoverage.days.length" />
      <p
        v-else
        class="text-medium-emphasis"
      >
        Nessun giorno impostato: aggiungi i giorni della settimana in cui il corriere lavora, con la fascia oraria.
      </p>
    </v-card-text>
  </v-card>
</template>

<script setup>
import CoverageDayForm from '@/components/operator/deliveryCoverage/CoverageDayForm';
import CoverageDayTable from '@/components/operator/deliveryCoverage/CoverageDayTable';

import { computed, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';

const formFlag = ref(false);
const store = useDeliveryCoverageStore();
const { managedCoverage, deliveryUsers } = storeToRefs(store);

const nickname = computed(() =>
  deliveryUsers.value.find((user) => user.id === managedCoverage.value?.user_id)?.nickname || ''
);

const formatDate = (value) => {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};
</script>
