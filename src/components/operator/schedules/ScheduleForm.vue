<template>
  <v-card
    v-if="!schedule.id && !schedule.orders && !schedule.schedulation"
    title="Seleziona degli ordini per creare un Borderò"
  />
  <v-card
    v-else
    :title="schedule.id ? 'Modifica Borderò' : 'Crea Borderò'"
    :subtitle="(schedule.id ? `ID: ${schedule.id} - ` : '') + 'Ordini: ' +
      schedule.schedule_items.flatMap(item => item.operation_type === 'Order' ? [item.order_id] : []).join(', ')"
  >
    <v-card-text>
      <v-row>
        <v-col
          cols="12"
          md="7"
        >
          <v-form
            ref="form"
            @submit.prevent="submitForm"
          >
            <v-chip
              v-for="user in schedule.users"
              :key="user.id"
              class="mr-2 mb-5"
              append-icon="mdi-close-circle"
              @click="removeUser(user.id)"
            >
              {{ user.nickname }}
            </v-chip>
            <v-autocomplete
              v-model="selectedUser"
              label="Utenti"
              :items="users.filter(
                (u) => u.role === 'Delivery' && (!schedule.users || !schedule.users.some(su => su.nickname === u.nickname))
              )"
              item-title="nickname"
              append-icon="mdi-plus"
              return-object
              :error-messages="error"
              @click:append="addUser"
            />
            <v-row no-gutters>
              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="schedule.transport_id"
                  :class="isMobile ? '' : 'mr-2'"
                  label="Veicolo"
                  :items="transports"
                  item-title="name"
                  item-value="id"
                  :rules="validation.requiredRules"
                />
              </v-col>
              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="schedule.date"
                  type="date"
                  :class="isMobile ? '' : 'ml-2'"
                  label="Data"
                  :rules="validation.requiredRules"
                />
              </v-col>
            </v-row>
            <v-autocomplete
              v-model="selectedOrderId"
              label="Aggiungi Ordine"
              :items="orders.filter(order => order.status === 'Acquired' &&
                !schedule.schedule_items.some(item => item.operation_type === 'Order' && item.order_id === order.id))"
              :item-title="order => `ID ordine: ${order.id}`"
              item-value="id"
              append-icon="mdi-plus"
              dense
              @click="addOrder"
            />
            <draggable
              v-model="schedule.schedule_items"
              item-key="id"
              class="mb-4"
              handle=".drag-handle"
            >
              <template #item="{ element }">
                <ScheduleItem
                  :index="element.index"
                  :not-found-addresses="notFoundAddresses"
                />
              </template>
            </draggable>
            <FormButtons
              :loading="loading"
              @cancel="emits('cancel')"
            />
          </v-form>
        </v-col>
        <v-col
          cols="12"
          md="5"
        >
          <div style="height: 100%; border-radius: 12px; overflow: hidden;">
            <OverStreetMap
              v-if="schedule.schedule_items && schedule.schedule_items.length > 0"
              @not-found-addresses="handleNotFound"
            />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import OverStreetMap from '@/components/OverStreetMap.vue';
import ScheduleItem from '@/components/operator/schedules/ScheduleItem.vue';

import { ref, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const error = ref(null);
const router = useRouter();
const loading = ref(false);
const selectedUser = ref(null);
const notFoundAddresses = ref([]);
const selectedOrderId = ref(null);
const emits = defineEmits(['cancel']);
const isMobile = mobile.setupMobileUtils();

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const transportStore = useTransportStore();
const administrationUserStore = useAdministrationUserStore();
const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore, router);
const transports = storesUtils.getStoreList(transportStore, router);
const users = storesUtils.getStoreList(administrationUserStore, router);

const handleNotFound = (addresses) => {
  notFoundAddresses.value = addresses;
};

const addUser = () => {
  if (!selectedUser.value) return;

  if (!schedule.value.users)
    schedule.value.users = [];
  schedule.value.users.push(selectedUser.value);
  selectedUser.value = null;
};

const removeUser = (userId) => {
  schedule.value.users = schedule.value.users.filter(u => u.id !== userId);
  if (schedule.value.id) {
    if (!schedule.value.deleted_users)
      schedule.value.deleted_users = [];
    schedule.value.deleted_users.push(userId);
  }
};

const addOrder = () => {
  const orderToAdd = orders.value.find(order => order.id === selectedOrderId.value);
  if (!orderToAdd) return;

  Object.values(orderToAdd.products).forEach((product) => {
    if (
      !schedule.value.schedule_items.some(collectionPoint =>
        collectionPoint.operation_type === 'CollectionPoint' && collectionPoint.collection_point_id === product.collection_point.id)
    )
      schedule.value.schedule_items.push(createScheduleItem(
        product.collection_point, 'CollectionPoint', schedule.value.schedule_items.length
      ));
  });

  schedule.value.schedule_items.push(createScheduleItem(
    orderToAdd, 'Order', schedule.value.schedule_items.length
  ));
  selectedOrderId.value = null;
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  if (!schedule.value.users || schedule.value.users.length == 0){
    error.value = 'Aggiungi prima l\'utente';
    return;
  }

  loading.value = true;
  if (schedule.value.id)
    scheduleStore.updateElement(router, callback);
  else
    scheduleStore.createElement(router, callback);
};

const callback = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    orderStore.initList(router);
    scheduleStore.initList(router);
    schedule.value = {};
    emits('cancel');
  } else 
    error.value = data.error;
};

const createScheduleItem = (element, type, index = undefined) => {
  const item = {
    ...element,
    end_time_slot: '',
    start_time_slot: '',
    operation_type: type
  };
  if (index) item.index = index;
  delete item.id;
  if (type == 'Order') item.order_id = element.id;
  else item.collection_point_id = element.id;
  return item;
};

watch(
  () => schedule.value.schedule_items,
  (newItems) => newItems?.forEach((item, index) => item.index = index),
  { deep: true }
);

watch(() => schedule.value.users, () => {
  error.value = null;
});
</script>
