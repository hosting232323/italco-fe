<template>
  <div v-if="!locationError">
    <v-skeleton-loader v-if="!ready" type="table" :color="theme.current.value.secondaryColor" class="mt-5" />
    <div v-else>
      <br><b>
        Totale ordini: {{ totOrder }}
      </b><br><br>
      <v-timeline align="start" side="end" :style="{ marginLeft: isMobile ? '-30px' : '' }">
        <v-timeline-item
          v-for="(item, index) in timelineOrders"
          :key="index"
          :color="timelineColor(item)"
          :dot-color="timelineColor(item)"
          :icon="timelineIcon(item)"
        >
        <v-card :style="{ width: isMobile ? '200px' : '400px', marginLeft: isMobile ? '-15px' : '' }">
            <v-card-text>
              <span v-if="item.collection_point_id">
                <b>Punto di ritiro</b><br><br>

                <b>Indirizzo</b>: <br> {{ item.address || 'N/A' }}, {{ item.cap || 'N/A' }}

              </span>
              <span v-else>
                <b>Ordine #{{ item.id }}</b><br>

                Tipo: {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}<br><br>

                <b>Prodotti e Servizi:</b>
                <div v-for="(product, productName) in item.products" :key="productName">
                  <p>
                    <b>{{ productName }}</b>:
                    {{ product.services?.map(s => s.name).join(', ') || 'Nessuno' }}
                  </p>
                </div><br>

                <b>Prodotti e Punti di Ritiro:</b>
                <div v-for="(product, productName) in item.products" :key="productName" style="font-size: smaller;">
                  Punto di Ritiro: {{ product.collection_point?.name || 'N/A' }},
                  {{ product.collection_point?.address || 'N/A' }}, {{ product.collection_point?.cap || 'N/A' }}
                </div><br>

                <b>Punto Vendita:</b>
                {{ item.users?.map(u => u.nickname).join(', ') || 'N/A' }}<br><br>

                <b>Destinatario:</b> {{ item.addressee || item.name }}<br>
                <span>
                  {{ item.address || 'N/A' }}, {{ item.cap || 'N/A' }}
                </span><br><br>

                <b>Note Punto Vendita:</b> {{ item.customer_note || '-' }}<br>
                <b>Note Operatori:</b> {{ item.operator_note || '-' }}<br>
              </span>
              <small>Slot: {{ item.start_time_slot }} - {{ item.end_time_slot }}</small>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </div>
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
import { useRouter } from 'vue-router';
import orderUtils from '@/utils/order';
import { useOrderStore } from '@/stores/order';
import { ref, computed, onMounted, onUnmounted } from 'vue';
import mobile from '@/utils/mobile';


const isMobile = mobile.setupMobileUtils();
let watcherId = null;
const theme = useTheme();
const router = useRouter();
const locationError = ref(false);
const orderStore = useOrderStore();
const { list: orders, ready } = storeToRefs(orderStore);

const timelineOrders = computed(() => {
  if (!orders.value) return [];
  console.log(orders.value);
  return orders.value
    .flatMap(order => order.schedule_items || [])
    .sort((a, b) => a.index - b.index);
});

const totOrder = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0;

  return orders.value.reduce((total, group) => {
    const validItems = group.schedule_items?.filter(
      item => item.operation_type !== "CollectionPoint"
    ) || [];
    return total + validItems.length;
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
