<template>
  <v-list v-if="order.products">
    <v-list-item
      v-for="product in Object.keys(order.products)"
      :key="product"
      :title="product"
      append-icon="mdi-delete"
      :subtitle="order.products[product].map(service => service.name).join(', ')"
      @click:append="addProduct"
    >
      <template #append>
        <v-icon
          icon="mdi-delete"
          @click.stop="delete order.products[product]"
        />
      </template>
    </v-list-item>
  </v-list>
  <v-form ref="form">
    <v-row
      v-if="order.type"
      no-gutters
    >
      <v-col
        cols="12"
        md="6"
      >
        <v-text-field
          v-model="selectedProduct"
          :class="isMobile ? '' : 'mr-2'"
          label="Prodotto"
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
          v-model="selectedService"
          :class="isMobile ? '' : 'ml-2'"
          label="Servizio"
          :items="services.filter(service => service.type == order.type &&
            (role == 'Customer' || service.users.map(user => user.user_id).includes(order.user_id)))"
          item-title="name"
          :rules="validation.requiredRules"
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
    <template v-else>
      Seleziona un tipo di ordine
      <br><br>
    </template>
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

const form = ref(null);
const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const { role } = storeToRefs(userStore);
const isMobile = mobile.setupMobileUtils();
const { element: order } = storeToRefs(orderStore);
const services = storesUtils.getStoreList(serviceStore, router);

const selectedServices = ref([]);
const selectedProduct = ref(null);
const selectedService = ref(null);

const addProduct = async () => {
  if (!(await form.value.validate()).valid) return;

  if (!order.value.products)
    order.value.products = {};
  order.value.products[selectedProduct.value] = selectedServices.value;
  selectedServices.value = [];
  selectedProduct.value = null;
};

const resetFields = () => {
  selectedServices.value = [];
  selectedProduct.value = null;
  selectedService.value = null;
  order.value.products = {};
};

defineExpose({ resetFields });
</script>
