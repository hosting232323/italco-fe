<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <div class="orders-toolbar">
        <v-btn
          v-if="role == 'Admin' && company?.automatic_planning"
          text="Pianificazione Automatica"
          class="mr-5"
          :color="theme.current.value.primaryColor"
          prepend-icon="mdi-calendar-arrow-right"
          @click="openSchedulationPopUp()"
        />
        <template v-if="['Admin', 'Operator'].includes(role) && schedule.orders?.length">
          <v-btn
            text="Crea Borderò"
            :color="theme.current.value.primaryColor"
            prepend-icon="mdi-text-box-plus-outline"
            @click="openFormPopUp()"
          />
          <v-btn
            text="Esporta"
            :color="theme.current.value.primaryColor"
            prepend-icon="mdi-microsoft-excel"
            :loading="downloadingExcel"
            class="ml-2"
            @click="downloadExcel()"
          />
        </template>
        <OrderActions
          v-if="selectedOrder"
          :key="selectedOrder.id"
          :item="selectedOrder"
        />
      </div>
      <v-skeleton-loader
        v-if="!ready"
        type="table"
        :color="theme.current.value.secondaryColor"
        class="mt-5"
      />
      <div
        v-else
        class="orders-table-area"
      >
        <v-data-table
          class="orders-table"
          fixed-header
          v-model="schedule.orders"
          :items="orders"
          :headers="getHeaders()"
          show-select
          :items-per-page="25"
          :items-per-page-options="[10, 25, 50, 100]"
        >
          <template #[`item.info`]="{ item }">
            <OrderInfoRow
              :item="item"
              @open-statuses-popup="openStatusesPopup(item)"
            />
          </template>
          <template #[`item.addressee`]="{ item }">
            {{ item.addressee }}<br>
            <p style="font-size: smaller;">
              {{ item.address }}, {{ item.cap }}
            </p>
          </template>
          <template #[`item.price`]="{ item }">
            {{ item.price == 0 ? '0' : (item.price ? item.price.toFixed(2) : '') }}€
          </template>
          <template #[`item.user.company_name`]="{ item }">
            {{ item.user?.company_name || item.user?.nickname || '' }}
          </template>
          <template #[`item.created_at`]="{ item }">
            {{ createdAt(item.created_at) }}
          </template>
        </v-data-table>
      </div>
    </template>
    <template #default>
      <SchedulationForm
        v-show="popUpType == 'schedulation'"
        :order-to-update="orderToUpdate"
        @cancel="dialog = false"
        @go-to-shedule-form="popUpType = 'schedule-form'; fromSchedulation = true"
        @order-form="popUpType = 'order-form'"
      />
      <ScheduleForm
        v-if="popUpType == 'schedule-form'"
        :from-schedulation="fromSchedulation"
        @cancel="dialog = false; fromSchedulation = false"
        @go-back="popUpType = 'schedulation'; fromSchedulation = false"
      />
      <v-card
        v-else-if="popUpType == 'order-form'" 
        title="Modifica ordine"
      >
        <v-card-text>
          <OrderDatesForm @go-to-schedulation="goToSchedulation" />
        </v-card-text>
      </v-card>
      <OrderHistoryPopup
        v-else-if="popUpType == 'statuses'"
        :statuses="statuses"
        @cancel="dialog = false"
      />
      <v-card
        v-else-if="popUpType == 'message' && scheduleFormMessage"
        :title="scheduleFormMessage"
      />
    </template>
  </v-dialog>
</template>

<script setup>
import OrderActions from '@/components/orders/OrderActions';
import OrderInfoRow from '@/components/orders/OrderInfoRow';
import OrderDatesForm from '@/components/orders/OrderDatesForm';
import OrderHistoryPopup from '@/components/orders/OrderHistoryPopup';
import ScheduleForm from '@/components/operator/schedules/ScheduleForm';
import SchedulationForm from '@/components/operator/schedules/SchedulationForm';

import { ref, computed, watch } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';

