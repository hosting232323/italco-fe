<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-btn
        v-if="role == 'Admin'"
        text="Pianificazione Automatica"
        class="mr-5"
        :color="theme.current.value.primaryColor"
        @click="openSchedulationPopUp()"
      />
      <v-btn
        v-if="['Admin', 'Operator'].includes(role) && schedule.orders?.length"
        text="Assegna Gruppo Delivery"
        :color="theme.current.value.primaryColor"
        @click="openFormPopUp()"
      />
      <v-skeleton-loader
        v-if="!ready"
        type="table"
        :color="theme.current.value.secondaryColor"
        class="mt-5"
      />
      <v-data-table
        v-else
        v-model="schedule.orders"
        :items="orders"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="getHeaders()"
        :show-select="['Admin', 'Operator'].includes(role)"
        :items-per-page="25"
        :items-per-page-options="[10, 25, 50, 100]"
      >
        <template #[`item.id`]="{ item }">
          {{ item.id }}
          {{ item.external_id ? `[${item.external_id}]` : '' }}
        </template>
        <template #[`item.type`]="{ item }">
          {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
        </template>
        <template #[`item.productsServices`]="{ item }">
          <div style="min-width: 250px;">
            <template 
              v-for="product in Object.keys(item.products)" 
              :key="product"
            >
              <b>{{ product }}</b>
              <i v-if="item.products[product].rae_product_id">
                RAEE
              </i>
              [{{ item.products[product].collection_point.name }}] :
              {{ item.products[product].services.map(service => service.name).join(', ') }}
              <br>
            </template>
          </div>
        </template>
        <template #[`item.addressee`]="{ item }">
          {{ item.addressee }}<br>
          <p style="font-size: smaller;">
            {{ item.address }}, {{ item.cap }}
          </p>
        </template>
        <template #[`item.status`]="{ item }">
          <v-chip :color="orderUtils.LABELS.find(label => label.value == item.status).color">
            {{ orderUtils.LABELS.find(label => label.value == item.status).title }}
          </v-chip>
        </template>
        <template #[`item.price`]="{ item }">
          {{ item.price == 0 ? '0' : (item.price ? item.price.toFixed(2) : '') }}€
        </template>
        <template #[`item.actions`]="{ item }">
          <Action :item="item" />
        </template>
        <template #[`item.created_at`]="{ item }">
          {{ createdAt(item.created_at) }}
        </template>
      </v-data-table>
    </template>
    <template #default>
      <ScheduleForm
        v-if="popUpType == 'form'"
        @cancel="dialog = false"
      />
      <SchedulationForm
        v-else-if="popUpType == 'schedulation'"
        @cancel="dialog = false"
        @go-to-shedule-form="popUpType = 'form'"
      />
      <v-card
        v-else-if="popUpType == 'message' && scheduleFormMessage"
        :title="scheduleFormMessage"
      />
    </template>
  </v-dialog>
</template>

<script setup>
import Action from '@/components/orders/OrderActions';
import ScheduleForm from '@/components/operator/schedules/ScheduleForm';
import SchedulationForm from '@/components/operator/schedules/SchedulationForm';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';

const theme = useTheme();
const dialog = ref(false);
const router = useRouter();
const popUpType = ref(null);
const userStore = useUserStore();
const orderStore = useOrderStore();
const scheduleFormMessage = ref('');
const scheduleStore = useScheduleStore();

const { role } = storeToRefs(userStore);
const { ready } = storeToRefs(orderStore);
const { element: schedule } = storeToRefs(scheduleStore);
const orders = storesUtils.getStoreList(orderStore, router);
schedule.value = {};

const getHeaders = () => {
  const headers = [
    { title: 'ID', value: 'id', sortable: false },
    { title: 'Tipo', value: 'type', sortable: false },
    { title: 'Stato', value: 'status', sortable: false },
    { title: 'Prodotti Servizi', value: 'productsServices', sortable: false },
    { title: 'Destinatario', value: 'addressee', sortable: false },
    { title: 'Recapito', value: 'addressee_contact', sortable: false }
  ];
  if (role.value != 'Customer')
    headers.push({ title: 'Punto Vendita', value: 'user.nickname', sortable: false });
  headers.push(
    { title: 'D.P.C.', value: 'dpc', sortable: false },
    { title: 'D.R.C.', value: 'drc', sortable: false },
    { title: 'Data Assegnazione', value: 'assignament_date', sortable: false },
    { title: 'Data Consegna', value: 'booking_date', sortable: false },
    { title: 'Data Creazione', value: 'created_at', sortable: false }
  );
  if (role.value == 'Admin')
    headers.push({ title: 'Prezzo', value: 'price', sortable: false });
  headers.push({ title: 'Azioni', key: 'actions', sortable: false });
  return headers;
};

const createdAt = (input) => {
  const [datePart] = input.split(' ');
  const [day, month, year] = datePart.split('/');
  return `${year}-${month}-${day}`;
};

const openFormPopUp = () => {
  dialog.value = true;
  popUpType.value = 'message';
  scheduleFormMessage.value = 'Loading...';

  http.postRequest('schedule/pianification', {
    orders_id: schedule.value.orders
  }, (data) => {
    if (data.status == 'ok') {
      popUpType.value = 'form';
      schedule.value.schedule_items = data.schedule_items;
    } else
      scheduleFormMessage.value = data.error;
  }, 'POST', router);
};

const openSchedulationPopUp = () => {
  dialog.value = true;
  popUpType.value = 'schedulation';
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
