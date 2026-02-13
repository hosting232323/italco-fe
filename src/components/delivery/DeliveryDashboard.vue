<template>
  <div v-if="!locationError">
    <v-skeleton-loader
      v-if="!ready"
      type="table"
      :color="theme.current.value.secondaryColor"
      class="mt-5"
    />
    <div v-else>
      <br><b>
        Totale ordini: {{ totOrder }}
      </b><br><br>
      <v-item-group
        v-model="selectedCard"
        selected-class="selected"
        :style="{ '--item-bg-color': theme.current.value.primaryColor }"
      >
        <v-row>
          <v-col
            v-for="card in cards"
            :key="card.key"
            :cols="isMobile ? 6 :
              (['Delay', 'Anomaly', 'Not Delivered', 'To Reschedule'].includes(card.key) ? 2 : 4)"
          >
            <v-item
              v-slot="{ selectedClass, toggle }"
              :value="card.key"
            >
              <v-card
                :class="['d-flex align-center', selectedClass]"
                height="100"
                @click="toggle"
              >
                <v-card-text style="font-size: larger;">
                  {{ card.title }}: <b>{{ cardCounts[card.key] }}</b>
                </v-card-text>
              </v-card>
            </v-item>
          </v-col>
        </v-row>
      </v-item-group>
    </div>
    <Table :key-name="selectedCard" />
  </div>

  <div
    v-else-if="locationError"
    class="text-center mt-10"
  >
    <v-alert
      type="error"
      border="start"
      color="red"
      prominent
    >
      ⚠️ Per usare questa funzionalità devi <strong>abilitare la geolocalizzazione</strong>.<br>
      Ricarica la pagina e consenti i permessi quando richiesto.
    </v-alert>
  </div>
</template>

<script setup>
import Table from '@/components/delivery/DeliveryTable';

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
const selectedCard = ref('Confirmed');
const { list: orders, ready } = storeToRefs(orderStore);

const isMobile = mobile.setupMobileUtils();
const totOrder = computed(() => {
  if (!orders.value) return 0;
  else
    return Object.values(orders.value).reduce((sum, arr) => sum + arr.length, 0);
});


const cards = [
  {
    title: 'Da caricare',
    key: 'Confirmed'
  },
  {
    title: 'A bordo',
    key: 'Booking'
  },
  {
    title: 'In Magazzino',
    key: 'At Warehouse'
  },
  {
    title: 'Completato',
    key: 'Delivered'
  },
  {
    title: 'Non Consegnato',
    key: 'Not Delivered'
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

  for (const key of ['Confirmed', 'Booking']) {
    const list = orders.value?.[key] || [];
    list.forEach(order => {
      if (order.anomaly) anomalyOrders.push(order);
      if (order.delay) delayOrders.push(order);
    });
  }
  return {
    'Confirmed': orders.value?.['Confirmed']?.length || 0,
    'Booking': orders.value?.['Booking']?.length || 0,
    'Delivered': orders.value?.['Delivered']?.length || 0,
    'Not Delivered': orders.value?.['Not Delivered']?.length || 0,
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
      }, () => {}, 'POST', router);
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