const statuses = ref([]);
const theme = useTheme();
const dialog = ref(false);
const popUpType = ref(null);
const orderToUpdate = ref(null);
const userStore = useUserStore();
const fromSchedulation = ref(false);
const scheduleFormMessage = ref('');
const downloadingExcel = ref(false);

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
// Il super admin che opera in una company ha i permessi di un admin: i pulsanti
// gated su Admin/Operator (Crea Borderò, selezione righe, ...) devono comparirgli.
const { effectiveRole: role, company } = storeToRefs(userStore);
const { ready } = storeToRefs(orderStore);
const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore);
schedule.value = {};

const getHeaders = () => {
  const headers = [
    { title: 'Info', value: 'info', sortable: false },
    { title: 'Destinatario', value: 'addressee', sortable: false },
    { title: 'Recapito', value: 'addressee_contact', sortable: false }
  ];
  if (role.value != 'Customer')
    headers.push({ title: 'Punto Vendita', value: 'user.company_name', sortable: false });
  headers.push(
    { title: 'D.P.C.', value: 'dpc', sortable: false },
    { title: 'D.R.C.', value: 'drc', sortable: false },
    { title: 'Data Consegna', value: 'booking_date', sortable: false },
    { title: 'Data Creazione', value: 'created_at', sortable: false }
  );
  if (role.value == 'Admin')
    headers.push({ title: 'Prezzo', value: 'price', sortable: false });
  return headers;
};

// I comandi del singolo ordine compaiono solo con una riga selezionata.
const selectedOrder = computed(() => {
  const selected = schedule.value.orders;
  if (selected?.length != 1) return null;
  const id = typeof selected[0] === 'object' ? selected[0].id : selected[0];
  return orders.value.find(order => order.id == id) || null;
});

// Un ordine sparito dalla lista (eliminato, filtrato) non resta selezionato.
watch(orders, (list) => {
  if (!schedule.value.orders?.length) return;
  const ids = new Set(list.map(order => order.id));
  schedule.value.orders = schedule.value.orders.filter(
    order => ids.has(typeof order === 'object' ? order.id : order)
  );
});

const goToSchedulation = (id, status) => {
  orderToUpdate.value = {id, status};
  popUpType.value = 'schedulation';
};

const createdAt = (input) => {
  const [datePart] = input.split(' ');
  const [day, month, year] = datePart.split('/');
  return `${year}-${month}-${day}`;
};

const downloadExcel = async () => {
  if (!schedule.value.orders?.length) return;

  downloadingExcel.value = true;
  http.downloadRequest(
    'export/orders/excel',
    'POST',
    {
      body: {
        order_ids: schedule.value.orders.map(order => typeof order === 'object' ? order.id : order)
      }
    },
    () => downloadingExcel.value = false
  );
};

const openFormPopUp = () => {
  dialog.value = true;
  popUpType.value = 'message';
  scheduleFormMessage.value = 'Loading...';

  http.makeRequest('schedule/pianification', 'POST', {
    body: { orders_id: schedule.value.orders }
  }, (data) => {
    if (data.status == 'ok') {
      popUpType.value = 'schedule-form';
      schedule.value.schedule_items = data.schedule_items;
    } else
      scheduleFormMessage.value = data.message;
  });
};

const openSchedulationPopUp = () => {
  dialog.value = true;
  popUpType.value = 'schedulation';
};

const openStatusesPopup = (item) => {
  dialog.value = true;
  popUpType.value = 'message';
  scheduleFormMessage.value = 'Loading...';

  http.makeRequest(`order/statuses/${item.id}`, 'GET', {}, (data) => {
    popUpType.value = 'statuses';
    statuses.value = data.statuses;
  });
};
</script>

<style scoped>
.orders-toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  flex: 0 0 auto;
}

@media (min-width: 960px) {
  .orders-table-area {
    flex: 1 1 0;
    min-height: 300px;
    margin-top: 12px;
  }

  .orders-table {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .orders-table :deep(.v-table__wrapper) {
    flex: 1 1 0;
    min-height: 0;
    overflow: auto;
  }
}
</style>
