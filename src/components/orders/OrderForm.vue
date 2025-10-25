<template>
  <v-form
    ref="form"
    @submit.prevent="submitForm"
  >
    <v-tabs
      v-if="role == 'Admin' && order.id"
      v-model="activeTab"
      background-color="primary"
      dark
      grow
      class="mb-3"
    >
      <v-tab>Operator</v-tab>
      <v-tab>Delivery</v-tab>
    </v-tabs>
    <div v-show="activeTab === 0">
      <v-select
        v-model="order.type"
        label="Tipo"
        :items="orderUtils.TYPES"
        :rules="validation.requiredRules"
        :disabled="order.products && Object.keys(order.products).length > 0"
      />
      <ProductServiceInput ref="productServiceInputRef" />
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="order.addressee"
            :class="isMobile ? '' : 'mr-2'"
            label="Destinatario"
            :rules="validation.requiredRules"
          />
        </v-col>
        <v-col
          cols="12"
          md="4"
        >
          <GooglePlacesAutocomplete
            v-model="order.address"
            :custom-class="isMobile ? '' : 'ml-2 mr-2'"
            label="Indirizzo"
            :rules="validation.requiredRules"
            @address-components="handleAddressComponents"
          />
        </v-col>
        <v-col
          cols="12"
          md="2"
        >
          <v-text-field
            v-model="order.cap"
            :class="isMobile ? '' : 'ml-2'"
            label="CAP"
            :rules="validation.capRules"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="order.addressee_contact"
            :class="isMobile ? '' : 'mr-2'"
            label="Recapito"
            :rules="validation.phoneRules"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-autocomplete
            v-model="order.collection_point_id"
            :class="isMobile ? '' : 'ml-2'"
            label="Punto di Ritiro"
            :items="getCollectionPoints()"
            item-title="name"
            item-value="id"
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
    </div>
    <div v-show="activeTab === 1">
      <v-select
        v-if="order.id && order.status != 'Pending' && role != 'Operator'"
        v-model="order.status"
        label="Stato"
        :items="orderUtils.LABELS.filter(label => label.value != 'Pending')"
        :rules="validation.requiredRules"
      />
      <v-textarea
        v-if="role != 'Operator'"
        v-model="order.motivation"
        label="Motivazione"
        rows="3"
      />
      <v-file-input
        v-if="role != 'Operator'"
        v-model="order.photos"
        multiple
        accept="image/*"
        label="Foto"
      />
      <v-row
        v-if="order.id && role != 'Operator'"
        no-gutters
      >
        <v-col
          cols="6"
          :class="isMobile ? 'd-flex flex-column' : 'd-flex justify-center align-center'"
        >
          <v-radio-group v-model="order.delay">
            <label class="mr-2">In ritardo</label>
            <v-radio
              label="Sì"
              :value="true"
            />
            <v-radio
              label="No"
              :value="false"
            />
          </v-radio-group>
          <div
            v-if="order.delay"
            :style="isMobile ? { width: '100%' } : { width: '50%', height: '100%' }"
            :class="isMobile ? 'd-flex flex-column' : 'd-flex justify-center align-center'"
          >
            <v-text-field
              v-model="order.start_time_slot"
              label="Time Slot Start"
              type="time"
              :rules="validation.requiredRules"
              dense
              hide-details
              :style="isMobile ? { margin: '15px 0', width: '100%' } : { maxWidth: '115px', marginRight: '15px' }"
            />
            <v-text-field
              v-model="order.end_time_slot"
              label="Time Slot End"
              type="time"
              :rules="validation.futureTime(order)"
              dense
              hide-details
              :style="isMobile ? { width: '100%' } : { maxWidth: '115px' }"
            />
          </div>
        </v-col>
        <v-col cols="6">
          <v-radio-group v-model="order.anomaly">
            <label class="mr-2">Con Anomalia</label>
            <v-radio
              label="Sì"
              :value="true"
            />
            <v-radio
              label="No"
              :value="false"
            />
          </v-radio-group>
        </v-col>
      </v-row>
    </div>
    <p v-if="errorMsg">
      {{ errorMsg }}
    </p>
    <FormButtons
      :loading="loading"
      @cancel="exitFunction"
    />
  </v-form>
</template>

<script setup>
import FormButtons from '@/components/FormButtons';
import ProductServiceInput from '@/components/orders/OrderProductServiceInput';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';

import { ref, watch } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import orderUtils from '@/utils/order';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const form = ref(null);
const activeTab = ref(0);
const errorMsg = ref('');
const router = useRouter();
const loading = ref(false);
const productServiceInputRef = ref(null);
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
    order.value = {};
};

const submitForm = async () => {
  errorMsg.value = '';
  if (!(await form.value.validate()).valid) return;

  if (!order.value.products || Object.keys(order.value.products).length === 0) {
    errorMsg.value = 'Devi aggiungere almeno un prodotto o servizio all\'ordine.';
    return;
  }

  if (role.value == 'Admin' || !order.value.id)
    order.value.dates_form = true;
  else {
    loading.value = true;
    if (order.value.photos && order.value.photos.length > 0)
      orderStore.updateElementWithFormData(router, callback);
    else
      orderStore.updateElement(router, callback);
  }
};

const handleAddressComponents = (components) => {
  order.value.address = components.address;
  order.value.cap = components.cap;
};

watch(
  () => order.value.type,
  () => productServiceInputRef.value?.resetFields()
);

const callback = (data) => {
  loading.value = false;
  if (data.status === 'ok') {
    order.value = {};
    orderStore.initList(router);
    activeForm.value = false;
  }
};
</script>
