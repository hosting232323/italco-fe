<template>
  <v-timeline
    v-if="ready"
    align="start"
    side="end"
    :style="{ marginLeft: isMobile ? '-30px' : '' }"
  >
    <v-timeline-item
      v-for="(item, index) in timelineScheduleItems"
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
            v-if="item.collection_point_id && !item.completed"
            :style="{ color: theme.current.value.primaryColor }"
            @click="completeCollectionPoint(item)"
          >
            Completa punto di ritiro
          </button>
          <button
            v-else-if="item.completed"
            style="cursor: default;"
            :style="{ color: theme.current.value.primaryColor }"
          >
            Punto di ritiro completato
          </button>
          <div
            v-else-if="!item.collection_point_id"
            class="d-flex flex-column align-center justify-center"
          >
            <button
              v-for="statusOption in getAvailableStatuses(item)"
              :key="statusOption"
              :style="{ color: theme.current.value.primaryColor }"
              @click="completeOrder(item, statusOption)"
            >
              {{ getStatusLabel(statusOption) }}
            </button>
          </div>
          <button
            v-else
            style="cursor: default;"
          >
            Completa prima il punto di ritiro
          </button>
        </div>
        <v-card :style="{ maxWidth: isMobile ? '200px' : '1000px' }">
          <v-card-text>
            <span v-if="item.collection_point_id">
              <b>Punto di ritiro</b><br><br>
              <div
                class="products-container"
                :style="{ flexDirection: isMobile ? 'column' : ''}"
              >
                <div :style="{ width: isMobile ? '100%' : '50%'}">
                  <b>Nome</b>: <br> {{ item.name || 'N/A' }}<br><br>
                </div>
                <div :style="{ width: isMobile ? '100%' : '50%'}">
                  <b>Indirizzo</b>: <br> {{ item.address || 'N/A' }}, {{ item.cap || 'N/A' }}<br><br>
                </div>
              </div>
            </span>
            <span v-else>
              <b>Ordine #{{ item.id }}</b><br><br>
              <b>Destinatario:</b> {{ item.addressee || item.name }}<br>
              <span>
                {{ item.address || 'N/A' }}, {{ item.cap || 'N/A' }}
              </span><br><br>
              <div
                class="products-container"
                :style="{ flexDirection: isMobile ? 'column' : ''}"
              >
                <div :style="{ width: isMobile ? '100%' : '50%'}">
                  <b>Prodotti e Servizi:</b>
                  <div
                    v-for="(product, productName) in item.products"
                    :key="productName"
                  >
                    <p>
                      <b>{{ productName }}</b>:
                      {{ product.services?.join(', ') || 'N/A' }}
                    </p>
                  </div>
                </div>
                <div :style="{ width: isMobile ? '100%' : '50%'}">
                  <b>Stato:</b> {{ orderUtils.LABELS.find(label => label.value == item.status)?.title }}<br>
                  <b>Tipo:</b> {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}<br><br>
                  <b>Punti di Ritiro:</b>
                  <div style="font-size: smaller;">
                    {{ [...new Set(Object.values(item.products).map(
                      product => scheduleItems.find(
                        scheduleItem => scheduleItem.collection_point_id == product.collection_point.id
                      ).name
                    ))].join(', ') }}
                  </div>
                </div>
              </div>
              <br>
              <b>Note Punto Vendita:</b> {{ item.customer_note || '-' }}<br>
              <b>Note Operatori:</b> {{ item.operator_note || '-' }}<br><br>
            </span>
            <small>Slot: {{ item.start_time_slot }} - {{ item.end_time_slot }}</small>
          </v-card-text>
        </v-card>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup>
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import orderUtils from '@/utils/order';
import { ref, computed, reactive } from 'vue';
import { useOrderStore } from '@/stores/order';
import { useScheduleItemStore } from '@/stores/scheduleItem';

const theme = useTheme();
const router = useRouter();
const startX = reactive({});
const swipeOffset = reactive({});
const isMouseDown = reactive({});
const activeSwipeIndex = ref(null);
const isMobile = mobile.setupMobileUtils();

const orderStore = useOrderStore();
const scheduleItemStore = useScheduleItemStore();
const { element: order } = storeToRefs(orderStore);
const { list: scheduleItems, ready, showForm } = storeToRefs(scheduleItemStore);

const STATUS_MAP = {
  'Scheduled': ['Booking', 'Not Delivered', 'At Warehouse', 'To Reschedule'],
  'Booking': ['Delivered', 'Not Delivered', 'At Warehouse', 'To Reschedule'],
  'At Warehouse': ['Booking', 'To Reschedule']
};

const timelineScheduleItems = computed(() => {
  if (!scheduleItems.value) return [];
  return scheduleItems.value.slice().sort((a, b) => a.index - b.index);
});

const getAvailableStatuses = (item) => {
  if (!STATUS_MAP[item.status]) return [];

  return STATUS_MAP[item.status];
};

const getStatusLabel = (status) => {
  return orderUtils.LABELS.find(l => l.value === status)?.title || status;
};

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

const completeOrder = (item, status) => {
  order.value = item;
  order.value.status = status;
  showForm.value = true;
  activeSwipeIndex.value = null;
  swipeOffset[item.id] = 0;
};

const timelineColor = (order) => {
  if (order.completed) return 'green';
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

const timelineIcon = (order) => {
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
</script>

<style scoped>
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

.products-container {
  display: flex;
  gap: 20px;
}
</style>
