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
        <v-col cols="6" v-for="card in cards">
          <v-item v-slot="{ selectedClass, toggle }" :value="card.key">
            <v-card
              @click="toggle"
              :class="['d-flex align-center', selectedClass]"
              height="100"
            >
              <v-card-text style="font-size: larger;">
                {{ card.title }}:
                <b>{{ orders[card.key] ? orders[card.key].length : 0 }}</b>
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
import { ref, onMounted } from 'vue';
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
    title: 'Con anomalia',
    key: 'Anomaly'
  },
  {
    title: 'In ritardo',
    key: 'Delay'
  }
];

const requestGeolocation = () => {
  if (!navigator.geolocation) {
    locationError.value = true;
    return;
  }

  navigator.geolocation.getCurrentPosition(
    position => {
      if (!ready.value) orderStore.initListDelivery(router);
    },
    error => {
      locationError.value = true;
    }
  );
};

onMounted(() => {
  requestGeolocation();
});
</script>

<style scoped>
.selected {
  background-color: var(--item-bg-color);
  color: white;
}
</style>
