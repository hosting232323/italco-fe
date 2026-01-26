<template>
  <v-divider />
  <v-list v-if="order.products">
    <v-list-item
      v-for="product in Object.keys(order.products)"
      :key="product"
      append-icon="mdi-delete"
    >
      <v-list-item-title>
        {{ product }}
        <i v-if="order.products[product].rae_product">
          RAEE
        </i>
        [{{ order.products[product].collection_point.name }}]
      </v-list-item-title>
      <v-list-item-subtitle>
        {{ order.products[product].services.map(service => service.name).join(', ') }}
      </v-list-item-subtitle>
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
          v-if="!isRae"
          v-model="selectedProduct"
          :class="isMobile ? '' : 'mr-2'"
          label="Prodotto"
          prepend-icon="mdi-plus"
          :rules="validation.requiredRules"
          @click:prepend="addProduct"
        />
        <v-autocomplete
          v-else
          v-model="selectedRaeProduct"
          :class="isMobile ? '' : 'mr-2'"
          label="Prodotto Rae"
          :items="raeProducts"
          item-title="name"
          item-value="id"
          prepend-icon="mdi-plus"
          :rules="validation.requiredRules"
          @click:prepend="addProduct"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
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
        md="3"
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
      <v-col
        cols="12"
        md="2"
      >
        <v-checkbox
          v-model="isRae"
          label="Ritiro Rae"
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
import { useRaeProductStore } from '@/stores/raeProduct';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const form = ref(null);
const isRae = ref(false);
const router = useRouter();
const selectedServices = ref([]);
const selectedProduct = ref(null);
const selectedService = ref(null);
const selectedRaeProduct = ref(null);
const selectedCollectionPoint = ref(null);
const isMobile = mobile.setupMobileUtils();

const userStore = useUserStore();
const orderStore = useOrderStore();
const serviceStore = useServiceStore();
const raeProductStore = useRaeProductStore();
const collectionPointStore = useCollectionPointStore();

const { role } = storeToRefs(userStore);
const { element: order } = storeToRefs(orderStore);
const services = storesUtils.getStoreList(serviceStore, router);
const raeProducts = storesUtils.getStoreList(raeProductStore, router);
const collectionPoints = storesUtils.getStoreList(collectionPointStore, router);

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
  isRae.value = false;
  selectedServices.value = [];
  selectedService.value = null;
  selectedProduct.value = null;
  selectedRaeProduct.value = null;
  selectedCollectionPoint.value = null;
};

const addProduct = async () => {
  if (!(await form.value.validate()).valid) return;

  if (!order.value.products) order.value.products = {};
  if (isRae.value) selectedProduct.value = raeProducts.value.find(product => product.id == selectedRaeProduct.value).name;

  order.value.products[selectedProduct.value] = {
    services: selectedServices.value,
    collection_point: selectedCollectionPoint.value
  };
  if (isRae.value) order.value.products[selectedProduct.value].rae_product = selectedRaeProduct.value;
  resetFormRow();
};

const resetFields = () => {
  order.value.products = {};
  resetFormRow();
};

defineExpose({ resetFields });
</script>
