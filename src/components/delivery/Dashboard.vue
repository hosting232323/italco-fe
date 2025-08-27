<template>
  <div v-if="!locationError && ready">
    <br><b>
      Totale ordini: {{ Object.values(orders).reduce((sum, arr) => sum + arr.length, 0) }}
    </b><br><br>
    <v-item-group
      selected-class="selected"
      :style="{ '--item-bg-color': theme.current.value.primaryColor }"
      v-model="selectedCard"
    >
      <v-row>
        <v-col :cols="(card.key === 'Delay' || card.key === 'Anomaly') ? 2 : 4" v-for="card in cards" :key="card.key">
          <v-item v-slot="{ selectedClass, toggle }" :value="card.key">
            <v-card
              @click="toggle"
              :class="['d-flex align-center', selectedClass]"
              height="100"
            >
              <v-card-text style="font-size: larger;">
                {{ card.title }}: <b>{{ cardCounts[card.key] }}</b>
              </v-card-text>
            </v-card>
          </v-item>
        </v-col>
      </v-row>
    </v-item-group>
    <Table :keyName="selectedCard" />
  </div>

  <div v-else-if="locationError" class="text-center mt-10">
    <v-alert type="error" border="start" color="red" prominent>
      ⚠️ Per usare questa funzionalità devi <strong>abilitare la geolocalizzazione</strong>.<br>
      Ricarica la pagina e consenti i permessi quando richiesto.
    </v-alert>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { useOrderStore } from '@/stores/order';

import Table from '@/components/delivery/Table';

const locationError = ref(false); 
const selectedCard = ref('In Progress');
const theme = useTheme();
const router = useRouter();
const orderStore = useOrderStore();
const { list: orders, ready } = storeToRefs(orderStore);


const cards = [
  {
    title: 'Da caricare',
    key: 'In Progress'
  },
  {
    title: 'A bordo',
    key: 'On Board'
  },
  {
    title: 'Anomalia',
    key: 'Anomaly'
  },
  {
    title: 'Ritardo',
    key: 'Delay'
  },
  {
    title: 'Completato',
    key: 'Completed'
  },
  {
    title: 'Non Consegnato',
    key: 'Cancelled'
  },
  {
    title: 'In Magazzino',
    key: 'At Warehouse'
  },
];

const cardCounts = computed(() => {
  const anomalyOrders = [];
  const delayOrders = [];


  for (const key of ['In Progress', 'On Board']) {
    const list = orders.value[key] || [];
    list.forEach(order => {
      if (order.anomaly) anomalyOrders.push(order);
      if (order.delay) delayOrders.push(order);
    });
  }


  return {
    'In Progress': orders.value['In Progress']?.length || 0,
    'On Board': orders.value['On Board']?.length || 0,
    'Completed': orders.value['Completed']?.length || 0,
    'Cancelled': orders.value['Cancelled']?.length || 0,
    'At Warehouse': orders.value['At Warehouse']?.length || 0,
    'Anomaly': anomalyOrders.length,
    'Delay': delayOrders.length
  };
});

onMounted(() => {
  if (!navigator.geolocation) {
    locationError.value = true;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    () => {
      if (!ready.value) orderStore.initListDelivery(router);
    },
    () => {
      locationError.value = true;
    }
  );
});
</script>

<style scoped>
.selected {
  background-color: var(--item-bg-color);
  color: white;
}
</style>
