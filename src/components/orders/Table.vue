<template>
  <v-dialog
    v-model="dialog"
    max-width="1500"
  >
    <template #activator>
      <v-btn
        v-if="['Admin', 'Operator'].includes(role) && schedule.order_ids?.length"
        text="Assegna Gruppo Delivery"
        :color="theme.current.value.primaryColor"
        @click="dialog = true"
      />
      <v-skeleton-loader
        v-if="!ready"
        type="table"
        :color="theme.current.value.secondaryColor"
        class="mt-5"
      />
      <v-data-table
        v-else
        v-model="schedule.order_ids"
        :items="orders"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="getHeaders()"
        :show-select="['Admin', 'Operator'].includes(role)"
      >
        <template #item.type="{ item }">
          {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
        </template>
        <template #item.productsServices="{ item }">
          <div style="min-width: 250px;">
            <template v-for="product in Object.keys(item.products)">
              <b>{{ product }}</b>:
              {{ item.products[product].map(service => service.name).join(', ') }}
              <br>
            </template>
          </div>
        </template>
        <template #item.addressee="{ item }">
          {{ item.addressee }}<br>
          <p style="font-size: smaller;">
            {{ item.address }}, {{ item.cap }}
          </p>
        </template>
        <template #item.collection_point="{ item }">
          {{ item.collection_point.name }}<br>
          <p style="font-size: smaller;">
            {{ item.collection_point.address }}, {{ item.collection_point.cap }}
          </p>
        </template>
        <template #item.status="{ item }">
          {{ orderUtils.LABELS.find(label => label.value == item.status).title }}
        </template>
        <template #item.price="{ item }">
          {{ item.price ? item.price.toFixed(2) : '' }}€
        </template>
        <template #item.actions="{ item }">
          <Action
            v-if="['Admin', 'Operator'].includes(role)"
            :item="item"
          />
        </template>
        <template #item.created_at="{ item }">
          {{ createdAt(item.created_at) }}
        </template>
      </v-data-table>
    </template>
    <template #default>
      <v-card
        v-if="schedule.order_ids.some(
          id => orders.some(order => order.id === id && order.status !== 'Pending')
        )"
        title="Hai selezionato degli ordini già assegnati"
      />
      <ScheduleForm v-else ="dialog = false" />
    </template>
  </v-dialog>
</template>

<script setup>
import Action from '@/components/orders/Actions';
import ScheduleForm from '@/components/operator/schedules/Form';

import { ref } from 'vue';
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
const userStore = useUserStore();
const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const { role } = storeToRefs(userStore);
const { ready } = storeToRefs(orderStore);
const { element: schedule } = storeToRefs(scheduleStore);
schedule.value = {};
const orders = storesUtils.getStoreList(orderStore, router);

const getHeaders = () => {
  const headers = [
    { title: 'ID', value: 'id' },
    { title: 'Tipo', value: 'type' },
    { title: 'Stato', value: 'status' },
    { title: 'Prodotti Servizi', value: 'productsServices' },
    { title: 'Destinatario', value: 'addressee' },
    { title: 'Recapito', value: 'addressee_contact' },
    { title: 'Punto di Ritiro', value: 'collection_point' }
  ];
  if (role.value != 'Customer')
    headers.push({ title: 'Punto Vendita', value: 'user.email' });
  headers.push(
    { title: 'D.P.C.', value: 'dpc' },
    { title: 'D.R.C.', value: 'drc' },
    { title: 'Data Assegnazione', value: 'assignament_date' },
    { title: 'Data Consegna', value: 'booking_date' },
    { title: 'Data Creazione', value: 'created_at' }
  );
  if (role.value == 'Admin')
    headers.push({ title: 'Prezzo', value: 'price' });
  headers.push({ title: 'Azioni', key: 'actions' });
  return headers;
};

const createdAt = (input) => {
  const [datePart, _timePart] = input.split(' ');
  const [day, month, year] = datePart.split('/');
  return `${year}-${month}-${day}`;
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
