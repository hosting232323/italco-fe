<template>
  <v-card title="Pianificazione Automatica">
    <v-card-text>
      <v-form
        ref="dpcForm"
        @submit.prevent="submitDpcForm"
      >
        <DateField 
          v-model="booking_date"
          label="Data Consegna"
          :rules="validation.requiredRules"
          :allowed-dates="days.getDateRangeArray()"
        />
        <v-row no-gutters>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="minSizeGroup"
              type="number"
              label="Dimensione minima gruppo"
              :rules="validation.minGroupSizeRule(maxSizeGroup)"
              :class="isMobile ? '' : 'mr-2'"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="maxSizeGroup"
              type="number"
              :rules="validation.maxGroupSizeRule(minSizeGroup)"
              label="Dimensione massima gruppo"
              :class="isMobile ? '' : 'mr-2 ml-2'"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="maxDistanceKm"
              type="number"
              label="Massima distanza (KM)"
              :class="isMobile ? '' : 'ml-2'"
            />
          </v-col>
        </v-row>
        <FormButtons
          :loading="loading"
          class="mb-5"
          @cancel="emits('cancel')"
        />
      </v-form>
      <v-alert
        v-if="message"
        class="mt-5 mb-5"
      >
        {{ message }}
      </v-alert>
      <v-row>
        <v-col
          v-for="(suggestion, index) in suggestions"
          :key="index"
          cols="12"
          md="4"
        >
          <v-card
            :color="theme.current.value.primaryColor"
            :title="`Proposta Borderò ${index + 1}`"
          >
            <template #append>
              <v-btn
                icon="mdi-open-in-new"
                variant="text"
                @click="openSchedule(suggestion)"
              />
            </template>
            <v-card-text>
              <v-list style="border-radius: 5px;">
                <p class="ml-4">
                  Punti di Ritiro:
                </p>
                <v-list-item
                  v-for="item in getScheduleItemsByType(suggestion, 'CollectionPoint')"
                  :key="item.collection_point_id"
                >
                  <v-list-item-title class="no-truncate">
                    ID {{ item.collection_point_id }}: {{ item.address }} ({{ item.cap }})
                  </v-list-item-title>
                </v-list-item>
                <v-divider />
                <p class="ml-4 mt-4">
                  Ordini:
                </p>
                <draggable
                  v-model="suggestion.orders"
                  :group="{ name: 'orders', pull: true, put: true }"
                  item-key="order_id"
                  class="draggable-order-list ml-3 mr-3"
                  ghost-class="draggable-ghost"
                  @change="syncSuggestionsAfterOrderMove"
                >
                  <template #item="{ element }">
                    <v-list-item
                      class="draggable-order-item mb-2"
                      prepend-icon="mdi-drag"
                      rounded="lg"
                    >
                      <v-list-item-title class="no-truncate">
                        ID {{ element.order_id }}: {{ element.address }} ({{ element.cap }})
                      </v-list-item-title>
                    </v-list-item>
                  </template>
                  <template #footer>
                    <div
                      v-if="suggestion.orders.length === 0"
                      class="text-medium-emphasis pa-3"
                    >
                      Trascina qui un ordine
                    </div>
                  </template>
                </draggable>
                <v-divider />
                <p class="ml-4 mt-4">
                  Utenti Delivery:
                </p>
                <draggable
                  v-model="suggestion.delivery_users"
                  :group="{ name: 'users', pull: false, put: 'users' }"
                  item-key="id"
                  class="draggable-area ml-3 mr-3"
                >
                  <template #item="{ element }">
                    <v-chip
                      :text="element.nickname"
                      closable
                      class="mr-2 mt-2"
                      @click:close="suggestion.delivery_users = suggestion.delivery_users.filter(
                        user => user.id !== element.id
                      )"
                    />
                  </template>
                </draggable>
                <v-divider class="mt-4 mb-4" />
                <p class="ml-4 mt-4">
                  Veicolo:
                </p>
                <draggable
                  v-model="suggestion.transports"
                  :group="{ 
                    name: 'transports', 
                    pull: false, 
                    put: (to, from) =>
                      from.options.group.name === 'transports' &&
                      suggestion.transports.length === 0 
                  }"
                  item-key="id"
                  class="draggable-area ml-3 mr-3"
                >
                  <template #item="{ element }">
                    <v-chip
                      :text="element.name"
                      closable
                      class="mr-2 mt-2"
                      @click:close="suggestion.transports = []"
                    />
                  </template>
                </draggable>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <template v-if="availableDeliveryUsers.length > 0">
        <h2 class="mt-5">
          Utenti disponibili
        </h2>
        <draggable
          :list="availableDeliveryUsers"
          :group="{ name: 'users', pull: 'clone', put: false }"
          :clone="cloneUser"
          item-key="id"
        >
          <template #item="{ element }">
            <v-chip
              :text="element.nickname"
              class="ma-1"
              draggable
            />
          </template>
        </draggable>
      </template>
      <template v-if="availableTransports.length > 0">
        <h2 class="mt-5">
          Veicoli disponibili
        </h2>
        <draggable
          :list="availableTransports"
          :group="{ name: 'transports', pull: 'clone', put: false }"
          :clone="cloneTransport"
          item-key="id"
        >
          <template #item="{ element }">
            <v-chip
              :text="element.name"
              class="ma-1"
              draggable
            />
          </template>
        </draggable>
      </template>
    </v-card-text>
  </v-card>
