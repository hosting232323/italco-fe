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
          :color="theme.current.value.primaryColor"
          class="mb-1"
          block
          @click="emits('deleteOrder', isActive, order)"
        />
        <ExcelImportationNewProduct
          v-if="activeNewProductForm[order['Rif. Com']]"
          :order="order"
          :customer-id="customerId"
          @close-form="activeNewProductForm[order['Rif. Com']] = false"
          @add-product="(order, productName, collectionPoint) => order.products[productName] = {
            services: [], collection_point: collectionPoint
          }"
        />
        <v-btn
          v-else
          text="Aggiungi prodotto"
          :color="theme.current.value.primaryColor"
          block
          @click="activeNewProductForm[order['Rif. Com']] = true"
        />
      </v-col>
      <v-col
        cols="12"
        md="8"
      >
        <template
          v-for="[productName, product] in Object.entries(order.products)"
          :key="productName"
        >
          <v-row no-gutters>
            <v-col cols="11">
              <p>
                Prodotto: {{ productName }}
                {{ product.collection_point ? `[${product.collection_point.name}]` : '' }}
              </p>
            </v-col>
            <v-col cols="1">
              <v-btn
                icon="mdi-delete"
                variant="text"
                :color="theme.current.value.primaryColor"
                @click="delete order.products[productName]"
              />
            </v-col>
          </v-row>
          <v-chip
            v-for="(serviceId, index) in product.services"
            :key="index"
            class="mb-2 mr-1"
          >
            {{ serviceNames[serviceId] }}
          </v-chip>
          <v-row no-gutters>
            <v-col cols="6">
              <v-select
                v-model="selectedFileServices[order['Rif. Com'] + productName]"
                label="Servizi da file"
                :items="order.services"
                item-title="name"
                item-value="id"
                :rules="getRules(order, productName)"
                class="mr-2"
              >
                <template #item="{ props }">
                  <v-list-item
                    v-bind="props"
                    @click="selectService(order, productName, 'file')"
                  />
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="selectedAresServices[order['Rif. Com'] + productName]"
                :items="getServiceUser()"
                label="Servizi da Ares"
                item-title="name"
                item-value="id"
                :rules="getRules(order, productName)"
                class="ml-2"
              >
                <template #item="{ props }">
                  <v-list-item
                    v-bind="props"
                    @click="selectService(order, productName, 'ares')"
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
  <v-alert
    v-if="message"
    class="mt-5 mb-5"
  >
    {{ message }}
  </v-alert>
</template>

<script setup>
import ExcelImportationNewProduct from '@/components/administration/importation/ExcelImportationNewProduct';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';

const { isActive, customerId, conflictsOrders } = defineProps({
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
  }
});

const form = ref(null);
const message = ref('');
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

  if (!conflictsOrders.every(order => order.products && Object.keys(order.products).length > 0)) {
    message.value = 'Attenzione: è necessario che ogni ordine abbia almeno un prodotto';
    return;
  }

  if (!conflictsOrders.every(order => Object.values(order.products).every(product => product.collection_point))) {
    message.value = 'Attenzione: è necessario che ogni prodotto sia associato ad un punto di ritiro';
    return;
  }

  loading.value = true;
  http.postRequest('import/excel/conflict', {
    orders: conflictsOrders,
    customer_id: customerId
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

const selectService = (order, productName, type) => {
  const refId = order['Rif. Com'] + productName;
  const serviceId = type == 'file' ? selectedFileServices.value[refId] : selectedAresServices.value[refId];
  order.products[productName].services.push(serviceId);

  if (!serviceNames.value[serviceId])
    serviceNames.value[serviceId] = services.value.find(service => service.users.find(user => user.id == serviceId)).name;

  if (type == 'ares')
    selectedAresServices.value[refId] = null;
  else {
    selectedFileServices.value[refId] = null;
    order.services.splice(order.services.findIndex(service => service.id === serviceId), 1);
  }
};

const getRules = (order, productName) => {
  return [() => {
    if (order.products[productName].services.length > 0) return true;

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
