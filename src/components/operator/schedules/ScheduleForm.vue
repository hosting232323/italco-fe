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
          :items="availableUsers"
          item-title="nickname"
          append-icon="mdi-plus"
          return-object
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
              :error-messages="error"
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
const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore, router);
const administrationUserStore = useAdministrationUserStore();
const transports = storesUtils.getStoreList(transportStore, router);
const users = storesUtils.getStoreList(administrationUserStore, router);

const addUser = () => {
  if (!selectedUser.value) return;
  schedule.value.users.push(selectedUser.value);
  selectedUser.value = null;
};

const availableUsers = computed(() => {
  return users.value.filter(
    (u) => 
      u.role === 'Delivery' &&
      !schedule.value.users.some(su => su.email === u.email)
  );
});

const removeUser = (userId) => {
  schedule.value.users = schedule.value.users.filter(u => u.id !== userId);
};

const addOrder = () => {
  const orderToAdd = orders.value.find(o => o.id === selectedOrderId.value);
  if (!orderToAdd) return;

  schedule.value.orders.push({
    id: orderToAdd.id,
    start_time_slot: '',
    end_time_slot: '',
    schedule_index: schedule.value.orders.length
  });
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

if (!schedule.value.users) {
  schedule.value.users = [];
}

watch(
  () => schedule.value.orders,
  (newOrders) => newOrders?.forEach((o, i) => o.schedule_index = i),
  { deep: true }
);

watch(() => schedule.value.date, () => {
  error.value = null;
});

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (schedule.value.id)
    scheduleStore.updateElement(router, handleResponse);
  else
    scheduleStore.createElement(router, handleResponse);
};

const handleResponse = (data) => {
  loading.value = false;
  if (data.status == 'ok') {
    orderStore.initList(router);
    scheduleStore.initList(router);
    schedule.value = {};
    emits('cancel');
  } else 
    error.value = data.error;
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
