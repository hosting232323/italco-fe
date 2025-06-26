<template>
  <v-form ref="form" @submit.prevent="sendOrder">
    <v-select
      v-model="order.type"
      label="Tipo"
      :items="orderUtils.TYPES"
      :rules="validation.requiredRules"
    />
    <ProductServiceInput />
    <v-row no-gutters>
      <v-col cols="12" md="4">
        <v-text-field
          :class="isMobile ? '' : 'mr-2'"
          v-model="order.addressee"
          label="Destinatario"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col cols="12" md="4">
        <GooglePlacesAutocomplete
          v-model="order.address"
          :class="isMobile ? '' : 'ml-2 mr-2'"
          label="Indirizzo"
          :rules="validation.requiredRules"
          @update:isValid="isLocationValid = $event"
          @addressComponents="handleAddressComponents"
        />
      </v-col>
      <v-col cols="12" md="1">
        <v-text-field
          :class="isMobile ? '' : 'ml-2 mr-2'"
          v-model="order.cap"
          label="CAP"
          :rules="[...validation.requiredRules, ...validation.capRules]"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-text-field
          :class="isMobile ? '' : 'ml-2'"
          v-model="order.addressee_contact"
          label="Recapito"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" md="4">
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
      <v-col cols="12" md="4">
        <v-text-field
          :class="isMobile ? '' : 'ml-2 mr-2'"
          v-model="order.dpc"
          label="Data Promessa al Cliente"
          type="date"
          :rules="validation.requiredRules"
        />
      </v-col>
      <v-col cols="12" md="4">
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
import ProductServiceInput from '@/components/orders/ProductServiceInput';

import { ref, onMounted } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';

import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useCollectionPointStore } from '@/stores/collectionPoint';

import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete.vue';

const isLocationValid = ref(false);
const form = ref(null);
const loading = ref(false);
const router = useRouter();
const emits = defineEmits(['goBack']);
const isMobile = mobile.setupMobileUtils();

const userStore = useUserStore();
const orderStore = useOrderStore();
const collectionPointStore = useCollectionPointStore();
const { role } = storeToRefs(userStore);
const { element: order, activeForm } = storeToRefs(orderStore);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const getCollectionPoints = () => {
  return role.value == 'Customer' ? collectionPoints.value :
    collectionPoints.value.filter(collectionPoint => collectionPoint.user_id == order.value.user_id);
};

const exitFunction = () => {
  if (order.value.id || role.value == 'Customer') {
    order.value = {};
    activeForm.value = false;
  } else
    emits('goBack');
};

const sendOrder = async () => {
  if (!(await form.value.validate()).valid) return;
  if (!order.value.products || Object.keys(order.value.products).length == 0) return;

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

const handleAddressComponents = (components) => {
  order.value.address = components.address;
  order.value.cap = components.cap;
};
</script>