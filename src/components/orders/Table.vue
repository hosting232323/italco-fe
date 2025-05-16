<template>
  <v-dialog max-width="1500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-if="['Admin', 'Operator'].includes(role)"
        text="Assegna Gruppo Delivery"
        :color="theme.current.value.primaryColor"
        v-bind="activatorProps"
      />
      <v-data-table
        :items="orders"
        :style="{ '--item-bg-color': theme.current.value.secondaryColor }"
        :headers="getHeaders()"
        :show-select="['Admin', 'Operator'].includes(role)"
        v-model="selectedOrders"
      >
        <template v-slot:item.type="{ item }">
          {{ orderUtils.TYPES.find(type => type.value == item.type)?.title }}
        </template>
        <template v-slot:item.productsServices="{ item }">
          <template v-for="product in Object.keys(item.products)">
            <b>{{ product }}</b>:
            {{ item.products[product].map(service => service.name).join(', ') }}
            <br>
          </template>
        </template>
        <template v-slot:item.addressee="{ item }">
          {{ item.addressee }}<br>
          <p style="font-size: smaller;">{{ item.address }}, {{ item.cap }}</p>
        </template>
        <template v-slot:item.collection_point="{ item }">
          {{ item.collection_point.name }}<br>
          <p style="font-size: smaller;">{{ getAddress(item.collection_point) }}</p>
        </template>
        <template v-slot:item.status="{ item }">
          {{ orderUtils.LABELS[item.status] }}
        </template>
        <template v-slot:item.price="{ item }">
          {{ item.price ? item.price.toFixed(2) : '' }}€
        </template>
        <template v-slot:item.actions="{ item }">
          <DeliveryAction :item="item" v-if="role == 'Delivery'" />
          <Action :item="item" v-if="['Admin', 'Operator'].includes(role)" />
        </template>
      </v-data-table>
    </template>
    <template v-slot:default="{ isActive }">
      <v-card title="Assegna Gruppo Delivery">
        <v-card-text>
          <v-form ref="form" @submit.prevent="assignDeliveryGroup(isActive)">
            <v-select
              v-model="selectedDeliveryGroup"
              label="Gruppo Delivery"
              :items="deliveryGroups"
              item-title="name"
              item-value="id"
              :rules="validation.requiredRules"
            />
            <FormButtons
              :loading="loading"
              @cancel="isActive.value = false"
            />
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import Action from '@/components/orders/Actions';
import FormButtons from '@/components/FormButtons';
import DeliveryAction from '@/components/delivery/Actions';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useDeliveryGroupStore } from '@/stores/deliveryGroup';

const form = ref(null);
const theme = useTheme();
const loading = ref(false);
const router = useRouter();
const selectedOrders = ref([]);
const userStore = useUserStore();
const orderStore = useOrderStore();
const selectedDeliveryGroup = ref(null);
const deliveryGroupStore = useDeliveryGroupStore();
const { role } = storeToRefs(userStore);
const { list: orders } = storeToRefs(orderStore);
const { list: deliveryGroups } = storeToRefs(deliveryGroupStore);

const getAddress = (item) => {
  return item.address + ', ' + item.city + ', ' + item.province + ', ' + item.cap;
};

const assignDeliveryGroup = async (isActive) => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.postRequest('order/delivery-group', {
    delivery_group_id: selectedDeliveryGroup.value,
    order_ids: selectedOrders.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      orderStore.initList(router);
      selectedOrders.value = [];
      selectedDeliveryGroup.value = null;
      isActive.value = false;
    }
  }, 'PUT', router);
};

const getHeaders = () => {
  const headers = [
    { title: 'ID', value: 'id' },
    { title:'Tipo', value: 'type' },
    { title: 'Stato', value: 'status' },
    { title:'Prodotti Servizi', value: 'productsServices' },
    { title: 'Destinatario', value: 'addressee' },
    { title: 'Punto di Ritiro', value: 'collection_point' }
];
  if (role.value == 'Customer')
    headers.push({ title: 'Note', value: 'customer_note' });
  else
    headers.push(
      { title: 'Note Punto Vendita', value: 'customer_note' },
      { title: 'Note Operatori', value: 'operator_note' },
      { title: 'Punto Vendita', value: 'user.email' }
    );
  headers.push(
    { title: 'D.P.C.', value: 'dpc' },
    { title: 'D.R.C.', value: 'drc' },
    { title: 'Data Assegnazione', value: 'assignament_date' },
    { title: 'Data Consegna', value: 'booking_date' },
    { title: 'Data Creazione', value: 'created_at' }
  );
  if (['Admin', 'Operator'].includes(role.value))
    headers.push({ title: 'Gruppo Delivery', value: 'delivery_group.name' });
  if (role.value == 'Admin')
    headers.push({ title: 'Prezzo', value: 'price' });
  headers.push({ title: 'Azioni', key: 'actions' });
  return headers;
};
</script>

<style scoped>
.v-table {
  background-color: var(--item-bg-color);
}
</style>
