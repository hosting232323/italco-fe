<template>
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
      <v-text-field
        v-model="order.mark"
        :class="isMobile ? '' : 'ml-2'"
        label="Contrassegno"
        type="number"
        :rules="validation.positiveNumberRules"
        append-inner-icon="mdi-currency-eur"
      />
    </v-col>
  </v-row>
  <v-row no-gutters>
    <v-col
      cols="12"
      md="6"
    >
      <v-radio-group
        v-model="order.elevator"
        inline
        :rules="[
          (value) => {
            if (value !== undefined) return true;
            return 'Campo obbligatorio';
          }
        ]"
      >
        <label class="mr-2 mt-2">Ascensore:</label>
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
    <v-col
      cols="12"
      md="6"
    >
      <v-text-field
        v-model="order.floor"
        :class="isMobile ? '' : 'ml-2'"
        label="Piano"
        type="number"
        :rules="validation.positiveNumberRules.concat([
          (value) => {
            if (value !== undefined || value !== '') return true;
            return 'Campo obbligatorio';
          }
        ])"
      />
    </v-col>
    <v-col
      cols="12"
      md="6"
    >
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
</template>

<script setup>
import ProductServiceInput from '@/components/orders/OrderProductServiceInput';
import GooglePlacesAutocomplete from '@/components/GooglePlacesAutocomplete';

import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import mobile from '@/utils/mobile';
import orderUtils from '@/utils/order';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';

const productServiceInputRef = ref(null);
const isMobile = mobile.setupMobileUtils();

const userStore = useUserStore();
const orderStore = useOrderStore();
const { role } = storeToRefs(userStore);
const { element: order } = storeToRefs(orderStore);

watch(
  () => order.value.type,
  () => productServiceInputRef.value?.resetFields()
);

const handleAddressComponents = (components) => {
  order.value.address = components.address;
  order.value.cap = components.cap;
};
</script>
