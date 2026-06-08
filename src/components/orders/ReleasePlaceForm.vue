<template>
  <div
    v-for="product in Object.keys(order.products)"
    :key="product"
  >
    <b>{{ product }}</b>:<br>
    <i style="font-size: small;">
      {{
        order.products[product].services
          .map(service => typeof service === 'string' ? service : service.name)
          .join(', ')
      }}
    </i>
    <v-select
      v-model="order.products[product].release_collection_point_id"
      :loading="collectionPoints.length == 0"
      label="Luogo di Rilascio"
      class="mt-2"
      :rules="validation.requiredRulesWithZero"
      :items="collectionPoints.concat([{name: 'Veicolo', id: 0}])"
      item-title="name"
      item-value="id"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import http from '@/utils/http';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';

const router = useRouter();
const collectionPoints = ref([]);

const orderStore = useOrderStore();
const { element: order } = storeToRefs(orderStore);

http.getRequest(`order/collection-points/${order.value.id}`, {}, (data) => {
  if (data.status == 'ok')
    collectionPoints.value = data.collection_points;
}, 'GET', router);
</script>
