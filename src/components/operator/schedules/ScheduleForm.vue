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
              v-model="schedule.schedule_items"
              item-key="id"
              class="mb-4"
              handle=".drag-handle"
            >
              <template #item="{ element }">
                <div class="d-flex align-center order-item" style="height: 55px;">
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
                    <p>{{ element.schedule_index + 1 }}: Ordine ID {{ element.id }}</p>
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
                      <v-btn
                        v-if="element.type === 'Delivery'"
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
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { ref, watch, computed, onMounted } from 'vue';
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

  const newOrder = {
    ...orderToAdd,
    start_time_slot: '',
    end_time_slot: '',
    schedule_index: schedule.value.orders.length
  };
  schedule.value.orders.push(newOrder);

  schedule.value.schedule_items.push(
    {
      id: `cp-${newOrder.id}`,
      type: 'collection_point',
      collection_point: newOrder.collection_point,
      schedule_index: schedule.value.schedule_items.length
    },
    {
      ...newOrder,
      type: 'Delivery',
      schedule_index: schedule.value.schedule_items.length + 1
    }
  );

  selectedOrderId.value = null;
};

const removeOrder = (orderId) => {
  schedule.value.orders = schedule.value.orders.filter(o => o.id !== orderId);
  if (!schedule.value.deleted_orders) schedule.value.deleted_orders = [];
  schedule.value.deleted_orders.push(orderId);
  schedule.value.schedule_items = schedule.value.schedule_items.filter(item => item.id !== orderId);
};

const availableOrders = computed(() => {
  return orders.value
    .filter(o => o.status === 'Pending')
    .filter(o => !schedule.value.orders.some(so => so.id === o.id));
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

const initScheduleItems = () => {
  if (!schedule.value.orders) return;
  schedule.value.schedule_items = schedule.value.orders.flatMap((order, index) => [
    {
      id: `cp-${order.id}`,
      type: 'collection_point',
      schedule_index: index * 2,
      collection_point: order.collection_point
    },
    {
      id: order.id,
      schedule_index: index * 2 + 1,
      start_time_slot: order.start_time_slot || '',
      end_time_slot: order.end_time_slot || '',
      ...order
    }
  ]);
};

watch(
  () => schedule.value.schedule_items,
  (items) => {
    items.forEach((item, index) => item.schedule_index = index);

    schedule.value.orders = items
      .filter(i => i.type === 'Delivery')
      .map((i, index) => ({ ...i, schedule_index: index }));

    const deliveryOrders = items.filter(i => i.type === 'Delivery');
    const cpItems = items.filter(i => i.type === 'collection_point');

    cpItems.forEach(cp => {
      const isUsed = deliveryOrders.some(
        order => order.collection_point?.id === cp.collection_point?.id
      );
      if (!isUsed) {
        schedule.value.schedule_items = schedule.value.schedule_items.filter(item => item.id !== cp.id);
      }
    });
  },
  { deep: true }
);

onMounted(() => {
  if (!schedule.value.id) {
    schedule.value.orders = schedule.value.orders.map((order, index) => {
      return {
        ...order,
        start_time_slot: '',
        end_time_slot: '',
        schedule_index: index
      };
    });
  }

  schedule.value.orders.sort((a, b) => a.schedule_index - b.schedule_index);
  initScheduleItems();
});


watch(() => schedule.value.date, () => {
  error.value.date = null;
});

watch(() => schedule.value.users, () => {
  error.value.user = null;
});
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
