<template>
  <v-dialog
    v-if="!locationError"
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <div>
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
          <v-timeline
            align="start"
            side="end"
            :style="{ marginLeft: isMobile ? '-30px' : '' }"
          >
            <v-timeline-item
              v-for="(item, index) in timelineOrders"
              :key="index"
              :color="timelineColor(item)"
              :dot-color="timelineColor(item)"
              :icon="timelineIcon(item)"
            >
              <div 
                class="swipe-card-wrapper"
                @touchstart="startSwipe($event, index)"
                @touchmove="onSwipe($event, index)"
                @touchend="endSwipe($event, index)"
                @mousedown="startSwipe($event, index, true)"
                @mousemove="onSwipe($event, index, true)"
                @mouseup="endSwipe($event, index, true)"
              >
                <div
                  class="swipe-actions"
                  :class="{ active: activeSwipeIndex === index }"
                >
                  <button
                    v-if="item.collection_point_id"
                    @click="completeCollectionPoint(item)"
                  >
                    Completa punto di ritiro
                  </button>
                  <button
                    v-else-if="isCollectionPointCompleted(item)"
                    @click="completeOrder(item)"
                  >
                    Completa ordine
                  </button>
                  <button
                    v-else
                    style="cursor: default;"
                  >
                    Completa prima il punto di ritiro
                  </button>
                </div>
                <v-card :style="{ width: isMobile ? '200px' : '400px' }">
                  <v-card-text>
                    <span v-if="item.collection_point_id">
                      <b>Punto di ritiro</b><br><br>

                      <b>Indirizzo</b>: <br> {{ item.address || 'N/A' }}, {{ item.cap || 'N/A' }}<br><br>

                    </span>
                    <span v-else>
                      <b>Ordine #{{ item.id }}</b><br>

                      Tipo: {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}<br><br>

                      <b>Prodotti e Servizi:</b>
                      <div
                        v-for="(product, productName) in item.products"
                        :key="productName"
                      >
                        <p>
                          <b>{{ productName }}</b>:
                          {{ product.services?.map(s => s.name).join(', ') || 'Nessuno' }}
                        </p>
                      </div><br>

                      <b>Prodotti e Punti di Ritiro:</b>
                      <div
                        v-for="(product, productName) in item.products"
                        :key="productName"
                        style="font-size: smaller;"
                      >
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
                      <b>Note Operatori:</b> {{ item.operator_note || '-' }}<br><br>
                    </span>
                    <small>Slot: {{ item.start_time_slot }} - {{ item.end_time_slot }}</small>
                  </v-card-text>
                </v-card>
              </div>
            </v-timeline-item>
          </v-timeline>
        </div>
      </div>
    </template>
    <template #default>
      <Form @cancel="dialog = false" />
    </template>
  </v-dialog>

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
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import orderUtils from '@/utils/order';
import { useScheduleItemStore } from '@/stores/scheduleItem';
import Form from '@/components/delivery/DeliveryForm';
import { ref, computed, onMounted, onUnmounted, reactive } from 'vue';

let watcherId = null;
const theme = useTheme();
const dialog = ref(false);
const router = useRouter();
const startX = reactive({});
const swipeOffset = reactive({});
const isMouseDown = reactive({});
const locationError = ref(false);
const activeSwipeIndex = ref(null);
const scheduleItemStore = useScheduleItemStore();
const isMobile = mobile.setupMobileUtils();
const { list: orders, element: order, ready } = storeToRefs(scheduleItemStore);

const timelineOrders = computed(() => {
  if (!orders.value) return [];
  return orders.value.sort((a, b) => a.index - b.index);
});

const totOrder = computed(() => {
  if (!orders.value || !Array.isArray(orders.value)) return 0;

  return orders.value.filter(
    item => item.operation_type !== 'CollectionPoint'
  ).length;
});

const isCollectionPointCompleted = (item) => {
  const requiredCollectionPointIds = Object.values(item.products)
    .map(p => p.collection_point?.id)
    .filter(Boolean);

  const collectionPointItems = timelineOrders.value.filter(
    t =>
      t.operation_type === "CollectionPoint" &&
      requiredCollectionPointIds.includes(t.collection_point_id)
  );

  if (collectionPointItems.length === 0) return false;

  return collectionPointItems.every(cp => cp.completed === true);
}

const startSwipe = (e, index, isMouse = false) => {
  const clientX = isMouse ? e.clientX : e.touches[0].clientX;
  startX[index] = clientX;
  isMouseDown[index] = true;
};

const onSwipe = (e, index, isMouse = false) => {
  if (!isMouse && e.touches.length === 0) return;
  if (isMouse && !isMouseDown[index]) return;

  const clientX = isMouse ? e.clientX : e.touches[0].clientX;
  const delta = clientX - startX[index];
  swipeOffset[index] = Math.min(0, delta);
};

const endSwipe = (e, index) => {
  if (swipeOffset[index] < -50) {
    activeSwipeIndex.value = index;
    swipeOffset[index] = -120;
  } else {
    activeSwipeIndex.value = null;
    swipeOffset[index] = 0;
  }
  isMouseDown[index] = false;
};

const completeCollectionPoint = (item) => {
  http.postRequest(`schedule/item/${item.id}`, {
    completed: true
  }, () => {
    ready.value = false;
    scheduleItemStore.initList(router);
    activeSwipeIndex.value = null;
    swipeOffset[item.id] = 0;
  }, 'PUT', router);
};

const completeOrder = (item) => {
  order.value = item;
  dialog.value = true;

  activeSwipeIndex.value = null;
  swipeOffset[item.id] = 0;
};

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
        if (!ready.value) scheduleItemStore.initList(router);
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

.swipe-card-wrapper {
  position: relative;
  overflow: hidden;
}

.swipe-card-wrapper,
.swipe-card-wrapper * {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.swipe-card {
  transition: transform 0.3s ease;
  position: relative;
  z-index: 2;
}

.swipe-actions {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 120px;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1;
  transform: translateX(120px);
  transition: transform 0.3s ease;
}

.swipe-actions.active {
  transform: translateX(0);
}

.swipe-actions button {
  margin: 5px 0;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
