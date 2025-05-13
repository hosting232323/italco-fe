<template>
  <v-form ref="form" @submit.prevent="sendOrder">
    <v-select
      v-model="order.type"
      label="Tipo"
      :items="orderUtils.TYPES"
      :rules="validation.requiredRules"
    />
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-select
          :class="isMobile ? '' : 'mr-2'"
          v-model="selectedService"
          label="Servizio"
          :items="getServices()"
          item-title="name"
          item-value="id"
          :rules="validation.requiredRules"
          menu
        >
          <template v-slot:item="{ props }">
            <v-list-item
              v-bind="props"
              @click="addService"
            />
          </template>
        </v-select>
        <v-chip
          class="mr-2 mb-2"
          v-for="(serviceId, index) in order.service_ids"
          closable
          @click:close="removeService(index)"
        >
          {{ services.find(service => service.id == serviceId).name }}
        </v-chip>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :class="isMobile ? '' : 'ml-2'"
          v-for="(_product, index) in order.products?.concat({})"
          v-model="order.products[index]"
          label="Prodotto"
          :append-icon="order.products.length > index ? 'mdi-delete' : ''"
          @click:append="order.products.length > index ? order.products.splice(index, 1) : null"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-autocomplete
          :class="isMobile ? '' : 'mr-2'"
          v-model="order.collection_point_id"
          label="Punto di Ritiro"
          :items="getCollectionPoints()"
          item-title="name"
          item-value="id"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-autocomplete
          :class="isMobile ? '' : 'ml-2'"
          v-model="order.addressee_id"
          label="Anagrafica"
          :items="getAddressees()"
          item-title="name"
          item-value="id"
          :rules="validation.requiredRules"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-text-field
          :class="isMobile ? '' : 'mr-2'"
          v-model="order.dpc"
          label="Data Promessa al Cliente"
          type="date"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          :class="isMobile ? '' : 'ml-2'"
          v-model="order.drc"
          label="Data Richiesta dal Cliente"
          type="date"
          :rules="validation.requiredRules"
        />
      </v-col>
    </v-row>
    <v-textarea
      v-if="role == 'Customer'"
      v-model="order.customer_note"
      label="Note"
      rows="3"
    />
    <v-textarea
      v-else
      v-model="order.operator_note"
      label="Note"
      rows="3"
    />
    <FormButtons
      :loading="loading"
      @cancel="exitFunction"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';

import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';

import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useAddresseeStore } from '@/stores/addressee';
import { useCollectionPointStore } from '@/stores/collectionPoints';

const form = ref(null);
const loading = ref(false);
const router = useRouter();
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['goBack']);

const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const addresseeStore = useAddresseeStore();
const collectionPointStore = useCollectionPointStore();
const { role } = storeToRefs(userStore);
const { list: services } = storeToRefs(serviceStore);
const { list: addressees } = storeToRefs(addresseeStore);
const { element: order, activeForm } = storeToRefs(orderStore);
const { list: collectionPoints } = storeToRefs(collectionPointStore);

const selectedService = ref(order.value.id ? services.value.find(service => service.id == order.value.service_ids[0]).id : null);
if (!order.value.products) order.value.products = [];

const getServices = () => {
  return role.value == 'Customer' ? services.value :
    services.value.filter(service => service.users.map(user => user.user_id).includes(order.value.user_id));
};

const getCollectionPoints = () => {
  return role.value == 'Customer' ? collectionPoints.value :
    collectionPoints.value.filter(collectionPoint => collectionPoint.user_id == order.value.user_id);
};

const getAddressees = () => {
  return role.value == 'Customer' ? addressees.value :
    addressees.value.filter(addressee => addressee.user_id == order.value.user_id);
};

const exitFunction = () => {
  if (order.value.id) {
    order.value = {};
    activeForm.value = false;
  } else
    emits('goBack');
};

const addService = () => {
  if (!order.value.service_ids)
    order.value.service_ids = [];
  order.value.service_ids.push(selectedService.value);
};

const removeService = (index) => {
  order.value.service_ids.splice(index, 1);
};

const sendOrder = async () => {
  if (!(await form.value.validate()).valid) return;

  loading.value = true;
  if (order.value.id)
    orderStore.updateElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        order.value = {};
        orderStore.initList(router);
        activeForm.value = false;
      }
    });
  else
    orderStore.createElement(router, function (data) {
      loading.value = false;
      if (data.status == 'ok') {
        order.value = {};
        orderStore.initList(router);
        activeForm.value = false;
      }
    });
};
</script>