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
              :items="orders.filter(order => order.status === 'New' &&
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
                <v-row
                  no-gutters
                  class="mt-2"
                >
                  <v-col cols="1">
                    <div
                      class="drag-handle"
                      style="cursor: grab;"
                    >
                      <v-icon>mdi-drag</v-icon>
                    </div>
                  </v-col>
                  <v-col cols="4">
                    <p>
                      {{ element.index + 1 }}: 
                      {{ element.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro' }}
                      ID {{ element.operation_type == 'Order' ? element.order_id : element.collection_point_id }}
                    </p>
                    <p style="font-size: smaller; padding-right: 5px;">
                      {{ element.address }}, {{ element.cap }}
                    </p>
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
                      v-if="element.operation_type === 'Order' &&
                        schedule.schedule_items.filter(item => item.operation_type == 'Order').length > 1"
                      variant="text"
                      icon="mdi-delete"
                      :color="theme.current.value.primaryColor"
                      @click="removeOrder(element)"
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
        <v-col
          cols="12"
          md="5"
        >
          <div style="height: 100%; border-radius: 12px; overflow: hidden;">
            <!-- <GoogleMap v-if="schedule.schedule_items && schedule.schedule_items.length > 0" /> -->
            <FreeMap v-if="schedule.schedule_items && schedule.schedule_items.length > 0" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
// import GoogleMap from '@/components/GoogleMap.vue';
import FreeMap from '@/components/FreeMap.vue';
import FormButtons from '@/components/FormButtons';

import { ref, watch } from 'vue';
import { useTheme } from 'vuetify';
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
const administrationUserStore = useAdministrationUserStore();

const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore, router);
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

const removeOrder = (order) => {
  const remainingItems = schedule.value.schedule_items.filter(
    item => !(item.operation_type === 'Order' && item.order_id === order.order_id));

  const usedCollectionPointIds = new Set(remainingItems.filter(item => item.operation_type === 'Order')
    .flatMap(item => Object.values(item.products).map(product => product.collection_point.id)));

  const removedOrderCollectionPointIds = new Set(Object.values(order.products).map(product => product.collection_point.id));

  schedule.value.schedule_items = remainingItems.filter(item =>
    item.operation_type !== 'CollectionPoint' ||
    usedCollectionPointIds.has(item.collection_point_id) ||
    !removedOrderCollectionPointIds.has(item.collection_point_id)
  );
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
