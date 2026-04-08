<template>
  <v-card title="Pianificazione Automatica">
    <v-card-text>
      <v-form
        ref="dpcForm"
        @submit.prevent="submitDpcForm"
      >
        <DateField
          v-model="work_date"
          label="Data Work"
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
          :submit-text="suggestions.length > 0 ? 'Aggiorna' : 'Invia'"
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
      <SchedulationProposals
        :suggestions="suggestions"
        :new-suggestion-orders="newSuggestionOrders"
        :available-delivery-users="availableDeliveryUsers"
        :available-transports="availableTransports"
        :primary-color="theme.current.value.primaryColor"
        @update:new-suggestion-orders="newSuggestionOrders = $event"
        @create-suggestion="createSuggestionFromDroppedOrder"
        @orders-changed="syncSuggestionsAfterOrderMove"
        @open-schedule="openSchedule"
      />
    </v-card-text>
  </v-card>
</template>

<script setup>
import DateField from '@/components/DateField';
import FormButtons from '@/components/FormButtons';
import SchedulationProposals from '@/components/operator/schedules/SchedulationProposals.vue';

import http from '@/utils/http';
import days from '@/utils/days';
import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useScheduleStore } from '@/stores/schedule';

const message = ref('');
const theme = useTheme();
const dpcForm = ref(null);
const loading = ref(false);
const router = useRouter();
const transports = ref([]);
const work_date = ref(null);
const suggestions = ref([]);
const minSizeGroup = ref(10);
const maxSizeGroup = ref(14);
const maxDistanceKm = ref(50);
const deliveryUsers = ref([]);
const newSuggestionOrders = ref([]);
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['cancel', 'goToSheduleForm']);

const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);

const DEFAULT_START_TIME_SLOT = '08:00';
const DEFAULT_END_TIME_SLOT = '09:00';

const normalizeScheduleItem = (item, operationType = item.operation_type) => {
  const normalizedItem = {
    ...item,
    end_time_slot: item.end_time_slot || DEFAULT_END_TIME_SLOT,
    start_time_slot: item.start_time_slot || DEFAULT_START_TIME_SLOT,
    operation_type: operationType,
  };

  if (operationType === 'Order')
    normalizedItem.order_id = item.order_id ?? item.id;
  else normalizedItem.collection_point_id = item.collection_point_id ?? item.id;

  delete normalizedItem.id;

  return normalizedItem;
};

const createCollectionPointScheduleItem = (collectionPoint) => {
  return normalizeScheduleItem(collectionPoint, 'CollectionPoint');
};

const getScheduleItemsByType = (suggestion, operationType) => {
  return (
    suggestion.schedule_items?.filter(
      (item) => item.operation_type === operationType,
    ) ?? []
  );
};

const syncSuggestionScheduleItems = (suggestion) => {
  const existingCollectionPoints = getScheduleItemsByType(
    suggestion,
    'CollectionPoint',
  );
  const collectionPointItemsById = new Map(
    existingCollectionPoints.map((item) => [item.collection_point_id, item]),
  );
  const collectionPoints = [];
  const usedCollectionPointIds = new Set();

  suggestion.orders.forEach((order) => {
    Object.values(order.products ?? {}).forEach((product) => {
      const collectionPoint = product.collection_point;
      const collectionPointId =
        collectionPoint?.id ?? collectionPoint?.collection_point_id;

      if (!collectionPointId || usedCollectionPointIds.has(collectionPointId))
        return;

      usedCollectionPointIds.add(collectionPointId);
      collectionPoints.push(
        collectionPointItemsById.get(collectionPointId) ??
          createCollectionPointScheduleItem(collectionPoint),
      );
    });
  });

  suggestion.schedule_items = [...collectionPoints, ...suggestion.orders].map(
    (item, index) => ({
      ...normalizeScheduleItem(item),
      index,
    }),
  );
};

const normalizeSuggestion = (suggestion) => {
  const normalizedSuggestion = {
    ...suggestion,
    orders: getScheduleItemsByType(suggestion, 'Order').map((order) =>
      normalizeScheduleItem(order, 'Order'),
    ),
  };

  syncSuggestionScheduleItems(normalizedSuggestion);

  return normalizedSuggestion;
};

const syncSuggestionsAfterOrderMove = () => {
  suggestions.value.forEach(syncSuggestionScheduleItems);
  suggestions.value = suggestions.value.filter((s) => s.orders.length > 0);
};

const createSuggestion = (orders = []) => {
  const suggestion = {
    delivery_users: [],
    transports: [],
    schedule_items: [],
    orders: orders.map((order) => normalizeScheduleItem(order, 'Order')),
  };

  syncSuggestionScheduleItems(suggestion);

  return suggestion;
};

const createSuggestionFromDroppedOrder = (event) => {
  if (!event.added?.element) return;

  suggestions.value.push(createSuggestion([event.added.element]));
  newSuggestionOrders.value = [];
  syncSuggestionsAfterOrderMove();
};

const submitDpcForm = async () => {
  if (!(await dpcForm.value.validate()).valid) return;

  message.value = '';
  loading.value = true;
  http.getRequest(
    'schedule/suggestions',
    {
      work_date: work_date.value,
      min_size_group: minSizeGroup.value,
      max_size_group: maxSizeGroup.value,
      max_distance_km: maxDistanceKm.value,
    },
    function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        suggestions.value = data.groups.map(normalizeSuggestion);
        newSuggestionOrders.value = [];
        transports.value = data.transports;
        deliveryUsers.value = data.delivery_users;
      } else message.value = data.error;
    },
    'GET',
    router,
  );
};

const openSchedule = (suggestion) => {
  schedule.value.date = work_date.value;
  schedule.value.schedulation = true;
  schedule.value.users = suggestion.delivery_users;
  schedule.value.schedule_items = suggestion.schedule_items;
  schedule.value.transport_id = suggestion.transports.length
    ? suggestion.transports[0].id
    : null;
  emits('goToSheduleForm');
};

const availableDeliveryUsers = computed(() => {
  const assignedIds = new Set(
    suggestions.value.flatMap(
      (suggestion) => suggestion.delivery_users?.map((user) => user.id) ?? [],
    ),
  );

  return deliveryUsers.value.filter((user) => !assignedIds.has(user.id));
});

const availableTransports = computed(() => {
  const assignedIds = new Set(
    suggestions.value.flatMap(
      (suggestion) =>
        suggestion.transports?.map((transport) => transport.id) ?? [],
    ),
  );

  return transports.value.filter((t) => !assignedIds.has(t.id));
});
</script>
