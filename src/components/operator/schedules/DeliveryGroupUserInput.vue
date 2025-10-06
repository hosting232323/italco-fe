<template>
  <v-form ref="form">
    <v-row
      no-gutters
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="selectedDeliveryGroup"
          :class="isMobile ? '' : 'mr-2'"
          label="Gruppo Delivery"
          append-icon="mdi-plus"
          :rules="validation.requiredRules"
          @click:append="addProduct"
        />
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-select
          v-model="selectedUser"
          :class="isMobile ? '' : 'ml-2'"
          label="Utenti"
          :items="users"
          item-title="email"
          :rules="validation.requiredRules"
          menu
          return-object
        >
          <template #item="{ props }">
            <v-list-item
              v-bind="props"
              @click="selectedServices.push(selectedService)"
            />
          </template>
        </v-select>
      </v-col>
    </v-row>

    <v-chip
      v-for="(service, index) in selectedServices"
      :key="index"
      class="mr-2 mb-5"
      append-icon="mdi-close-circle"
      @click="selectedServices.splice(index, 1)"
    >
      {{ service.name }}
    </v-chip>
  </v-form>
</template>

<script setup>
import { ref } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { useAdministrationUserStore } from '@/stores/administrationUser';


const form = ref(null);
const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const { role } = storeToRefs(userStore);
const isMobile = mobile.setupMobileUtils();
const { element: order } = storeToRefs(orderStore);
const services = storesUtils.getStoreList(serviceStore, router);

const administrationUserStore = useAdministrationUserStore();
const { ready } = storeToRefs(administrationUserStore);
const users = storesUtils.getStoreList(administrationUserStore, router);
console.log(users.value);


const selectedServices = ref([]);
const selectedProduct = ref(null);

const selectedUser = ref(null);
const selectedDeliveryGroup = ref(null);

const selectedService = ref(null);

const addProduct = async () => {
  if (!(await form.value.validate()).valid) return;

  if (!order.value.products)
    order.value.products = {};
  order.value.products[selectedProduct.value] = selectedServices.value;
  selectedServices.value = [];
  selectedProduct.value = null;
};
</script>
