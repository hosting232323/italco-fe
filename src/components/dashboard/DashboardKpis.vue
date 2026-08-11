<template>
  <v-row class="mb-1">
    <v-col
      v-for="kpi in cards"
      :key="kpi.label"
      cols="6"
      md="3"
    >
      <v-card
        class="pa-4"
        rounded="lg"
        flat
        border
      >
        <div class="d-flex align-center justify-space-between">
          <p class="text-caption text-medium-emphasis mb-1">
            {{ kpi.label }}
          </p>
          <v-icon
            :icon="kpi.icon"
            :color="kpi.color || theme.current.value.primaryColor"
          />
        </div>
        <p class="text-h5 font-weight-bold">
          {{ kpi.value }}
        </p>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';

const theme = useTheme();
const dashboardStore = useDashboardStore();
const { analytics } = storeToRefs(dashboardStore);

const formatNumber = (value) => new Intl.NumberFormat('it-IT').format(value || 0);

const cards = computed(() => {
  const kpis = analytics.value.kpis;
  return [
    { label: 'Ordini totali', value: formatNumber(kpis.total_orders), icon: 'mdi-package-variant-closed' },
    { label: 'Consegnati', value: formatNumber(kpis.delivered_orders), icon: 'mdi-check-circle', color: '#2e7d32' },
    { label: 'Tasso di consegna', value: `${kpis.delivery_rate || 0}%`, icon: 'mdi-percent' },
    { label: 'Non consegnati', value: formatNumber(kpis.not_delivered_orders), icon: 'mdi-close-circle', color: '#c62828' },
    { label: 'In corso', value: formatNumber(kpis.in_progress_orders), icon: 'mdi-progress-clock', color: '#1565c0' },
    { label: 'Anomalie', value: formatNumber(kpis.anomaly_orders), icon: 'mdi-alert', color: '#ef6c00' },
    { label: 'Ritardi', value: formatNumber(kpis.delay_orders), icon: 'mdi-clock-alert', color: '#ef6c00' },
    { label: 'RAEE ritirati', value: formatNumber(kpis.rae_products), icon: 'mdi-recycle', color: '#2e7d32' }
  ];
});
</script>
