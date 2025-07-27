<template>
  <v-list>
    <v-list-item
      v-if="order.products"
      v-for="product in Object.keys(order.products)"
      :title="product"
      append-icon="mdi-delete"
      @click:append="addProduct"
      :subtitle="order.products[product].map(serviceId => services.find(service => service.id == serviceId).name).join(', ')"
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
    <v-row no-gutters v-if="order.type">
      <v-col cols="12" md="6" class="d-flex">
        <v-text-field
          class="flex-grow-1"
          v-model="selectedProduct"
          label="Prodotto"
          :rules="validation.requiredRules"
        />
        <v-btn
          variant="text"
          style="margin: 5px 0 0 2px;"
          icon="mdi-plus"
          @click="addProduct"
          :disabled="!selectedProduct"
          id="button-plus"
        />
      </v-col>
      <v-col cols="12" md="6">
        <v-select
          :class="isMobile ? '' : 'ml-2'"
          v-model="selectedService"
          label="Servizio"
          :items="services.filter(service => service.type == order.type && (role == 'Customer' || service.users.map(user => user.user_id).includes(order.user_id)))"
          item-title="name"
          item-value="id"
          :rules="validation.requiredRules"
          menu
        >
          <template v-slot:item="{ props }">
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
      class="mr-2 mb-5"
      v-for="(serviceId, index) in selectedServices"
      closable
      @click:close="selectedServices.splice(index, 1)"
    >
      {{ services.find(service => service.id == serviceId).name }}
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
</script>
