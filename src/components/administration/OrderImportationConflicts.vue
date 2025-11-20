<template>
  <v-form
    ref="form"
    @submit.prevent="submitConflictsForm"
  >
    <v-row
      v-for="order in conflictsOrders"
      :key="order['Rif. Com']"
    >
      <v-col cols="6">
        Ordine: {{ order['Rif. Com'] }}<br>
        DPC: {{ order['DPC'] }}<br>
        DRC: {{ order['DRC'] }}<br>
        Indirizzo: {{ order['Indirizzo Dest.'] }} {{ order['Localita'] }}<br>
      </v-col>
      <v-col cols="6">
        <template
          v-for="product in Object.keys(order.products)"
          :key="product"
        >
          <p>
            Prodotto: {{ product }}
          </p>
          <v-chip
            v-for="(serviceId, index) in order.products[product]"
            :key="index"
            class="mb-2"
          >
            {{ serviceNames[serviceId] }}
          </v-chip>
          <v-select
            v-model="selectedServices[order['Rif. Com'] + product]"
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
</template>

<script setup>
import { ref } from 'vue';
import http from '@/utils/http';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';

const props = defineProps({
  isActive: {
    type: Boolean,
    required: true
  },
  conflictsOrders: {
    type: Array,
    required: true
  },
  collectionPoint: {
    type: Number,
    required: true
  }
});

const form = ref(null);
const theme = useTheme();
const loading = ref(false);
const router = useRouter();
const serviceNames = ref({});
const selectedServices = ref({});
const orderStore = useOrderStore();
const emits = defineEmits(['cancel']);
const { ready } = storeToRefs(orderStore);

const submitConflictsForm = () => {
  loading.value = true;
  http.postRequest('import/conflict', {
    orders: props.conflictsOrders,
    collection_point_id: props.collectionPoint
  }, function (data) {
    loading.value = false;
    if (data.status == 'ok') {
      if (data.imported_orders_count > 0)
        alert(`Importati ${data.imported_orders_count} ordini con successo.`);

      ready.value = false;
      orderStore.initList(router);
      emits('cancel');
    }
  }, 'POST', router);
};

const selectService = (order, product) => {
  const serviceId = selectedServices.value[order['Rif. Com'] + product];
  order.products[product].push(serviceId);
  selectedServices.value[order['Rif. Com'] + product] = null;
  const serviceIndex = order.services.findIndex(service => service.id === serviceId);
  serviceNames.value[serviceId] = order.services[serviceIndex].name;
  order.services.splice(serviceIndex, 1);
};
</script>
