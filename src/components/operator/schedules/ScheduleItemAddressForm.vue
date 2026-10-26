<template>
  <v-card
    title="Correggi Indirizzo"
    :subtitle="(element.operation_type == 'Order' ? 'Ordine' : 'Punto di ritiro') +
      ` ID ${element.operation_type == 'Order' ? element.order_id : element.collection_point_id}`"
  >
    <v-card-text>
      <v-form
        ref="form"
        @submit.prevent="submitForm"
      >
        <v-row no-gutters>
          <v-col
            cols="12"
            md="8"
          >
            <AddressAutocomplete
              v-model="address"
              :api-key="GOOGLE_API_KEY"
              :formatted="true"
              :custom-class="isMobile ? '' : 'mr-2'"
              label="Indirizzo"
              :rules="validation.requiredRules"
              @address-components="handleAddressComponents"
              @coordinates="setPosition"
            />
          </v-col>
          <v-col
            cols="12"
            md="4"
          >
            <v-text-field
              v-model="cap"
              :class="isMobile ? '' : 'ml-2'"
              label="CAP"
              :rules="validation.capRules"
            />
          </v-col>
        </v-row>
        <p class="text-body-2 mb-2">
          Scegli l'indirizzo dai suggerimenti oppure clicca sulla mappa il punto esatto
          (per contrade e strade che Google non trova).
        </p>
        <div
          ref="mapContainer"
          class="pin-map mb-2"
        />
        <div
          v-if="error"
          class="text-error mb-2"
        >
          {{ error }}
        </div>
        <FormButtons
          :loading="loading"
          submit-text="Salva"
          @cancel="emits('close-form')"
        />
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FormButtons from '@/components/FormButtons';
import { AddressAutocomplete } from 'generic-module';
import { GOOGLE_API_KEY } from '@/utils/googleMaps';

import { ref, computed, onMounted } from 'vue';
import mobile from '@/utils/mobile';
import { storeToRefs } from 'pinia';
import validation from '@/utils/validation';
import { useOrderStore } from '@/stores/order';
import { useScheduleStore } from '@/stores/schedule';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const { index } = defineProps({
  index: {
    type: Number,
    required: true
  }
});

const form = ref(null);
const error = ref(null);
const loading = ref(false);
const mapContainer = ref(null);
const isMobile = mobile.setupMobileUtils();
const emits = defineEmits(['close-form']);

const orderStore = useOrderStore();
const scheduleStore = useScheduleStore();
const collectionPointStore = useCollectionPointStore();
const { element: schedule, geocodeResults } = storeToRefs(scheduleStore);
const element = computed(() => schedule.value.schedule_items.find(item => item.index === index));
const isOrder = element.value.operation_type === 'Order';

const address = ref(element.value.address);
const cap = ref(element.value.cap);

// La posizione che il backend usera' per zona, capienza e percorso: quella
// salvata, poi quella del posto scelto da Google o cliccato sulla mappa.
const storedPosition = () => {
  const [lat, lng] = isOrder
    ? [element.value.address_lat, element.value.address_lon]
    : [element.value.lat, element.value.lon];
  return lat != null && lng != null ? { lat: +lat, lng: +lng } : null;
};
const position = ref(storedPosition());

let map = null;
let pin = null;

const showPin = () => {
  if (!map) return;
  if (pin) map.removeLayer(pin);
  pin = position.value ? L.circleMarker([position.value.lat, position.value.lng], { radius: 9 }).addTo(map) : null;
  if (position.value) map.setView([position.value.lat, position.value.lng], Math.max(map.getZoom(), 16));
};

// null quando il testo viene ritoccato a mano: finche' non si sceglie un
// suggerimento o si clicca sulla mappa non c'e' una posizione da salvare.
const setPosition = (coordinates) => {
  position.value = coordinates;
  showPin();
};

const handleAddressComponents = (components) => {
  address.value = components.address;
  cap.value = components.cap;
};

onMounted(() => {
  // Senza posizione salvata si parte da dove la mappa del borderò ha messo la tappa.
  const shown = position.value || geocodeResults.value[`${element.value.address}|${element.value.cap}`];
  map = L.map(mapContainer.value).setView(shown ? [shown.lat, shown.lng] : [41.1256, 16.8698], shown ? 15 : 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map);
  map.on('click', (event) => setPosition({ lat: event.latlng.lat, lng: event.latlng.lng }));
  showPin();
  // Il dialog si apre con un'animazione: la mappa va rimisurata a dialog aperto.
  setTimeout(() => map.invalidateSize(), 300);
});

const submitForm = async () => {
  if (!(await form.value.validate()).valid) return;
  if (!position.value) {
    error.value = 'Scegli l\'indirizzo dai suggerimenti o indica la posizione sulla mappa';
    return;
  }

  loading.value = true;
  error.value = null;
  scheduleStore.updateItemAddress(element.value, { address: address.value, cap: cap.value, ...savedPosition() }, callback);
};

const savedPosition = () => isOrder
  ? { address_lat: position.value.lat, address_lon: position.value.lng }
  : { lat: position.value.lat, lon: position.value.lng };

const callback = (data) => {
  loading.value = false;
  if (data.status != 'ok') {
    error.value = data.message;
    return;
  }

  // Tutte le tappe che puntano alla stessa entità vanno allineate, altrimenti
  // la mappa continuerebbe a mostrare la vecchia posizione.
  schedule.value.schedule_items
    .filter(item => item.operation_type === element.value.operation_type && (
      item.operation_type === 'Order'
        ? item.order_id === element.value.order_id
        : item.collection_point_id === element.value.collection_point_id
    ))
    .forEach(item => {
      item.address = address.value;
      item.cap = cap.value;
      Object.assign(item, savedPosition());
    });

  if (isOrder) {
    element.value.version = data.order.version;
    orderStore.initList();
  } else
    collectionPointStore.initList();
  emits('close-form');
};
</script>

<style scoped>
.pin-map {
  height: 240px;
  border-radius: 4px;
}
</style>
