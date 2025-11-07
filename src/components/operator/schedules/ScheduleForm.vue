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
        <v-col cols="7">
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
              :items="availableOrders"
              :item-title="order => `ID ordine: ${order.id}`"
              item-value="id"
              append-icon="mdi-plus"
              dense
              @click="addOrder"
            />
            <draggable
              v-model="schedule.orders"
              item-key="id"
              class="mb-4"
              handle=".drag-handle"
            >
              <template #item="{ element }">
                <div class="d-flex align-center order-item">
                  <div
                    class="drag-handle"
                    style="cursor: grab;"
                  >
                    <v-icon>mdi-drag</v-icon>
                  </div>
                  <div
                    :class="['d-flex', 'justify-space-between', isMobile ? '' : 'align-center', isMobile ? 'flex-column' : '']"
                    style="width: 100%;"
                  >
                    <p>Ordine #{{ element.id }}</p>
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
                        :rules="validation.futureTime(element)" 
                        dense
                        hide-details 
                        :style="isMobile ? { width: '' }: { width: '200px' }"
                      />
                      <v-btn
                        variant="text"
                        icon="mdi-delete"
                        :color="theme.current.value.primaryColor"
                        @click="removeOrder(element.id)"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </draggable>
            <FormButtons
              :loading="loading"
              @cancel="emits('cancel')"
            />
          </v-form>
        </v-col>
        <v-col cols="5">
          <div style="height: 100%; border-radius: 12px; overflow: hidden;">
            <GoogleMap :orders="schedule.orders" />
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { useTheme } from 'vuetify';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import draggable from 'vuedraggable';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { ref, watch, computed } from 'vue';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useTransportStore } from '@/stores/transport';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import GoogleMap from '@/components/GoogleMap.vue';

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

console.log(schedule.value. orders)

const addUser = () => {
  if (!selectedUser.value) return;

  if (!schedule.value.users)
    schedule.value.users = [];
  schedule.value.users.push(selectedUser.value);
  selectedUser.value = null;
};

const removeUser = (userId) => {
  schedule.value.users = schedule.value.users.filter(u => u.id !== userId);
  if (!schedule.value.deleted_users)
    schedule.value.deleted_users = [];
  schedule.value.deleted_users.push(userId);
};

const addOrder = () => {
  const orderToAdd = orders.value.find(o => o.id === selectedOrderId.value);
  if (!orderToAdd) return;

  schedule.value.orders = schedule.value.orders?.length
    ? schedule.value.orders.map((order, index) => ({
        ...order,
        start_time_slot: order.start_time_slot || '',
        end_time_slot: order.end_time_slot || '',
        schedule_index: index
      }))
    : schedule.value.order_ids.map((id, index) => ({
        id,
        start_time_slot: '',
        end_time_slot: '',
        schedule_index: index
      }));
  selectedOrderId.value = null;
};

const removeOrder = (orderId) => {
  schedule.value.orders = schedule.value.orders.filter(o => o.id !== orderId);
  schedule.value.orders.forEach((o, i) => o.schedule_index = i);
  if (!schedule.value.deleted_orders)
    schedule.value.deleted_orders = [];
  schedule.value.deleted_orders.push(orderId);
};

const availableOrders = computed(() => {
  return orders.value
    .filter(o => o.status === 'Pending')
    .filter(o => !schedule.value.orders.some(so => so.id === o.id));
});

if (!schedule.value.id)
  schedule.value.orders = schedule.value.order_ids.map((id, index) => {
    return {
      id,
      start_time_slot: '',
      end_time_slot: '',
      schedule_index: index
    };
  });

watch(
  () => schedule.value.orders,
  (newOrders) => newOrders?.forEach((o, i) => o.schedule_index = i),
  { deep: true }
);

watch(() => schedule.value.date, () => {
  error.value.date = null;
});

watch(() => schedule.value.users, () => {
  error.value.user = null;
});


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
</script>

<style scoped>
.order-item {
  border-bottom: 1px solid #ccc;
  padding-bottom: 8px;
  margin-bottom: 8px;
}
.order-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
</style>
