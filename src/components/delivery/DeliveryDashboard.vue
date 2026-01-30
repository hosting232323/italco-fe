<template>
  <div v-if="!locationError">
    <v-skeleton-loader v-if="!ready" type="table" :color="theme.current.value.secondaryColor" class="mt-5" />
    <div v-else>
      <br><b>
        Totale ordini: {{ totOrder }}
      </b><br><br>
    </div>
    <template>
      <v-timeline side="end">
        <v-timeline-item v-for="(item, index) in timelineOrders" :key="index" :dot-color="timelineColor(item)"
          size="small">
          <template #icon>
            <span class="dot-index">
              {{ item.index + 1 }}
            </span>
          </template>
          <v-alert :color="timelineColor(item)" :icon="timelineIcon(item)" border="start" variant="tonal">
            <b>#{{ item.id }}</b>

            <template v-if="item.operation_type === 'Order'">
              — {{ item.addressee }}<br>
              <small>{{ item.address }} ({{ item.cap }})</small><br>
              <small>Ordine ID: {{ item.order_id }}</small>
            </template>

            <template v-else>
              — Punto di ritiro<br>
              <small>{{ item.address }} ({{ item.cap }})</small>
            </template>

            <div v-if="item.anomaly" class="mt-1">
              ⚠️ <b>Anomalia</b>
            </div>

            <div v-if="item.delay" class="mt-1">
              ⏱️ <b>Ritardo</b>
            </div>
          </v-alert>

        </v-timeline-item>
      </v-timeline>
    </template>
  </div>

  <div v-else-if="locationError" class="text-center mt-10">
    <v-alert type="error" border="start" color="red" prominent>
      ⚠️ Per usare questa funzionalità devi <strong>abilitare la geolocalizzazione</strong>.<br>
      Ricarica la pagina e consenti i permessi quando richiesto.
    </v-alert>
  </div>
</template>

<script setup>
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';
import { ref, computed, onMounted, onUnmounted } from 'vue';

let watcherId = null;
const theme = useTheme();
const router = useRouter();
const locationError = ref(false);
const orderStore = useOrderStore();
const selectedCard = ref('In Progress');
const { list: orders, ready } = storeToRefs(orderStore);

const isMobile = mobile.setupMobileUtils();

const timelineOrders = computed(() => {
  if (!orders.value) return [];

  return Object.values(orders.value)
    .flat()
    .sort((a, b) => a.index - b.index);
});

const totOrder = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0;

  return orders.value.reduce((total, group) => {
    return total + (group.schedule_items?.length || 0);
  }, 0);
});

const timelineColor = order => {
  if (order.anomaly) return 'red';
  if (order.delay) return 'orange';

  switch (order.status) {
    case 'In Progress': return 'blue';
    case 'On Board': return 'indigo';
    case 'At Warehouse': return 'cyan';
    case 'Completed': return 'green';
    case 'Cancelled': return 'grey';
    default: return 'primary';
  }
};

const timelineIcon = order => {
  if (order.anomaly) return 'mdi-alert-circle';
  if (order.delay) return 'mdi-clock-alert';

  switch (order.status) {
    case 'In Progress': return 'mdi-truck-outline';
    case 'On Board': return 'mdi-truck-fast';
    case 'Completed': return 'mdi-check-circle';
    case 'Cancelled': return 'mdi-close-circle';
    default: return 'mdi-package-variant';
  }
};


const cards = [
  {
    title: 'Da caricare',
    key: 'In Progress'
  },
  {
    title: 'A bordo',
    key: 'On Board'
  },
  {
    title: 'In Magazzino',
    key: 'At Warehouse'
  },
  {
    title: 'Completato',
    key: 'Completed'
  },
  {
    title: 'Non Consegnato',
    key: 'Cancelled'
  },
  {
    title: 'Da Riprogrammare',
    key: 'To Reschedule'
  },
  {
    title: 'Anomalia',
    key: 'Anomaly'
  },
  {
    title: 'Ritardo',
    key: 'Delay'
  },
];

const cardCounts = computed(() => {
  const anomalyOrders = [];
  const delayOrders = [];

  for (const key of ['In Progress', 'On Board']) {
    const list = orders.value?.[key] || [];
    list.forEach(order => {
      if (order.anomaly) anomalyOrders.push(order);
      if (order.delay) delayOrders.push(order);
    });
  }
  return {
    'In Progress': orders.value?.['In Progress']?.length || 0,
    'On Board': orders.value?.['On Board']?.length || 0,
    'Completed': orders.value?.['Completed']?.length || 0,
    'Cancelled': orders.value?.['Cancelled']?.length || 0,
    'At Warehouse': orders.value?.['At Warehouse']?.length || 0,
    'To Reschedule': orders.value?.['To Reschedule']?.length || 0,
    'Anomaly': anomalyOrders.length,
    'Delay': delayOrders.length
  };
});

onMounted(() => {
  if (!navigator.geolocation) {
    locationError.value = true;
    return;
  }

  let firstPositionHandled = false;
  watcherId = navigator.geolocation.watchPosition(
    position => {
      if (!firstPositionHandled) {
        firstPositionHandled = true;
        if (!ready.value) orderStore.initListDelivery(router);
      }

      http.postRequest('user/position', {
        lat: position.coords.latitude,
        lon: position.coords.longitude
      }, () => { }, 'POST', router);
    },
    () => locationError.value = true,
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000
    }
  );

  onUnmounted(() => {
    if (watcherId != null) navigator.geolocation.clearWatch(watcherId);
  });
});
</script>

<style scoped>
.selected {
  background-color: var(--item-bg-color);
  color: white;
}
</style>
