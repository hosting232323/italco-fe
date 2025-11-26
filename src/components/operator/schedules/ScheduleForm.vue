<template>
  <v-card
    v-if="!schedule.orders"
    title="Seleziona degli ordini per creare un Borderò"
  />
  <v-card
    v-else
    :title="schedule.id ? 'Modifica Borderò' : 'Crea Borderò'"
    :subtitle="schedule.id 
      ? `ID: ${schedule.id}\nOrdini: ${schedule.orders.map(order => order.id).join(', ')}` 
      : `Ordini: ${schedule.orders.map(order => order.id).join(', ')}`"
  >
    <v-card-text>
      <v-row>
        <v-col cols="12" md="7">
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
              :error-messages="error.user"
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
                  :error-messages="error.date"
                />
              </v-col>
            </v-row>
            <v-autocomplete
              v-if="schedule.id"
              v-model="selectedOrderId"
              label="Aggiungi Ordine"
              :items="orders.value.filter(order => order.status === 'Pending').filter(order =>
                !schedule.schedule_items.filter(collectionPoint => collectionPoint.operation_type == 'Order')
                  .some(scheduleOrder => scheduleOrder.id === order.id)
              )"
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
                <v-row no-gutters class="mt-2">
                  <v-col cols="1">
                    <div
                      class="drag-handle"
                      style="cursor: grab;"
                    >
                      <v-icon>mdi-drag</v-icon>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <p>{{ element.index + 1 }}: 
                    {{ element.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro' }} ID {{ element.id }}</p>
                  </v-col>
                  <v-col cols="6">
                    <div :class="['d-flex', 'align-center', isMobile ? 'flex-column' : '']">
                      <v-text-field 
                        v-model="element.start_time_slot" 
                        label="Time Slot Start"
                        type="time"
                        :rules="validation.requiredRules" 
                        dense
                        hide-details 
                        :style="isMobile ? { margin: '15px 0', width: '' }: { width: '200px', marginRight: '15px' }"
                      />
                      <v-text-field 
                        v-model="element.end_time_slot" 
                        label="Time Slot End"
                        type="time"
                        :rules="validation.futureTime(element.start_time_slot)" 
                        dense
                        hide-details 
                        :style="isMobile ? { width: '' }: { width: '200px' }"
                      />
                    </div>
                  </v-col>
                  <v-col cols="1">
                    <v-btn
                      v-if="element.type === 'Delivery'"
                      variant="text"
                      icon="mdi-delete"
                      :color="theme.current.value.primaryColor"
                      @click="removeOrder(element.id)"
                    />
                  </v-col>
                </v-row>
              </template>
            </draggable>
            <FormButtons
              :loading="loading"
              @cancel="emits('cancel')"
            />
          </v-form>
        </v-col>
        <v-col cols="12" md="5">
          <div style="height: 100%; border-radius: 12px; overflow: hidden;">
            <GoogleMap v-if="schedule.schedule_items && schedule.schedule_items.length > 0"/>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import GoogleMap from '@/components/GoogleMap.vue';
import FormButtons from '@/components/FormButtons';

import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { ref, watch, onMounted } from 'vue';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const form = ref(null);
const theme = useTheme();
const router = useRouter();
const loading = ref(false);
const selectedUser = ref(null);
const selectedOrderId = ref(null);
const orderStore = useOrderStore();
const emits = defineEmits(['cancel']);
const scheduleStore = useScheduleStore();
const transportStore = useTransportStore();
const isMobile = mobile.setupMobileUtils();
const error = ref({user: null, date: null});
const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore, router);
const administrationUserStore = useAdministrationUserStore();
const transports = storesUtils.getStoreList(transportStore, router);
const users = storesUtils.getStoreList(administrationUserStore, router);

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
  const orderToAdd = orders.value.find(o => o.id === selectedOrderId.value);
  if (!orderToAdd) return;

  if (
    !schedule.value.schedule_items.filter(scheduleItem => scheduleItem.operation_type == 'Collection Point')
      .map(collectionPoint => collectionPoint.id).includes(orderToAdd.collection_point.id)
  )
    schedule.value.schedule_items.push(createScheduleItem(
      orderToAdd.collection_point, 'CollectionPoint', schedule.value.schedule_items.length
    ));

  schedule.value.schedule_items.push(createScheduleItem(
    orderToAdd, 'Order', schedule.value.schedule_items.length
  ));
  selectedOrderId.value = null;
};

const removeOrder = (orderId) => {
  schedule.value.orders = schedule.value.orders.filter(o => o.id !== orderId);
  if (!schedule.value.deleted_orders) schedule.value.deleted_orders = [];
  schedule.value.deleted_orders.push(orderId);
  schedule.value.schedule_items = schedule.value.schedule_items.filter(item => item.id !== orderId);
};

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  if (!schedule.value.users || schedule.value.users.length == 0){
    error.value.user = 'Aggiungi prima l\'utente';
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
    error.value.date = data.error;
};

const createScheduleItem = (element, type, index = undefined) => {
  const item = {
    ...element,
    end_time_slot: '',
    start_time_slot: '',
    operation_type: type
  };
  if (index) item.index = index;
  return item;
};

onMounted(() => {
  if (!schedule.value.id) {
    const collectionPoints = [];
    const orders = schedule.value.orders.map(order => {
      if (!collectionPoints.map(collectionPoint => collectionPoint.id).includes(order.collection_point.id))
        collectionPoints.push(createScheduleItem(order.collection_point, 'CollectionPoint'));
      return createScheduleItem(order, 'Order');
    });
    schedule.value.schedule_items = collectionPoints.concat(orders).map((scheduleItem, index) => {
      return {...scheduleItem, index};
    });
  }

  schedule.value.schedule_items.sort((a, b) => a.index - b.index);
});

watch(
  () => schedule.value.schedule_items,
  (newItems) => newItems?.forEach((item, index) => item.index = index),
  { deep: true }
);


watch(() => schedule.value.date, () => {
  error.value.date = null;
});

watch(() => schedule.value.users, () => {
  error.value.user = null;
});
</script>
