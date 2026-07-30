<template>
  <v-container>
    <h1>Dashboard</h1><hr>
    <DashboardFilters class="mt-6 mb-2" />
    <div
      v-if="!ready"
      class="d-flex justify-center py-10"
    >
      <v-progress-circular
        indeterminate
        :color="theme.current.value.primaryColor"
      />
    </div>
    <template v-else>
      <DashboardKpis />
      <DashboardCharts />
    </template>
  </v-container>
</template>

<script setup>
import DashboardKpis from '@/components/dashboard/DashboardKpis';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import DashboardFilters from '@/components/dashboard/DashboardFilters';

import { onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';

const theme = useTheme();
const dashboardStore = useDashboardStore();
const { filters, ready } = storeToRefs(dashboardStore);

const toIsoDate = (date) => date.toISOString().slice(0, 10);

onMounted(() => {
  if (!ready.value) {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    filters.value.start = toIsoDate(start);
    filters.value.end = toIsoDate(end);
    dashboardStore.load();
  }
});
</script>
