<template>
  <v-form
    ref="form"
    @submit.prevent="submitConflictsForm"
  >
    <v-row
      v-for="order in conflictsOrders"
      :key="order['Rif. Com']"
    >
      <v-col
        cols="12"
        md="4"
      >
        Ordine: {{ order['Rif. Com'] }}<br>
        DPC: {{ order['DPC'] }}<br>
        DRC: {{ order['DRC'] }}<br>
        Indirizzo: {{ order['Indirizzo Dest.'] }} {{ order['Localita'] }}<br>
        <v-btn
          text="Elimina ordine"
          @click="emits('deleteOrder', isActive, order)"
          :color="theme.current.value.primaryColor"
          class="mb-1"
          block
        />
        <OrderImportationNewProduct
          v-if="activeNewProductForm[order['Rif. Com']]"
          :order="order"
          @closeForm="activeNewProductForm[order['Rif. Com']] = false"
        />
        <v-btn
          v-else
          text="Aggiungi prodotto"
          @click="activeNewProductForm[order['Rif. Com']] = true"
          :color="theme.current.value.primaryColor"
          block
        />
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <template
          v-for="product in Object.keys(order.products)"
          :key="product"
        >
          <v-row no-gutters>
            <v-col cols="11">
              <p>
                Prodotto: {{ product }}
              </p>
            </v-col>
            <v-col cols="1">
              <v-btn
                icon="mdi-delete"
                variant="text"
                :color="theme.current.value.primaryColor"
                @click="delete order.products[product]"
              />
            </v-col>
          </v-row>
          <v-chip
            v-for="(serviceId, index) in order.products[product]"
            :key="index"
            class="mb-2"
          >
            {{ serviceNames[serviceId] }}
          </v-chip>
          <v-row no-gutters>
            <v-col cols="6">
              <v-select
                v-model="selectedFileServices[order['Rif. Com'] + product]"
                label="Servizi da file"
                :items="order.services"
                item-title="name"
                item-value="id"
                :rules="getRules(order, product)"
                class="mr-2"
              >
                <template #item="{ props }">
                  <v-list-item
                    v-bind="props"
                    @click="selectService(order, product, 'file')"
                  />
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedAresServices[order['Rif. Com'] + product]"
                :items="getServiceUser()"
                label="Servizi da Ares"
                item-title="name"
                item-value="id"
                :rules="getRules(order, product)"
                class="ml-2"
              >
                <template #item="{ props }">
                  <v-list-item
                    v-bind="props"
                    @click="selectService(order, product, 'ares')"
                  />
                </template>
              </v-select>
            </v-col>
          </v-row>
        </template>
      </v-col>
    </v-row>
    <v-btn
      class="mt-1"
      type="submit"
      text="Invia"
      block
      :loading="loading"
      :color="theme.current.value.primaryColor"
    />
  </v-form>
</template>

<script setup>
import OrderImportationNewProduct from '@/components/administration/OrderImportationNewProduct';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';

const { isActive, customerId, conflictsOrders, collectionPoint } = defineProps({
  isActive: {
    type: Object,
    required: true
  },
  customerId: {
    type: Number,
    required: true
  },
  conflictsOrders: {
    type: Array,
    required: true
  },
  collectionPoint: {
    type: Number,
    required: true
  }
});

const form = ref(null);
const theme = useTheme();
const loading = ref(false);
const router = useRouter();
const serviceNames = ref({});
const orderStore = useOrderStore();
const activeNewProductForm = ref({});
const selectedFileServices = ref({});
const selectedAresServices = ref({});
const serviceStore = useServiceStore();
const emits = defineEmits(['cancel', 'deleteOrder']);

const { ready } = storeToRefs(orderStore);
const services = storesUtils.getStoreList(serviceStore, router);

const submitConflictsForm = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.postRequest('import/conflict', {
    orders: conflictsOrders,
    collection_point_id: collectionPoint
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      if (data.imported_orders_count > 0)
        alert(`Importati ${data.imported_orders_count} ordini con successo.`);

      ready.value = false;
      orderStore.initList(router);
      emits('cancel', isActive);
    }
  }, 'POST', router);
};

const selectService = (order, product, type) => {
  const refId = order['Rif. Com'] + product;
  const serviceId = type == 'file' ? selectedFileServices.value[refId] : selectedAresServices.value[refId];
  order.products[product].push(serviceId);

  if (!serviceNames.value[serviceId])
    serviceNames.value[serviceId] = services.value.find(service => service.users.find(user => user.id == serviceId)).name;

  if (type == 'ares')
    selectedAresServices.value[refId] = null;
  else {
    selectedFileServices.value[refId] = null;
    order.services.splice(order.services.findIndex(service => service.id === serviceId), 1);
  }
};

const getRules = (order, product) => {
  return [() => {
    if (order.products[product].length > 0) return true;

    return 'Inserire almeno un servizio per prodotto';
  }];
};

const getServiceUser = () => {
  return services.value.reduce((acc, service) => {
    const serviceUser = service.users.find(user => user.user_id === customerId);
    if (serviceUser)
      acc.push({name: service.name, id: serviceUser.id});

    return acc;
  }, []);
};
</script>
