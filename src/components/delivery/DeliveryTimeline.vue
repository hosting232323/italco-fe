<template>
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
            v-if="item.collection_point_id && !item.completed"
            @click="completeCollectionPoint(item)"
          >
            Completa punto di ritiro
          </button>
          <button
            v-if="item.completed"
          >
            Punto di ritiro completato
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
</template>

<script setup>
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import { useRouter } from 'vue-router';
import orderUtils from '@/utils/order';
import { useScheduleItemStore } from '@/stores/scheduleItem';
import { ref, computed, reactive } from 'vue';

const router = useRouter();
const startX = reactive({});
const swipeOffset = reactive({});
const isMouseDown = reactive({});
const activeSwipeIndex = ref(null);
const scheduleItemStore = useScheduleItemStore();
const isMobile = mobile.setupMobileUtils();
const { list: orders, element: order, ready, showForm } = storeToRefs(scheduleItemStore);

const timelineOrders = computed(() => {
  if (!orders.value) return [];
  return orders.value.slice().sort((a, b) => a.index - b.index);
});

const isCollectionPointCompleted = (item) => {
  const requiredCollectionPointIds = Object.values(item.products)
    .map(p => p.collection_point?.id)
    .filter(Boolean);

  const collectionPointItems = timelineOrders.value.filter(
    t =>
      t.operation_type === 'CollectionPoint' &&
      requiredCollectionPointIds.includes(t.collection_point_id)
  );

  if (collectionPointItems.length === 0) return false;

  return collectionPointItems.every(cp => cp.completed === true);
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

const completeOrder = (item) => {
  order.value = item;
  showForm.value = true;

  activeSwipeIndex.value = null;
  swipeOffset[item.id] = 0;
};

const timelineColor = order => {
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
