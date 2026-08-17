<template>
  <v-row>
    <v-col
      cols="12"
      md="8"
    >
      <v-card
        class="pa-4"
        rounded="lg"
        flat
        border
      >
        <p class="chart-title">
          Ordini nel tempo
        </p>
        <apexchart
          type="area"
          height="300"
          :options="ordersOverTimeOptions"
          :series="ordersOverTimeSeries"
        />
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-card
        class="pa-4"
        rounded="lg"
        flat
        border
      >
        <p class="chart-title">
          Ordini per stato
        </p>
        <apexchart
          type="donut"
          height="300"
          :options="donutOptions(analytics.orders_by_status)"
          :series="counts(analytics.orders_by_status)"
        />
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="8"
    >
      <v-card
        class="pa-4"
        rounded="lg"
        flat
        border
      >
        <p class="chart-title">
          Migliori clienti per ordini
        </p>
        <apexchart
          type="bar"
          height="320"
          :options="horizontalBarOptions(analytics.top_customers)"
          :series="[{ name: 'Ordini', data: counts(analytics.top_customers) }]"
        />
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-card
        class="pa-4"
        rounded="lg"
        flat
        border
      >
        <p class="chart-title">
          Consegne per giorno della settimana
        </p>
        <apexchart
          type="bar"
          height="320"
          :options="verticalBarOptions(analytics.orders_by_weekday)"
          :series="[{ name: 'Ordini', data: counts(analytics.orders_by_weekday) }]"
        />
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="4"
    >
      <v-card
        class="pa-4"
        rounded="lg"
        flat
        border
      >
        <p class="chart-title">
          RAEE per stato
        </p>
        <apexchart
          type="donut"
          height="320"
          :options="donutOptions(analytics.rae_by_status)"
          :series="counts(analytics.rae_by_status)"
        />
      </v-card>
    </v-col>

    <v-col
      cols="12"
      md="8"
    >
      <v-card
        class="pa-4"
        rounded="lg"
        flat
        border
      >
        <p class="chart-title">
          RAEE per raggruppamento
        </p>
        <apexchart
          type="bar"
          height="320"
          :options="verticalBarOptions(analytics.rae_by_group)"
          :series="[{ name: 'RAEE', data: counts(analytics.rae_by_group) }]"
        />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@/stores/dashboard';

const PRIMARY = '#354c7c';
const PALETTE = ['#354c7c', '#46639e', '#6b83b8', '#9daccd', '#26375a', '#5a7bb5', '#c0cae0', '#8aa0c8'];

const dashboardStore = useDashboardStore();
const { analytics } = storeToRefs(dashboardStore);

const counts = (rows) => rows.map(row => row.count);
const labels = (rows) => rows.map(row => row.label);

const baseChart = {
  fontFamily: 'inherit',
  toolbar: { show: false },
  zoom: { enabled: false }
};

const ordersOverTimeSeries = computed(() => [
  { name: 'Ordini', data: analytics.value.orders_over_time.map(row => row.count) }
]);

const ordersOverTimeOptions = computed(() => ({
  chart: { ...baseChart, type: 'area' },
  colors: [PRIMARY],
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  fill: { type: 'gradient', gradient: { opacityFrom: 0.35, opacityTo: 0.05 } },
  xaxis: {
    type: 'datetime',
    categories: analytics.value.orders_over_time.map(row => row.date)
  },
  grid: { borderColor: 'rgba(0,0,0,0.06)' }
}));

const donutOptions = (rows) => ({
  chart: { ...baseChart, type: 'donut' },
  colors: PALETTE,
  labels: labels(rows),
  legend: { position: 'bottom' },
  dataLabels: { enabled: true },
  noData: { text: 'Nessun dato' }
});

const horizontalBarOptions = (rows) => ({
  chart: { ...baseChart, type: 'bar' },
  colors: [PRIMARY],
  plotOptions: { bar: { horizontal: true, borderRadius: 4 } },
  dataLabels: { enabled: false },
  xaxis: { categories: labels(rows) },
  grid: { borderColor: 'rgba(0,0,0,0.06)' },
  noData: { text: 'Nessun dato' }
});

const verticalBarOptions = (rows) => ({
  chart: { ...baseChart, type: 'bar' },
  colors: [PRIMARY],
  plotOptions: { bar: { borderRadius: 4, columnWidth: '45%' } },
  dataLabels: { enabled: false },
  xaxis: { categories: labels(rows) },
  grid: { borderColor: 'rgba(0,0,0,0.06)' },
  noData: { text: 'Nessun dato' }
});
</script>

<style scoped>
.chart-title {
  font-weight: 600;
  margin-bottom: 12px;
}
</style>
