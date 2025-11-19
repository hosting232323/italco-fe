<template>
  <v-dialog max-width="1500">
    <template #activator="{ props: activatorProps }">
      <v-btn
        icon="mdi-import"
        style="float: right;"
        variant="text"
        v-bind="activatorProps"
      />
    </template>
    <template #default="{ isActive }">
      <v-card title="Importa Ordini">
        <v-card-text v-if="Object.keys(conflictsOrders).length == 0">
          <v-form
            ref="form"
            @submit.prevent="submitForm(isActive)"
          >
            <v-file-input
              v-model="file"
              label="File Excel"
              :rules="validation.requiredRules"
            />
            <v-autocomplete
              v-model="user"
              label="Punto Vendita"
              :items="users.filter(user => user.role == 'Customer')"
              item-title="nickname"
              item-value="id"
              :rules="validation.requiredRules"
              @update:model-value="collectionPoint = null"
            />
            <v-autocomplete
              v-if="user"
              v-model="collectionPoint"
              label="Punto di Ritiro"
              :items="collectionPoints.filter(collectionPoint => collectionPoint.user_id == user)"
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
        <v-card-text v-else>
          <v-form
            ref="form"
            @submit.prevent="submitConflictsForm(isActive)"
          >
            <v-row v-for="order in conflictsOrders">
              <v-col cols="6">
                Ordine: {{ order['Rif. Com'] }}<br>
                DPC: {{ order['DPC'] }}<br>
                DRC: {{ order['DRC'] }}<br>
                Indirizzo: {{ order['Indirizzo Dest.'] }} {{ order['Localita'] }}<br>
              </v-col>
              <v-col cols="6">
                <template v-for="product in Object.keys(order.products)">
                  <p>
                    Prodotto: {{ product }}
                  </p>
                  <v-chip
                    v-for="serviceId in order.products[product]"
                    class="mb-2"
                  >
                    {{ order.services.find(service => service.id == serviceId).name }}
                  </v-chip>
                  <v-select
                    v-model="selectedServices[order['Rif. Com']][product]"
                    :items="order.services"
                    item-title="name"
                    item-value="id"
                    menu
                  >
                    <template #item="{ props }">
                      <v-list-item
                        v-bind="props"
                        @click="selectService(order, product)"
                      />
                    </template>
                  </v-select>
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
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useAdministrationUserStore } from '@/stores/administrationUser';

const file = ref(null);
const form = ref(null);
const user = ref(null);
const theme = useTheme();
const loading = ref(false);
const router = useRouter();
const conflictsOrders = ref({});
const selectedServices = ref({});
const collectionPoint = ref(null);

const orderStore = useOrderStore();
const collectionPointStore = useCollectionPointStore();
const administrationUserStore = useAdministrationUserStore();

const { ready } = storeToRefs(orderStore);
const users = storesUtils.getStoreList(administrationUserStore, router);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const submitForm = async (isActive) => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  http.formDataRequest('import', {
    file: file.value,
    customer_id: user.value,
    collection_point_id: collectionPoint.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      if (data.imported_orders_count > 0)
        alert(`Importati ${data.imported_orders_count} ordini con successo.`);

      if (data.conflicted_orders && Object.keys(data.conflicted_orders).length > 0)
        conflictsOrders.value = Object.values(data.conflicted_orders).map(order => {
          selectedServices.value[order.rows[0]['Rif. Com']] = {};
          const products = {};
          for (const product of order.products) products[product] = [];
          return {
            products,
            ...order.rows[0],
            services: order.services
          };
        });
      else {
        ready.value = false;
        orderStore.initList(router);
        isActive.value = false;
      }
    }
  }, 'POST', router);
};

const submitConflictsForm = (isActive) => {
  loading.value = true;
  http.postRequest('import/conflict', {
    orders: conflictsOrders.value,
    collection_point_id: collectionPoint.value
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      if (data.imported_orders_count > 0)
        alert(`Importati ${data.imported_orders_count} ordini con successo.`);

      ready.value = false;
      orderStore.initList(router);
      isActive.value = false;
    }
  }, 'POST', router);
};

const selectService = (order, product) => {
  const serviceId = selectedServices.value[order['Rif. Com']][product];
  order.products[product].push(serviceId);
  selectedServices.value[order['Rif. Com']][product] = null;
  order.services = order.services.splice(order.services.indexOf(serviceId), 1);
};
</script>