</template>

<script setup>
import DateField from '@/components/DateField';
import FormButtons from '@/components/FormButtons';

import http from '@/utils/http';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useScheduleStore } from '@/stores/schedule';

const message = ref('');
const theme = useTheme();
const dpcForm = ref(null);
const loading = ref(false);
const router = useRouter();
const transports = ref([]);
const suggestions = ref([]);
const minSizeGroup = ref(10);
const maxSizeGroup = ref(14);
const maxDistanceKm = ref(50);
const deliveryUsers = ref([]);
const booking_date = ref(null);
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['cancel', 'goToSheduleForm']);

const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);

const cloneUser = (user) => {
  return { ...user };
};
const cloneTransport = (transport) => {
  return { ...transport };
}; 

const getScheduleItemsByType = (suggestion, operationType) => {
  return suggestion.schedule_items?.filter(item => item.operation_type === operationType) ?? [];
};

const DEFAULT_START_TIME_SLOT = '08:00';
const DEFAULT_END_TIME_SLOT = '09:00';

const normalizeScheduleItem = (item, operationType = item.operation_type) => {
  const normalizedItem = {
    ...item,
    end_time_slot: item.end_time_slot || DEFAULT_END_TIME_SLOT,
    start_time_slot: item.start_time_slot || DEFAULT_START_TIME_SLOT,
    operation_type: operationType
  };

  if (operationType === 'Order')
    normalizedItem.order_id = item.order_id ?? item.id;
  else
    normalizedItem.collection_point_id = item.collection_point_id ?? item.id;

  delete normalizedItem.id;

  return normalizedItem;
};

const createCollectionPointScheduleItem = (collectionPoint) => {
  return normalizeScheduleItem(collectionPoint, 'CollectionPoint');
};

const syncSuggestionScheduleItems = (suggestion) => {
  const existingCollectionPoints = getScheduleItemsByType(suggestion, 'CollectionPoint');
  const collectionPointItemsById = new Map(
    existingCollectionPoints.map(item => [item.collection_point_id, item])
  );
  const collectionPoints = [];
  const usedCollectionPointIds = new Set();

  suggestion.orders.forEach((order) => {
    Object.values(order.products ?? {}).forEach((product) => {
      const collectionPoint = product.collection_point;
      const collectionPointId = collectionPoint?.id ?? collectionPoint?.collection_point_id;

      if (!collectionPointId || usedCollectionPointIds.has(collectionPointId)) return;

      usedCollectionPointIds.add(collectionPointId);
      collectionPoints.push(
        collectionPointItemsById.get(collectionPointId) ??
        createCollectionPointScheduleItem(collectionPoint)
      );
    });
  });

  suggestion.schedule_items = [...collectionPoints, ...suggestion.orders].map((item, index) => ({
    ...normalizeScheduleItem(item),
    index
  }));
};

const normalizeSuggestion = (suggestion) => {
  const normalizedSuggestion = {
    ...suggestion,
    orders: getScheduleItemsByType(suggestion, 'Order').map(
      order => normalizeScheduleItem(order, 'Order')
    )
  };

  syncSuggestionScheduleItems(normalizedSuggestion);

  return normalizedSuggestion;
};

const syncSuggestionsAfterOrderMove = () => {
  suggestions.value.forEach(syncSuggestionScheduleItems);
};

const submitDpcForm = async () => {
  if (!(await dpcForm.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  http.getRequest('schedule/suggestions', {
    booking_date: booking_date.value,
    min_size_group: minSizeGroup.value,
    max_size_group: maxSizeGroup.value,
    max_distance_km: maxDistanceKm.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      suggestions.value = data.groups.map(normalizeSuggestion);
      transports.value = data.transports;
      deliveryUsers.value = data.delivery_users;
    } else
      message.value = data.error;
  }, 'GET', router);
};

const openSchedule = (suggestion) => {
  schedule.value.date = booking_date.value;
  schedule.value.schedulation = true;
  schedule.value.users = suggestion.delivery_users;
  schedule.value.schedule_items = suggestion.schedule_items;
  schedule.value.transport_id = suggestion.transports.length ? suggestion.transports[0].id : null;
  emits('goToSheduleForm');
};

const availableDeliveryUsers = computed(() => {
  const assignedIds = new Set(
    suggestions.value.flatMap(
      suggestion => suggestion.delivery_users?.map(user => user.id) ?? []
    )
  );

  return deliveryUsers.value.filter(user => !assignedIds.has(user.id));
});

const availableTransports = computed(() => {
  const assignedIds = new Set(
    suggestions.value.flatMap(
      suggestion => suggestion.transports?.map(transport => transport.id) ?? []
    )
  );

  return transports.value.filter(t => !assignedIds.has(t.id));
});
</script>

<style scoped>
.no-truncate {
  white-space: normal !important;
  overflow: visible !important;
  text-overflow: unset !important;
}

.draggable-area {
  min-height: 30px;
  display: flex;
  flex-wrap: wrap;
}

.draggable-order-list {
  min-height: 56px;
}

.draggable-order-item {
  border: 1px dashed rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.draggable-ghost {
  opacity: 0.5;
}

.v-chip {
  cursor: grab;
}

/* eslint-disable-next-line vue-scoped-css/no-unused-selector */
.v-chip:active {
  cursor: grabbing;
}
</style>
