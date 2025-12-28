<template>
  <v-divider />
  <v-list v-if="order.products">
    <v-list-item
      v-for="product in Object.keys(order.products)"
      :key="product"
      :title="`${product} [${order.products[product].collection_point.name}]`"
      append-icon="mdi-delete"
      :subtitle="order.products[product].services.map(service => service.name).join(', ')"
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
        md="4"
      >
        <v-text-field
          v-model="selectedProduct"
          :class="isMobile ? '' : 'mr-2'"
          label="Prodotto"
          prepend-icon="mdi-plus"
          :rules="validation.requiredRules"
          @click:prepend="addProduct"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
      >
        <v-select
          v-model="selectedService"
          :class="isMobile ? '' : 'ml-2 mr-2'"
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
      <v-col
        cols="12"
        md="4"
      >
        <v-autocomplete
          v-model="selectedCollectionPoint"
          :class="isMobile ? '' : 'ml-2'"
          label="Punto di Ritiro"
          :items="filteredCollectionPoints"
          item-title="name"
          :rules="validation.requiredRules"
          return-object
          :disabled="filteredCollectionPoints.length == 1"
        />
      </v-col>
    </v-row>
    <template v-else>
      <br>
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
  <v-divider class="mb-4" />
</template>

<script setup>
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import storesUtils from '@/utils/stores';
import validation from '@/utils/validation';
import { useUserStore } from '@/stores/user';
import { useOrderStore } from '@/stores/order';
import { useServiceStore } from '@/stores/service';
import { ref, computed, watch, nextTick } from 'vue';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const form = ref(null);
const router = useRouter();
const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const { role } = storeToRefs(userStore);
const isMobile = mobile.setupMobileUtils();
const collectionPointStore = useCollectionPointStore();
const { element: order } = storeToRefs(orderStore);
const services = storesUtils.getStoreList(serviceStore, router);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

const selectedServices = ref([]);
const selectedProduct = ref(null);
const selectedService = ref(null);
const selectedCollectionPoint = ref(null);

const filteredCollectionPoints = computed(() => {
  return role.value === 'Customer'
    ? collectionPoints.value
    : collectionPoints.value.filter(cp => cp.user_id === order.value.user_id);
});

watch([filteredCollectionPoints, () => selectedCollectionPoint.value], async ([list, selected]) => {
  if (list.length === 1 && !selected) {
    await nextTick();
    selectedCollectionPoint.value = list[0];
  }
}, { immediate: true });

const resetFormRow = () => {
  selectedServices.value = [];
  selectedService.value = null;
  selectedProduct.value = null;
  selectedCollectionPoint.value = null;
};

const addProduct = async () => {
  if (!(await form.value.validate()).valid) return;

  if (!order.value.products) order.value.products = {};
  order.value.products[selectedProduct.value] = {
    services: selectedServices.value,
    collection_point: selectedCollectionPoint.value
  };
  resetFormRow();
};

const resetFields = () => {
  order.value.products = {};
  resetFormRow();
};

defineExpose({ resetFields });
</script>
