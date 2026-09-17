<template>
  <v-card class="mb-6">
    <v-toolbar
      :color="theme.current.value.primaryColor"
      density="comfortable"
    >
      <v-toolbar-title>Mappa copertura</v-toolbar-title>
    </v-toolbar>

    <v-card-text>
      <p class="text-medium-emphasis text-caption mb-2">
        I cerchi rappresentano il centro del CAP coperto, non il perimetro esatto della zona.
        Passa il mouse su un cerchio per vedere i veicoli e le fasce orarie di quel giorno.
      </p>

      <div class="day-picker mb-3">
        <v-chip
          v-for="day in weekDayOptions"
          :key="day.value"
          size="small"
          class="mr-2 mb-2 text-capitalize"
          :variant="day.value === selectedDay ? 'flat' : 'outlined'"
          :color="theme.current.value.primaryColor"
          @click="selectedDay = day.value"
        >
          {{ day.title }}
        </v-chip>
      </div>

      <div
        ref="mapContainer"
        class="coverage-map"
      />

      <div
        v-if="loading"
        class="text-caption text-medium-emphasis mt-2"
      >
        Localizzazione dei CAP in corso...
      </div>
      <div
        v-else-if="dayEntries.length === 0"
        class="text-caption text-medium-emphasis mt-2"
      >
        Nessuna copertura per questo giorno.
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useTheme } from 'vuetify';
import days from '@/utils/days';
import coverage from '@/utils/coverage';
import storesUtils from '@/utils/stores';
import { useTransportStore } from '@/stores/transport';

const props = defineProps({
  entries: {
    type: Array,
    required: true
  }
});

const theme = useTheme();
const transportStore = useTransportStore();
const transports = storesUtils.getStoreList(transportStore);

const weekDayOptions = days.weekDays;
const selectedDay = ref(coverage.weekDayIndex(new Date()));

const mapContainer = ref(null);
const map = ref(null);
const layers = ref([]);
const loading = ref(false);

// Stessa istanza self-hosted usata per l'indirizzo ordini/borderò (src/utils/caps.py
// lato BE, OverStreetMap.vue lato FE): un CAP -> centroide, cache in memoria per non
// richiamarla ogni volta che si cambia giorno con gli stessi CAP già visti.
const geocodeCache = {};

const searchNominatim = async (query) => {
  try {
    const res = await fetch(`https://nominatim.fastsite.it/search?format=json&q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data[0] ? { lat: +data[0].lat, lng: +data[0].lon } : null;
  } catch {
    return null;
  }
};

const geocodeCap = async (cap) => {
  if (cap in geocodeCache) return geocodeCache[cap];
  const result = await searchNominatim(`${cap} Italia`);
  geocodeCache[cap] = result;
  return result;
};

const transportLabel = (transportId) => {
  const transport = transports.value.find((item) => item.id === transportId);
  return transport ? `${transport.name} (${transport.plate})` : `Veicolo ID ${transportId}`;
};

const dayEntries = computed(() => coverage.entriesForWeekDay(selectedDay.value, props.entries));

const clearLayers = () => {
  layers.value.forEach((layer) => map.value.removeLayer(layer));
  layers.value = [];
};

let updateToken = 0;

const updateMap = async () => {
  if (!map.value) return;
  const token = ++updateToken;
  loading.value = true;

  // Un blocco copre più CAP e più CAP possono condividere lo stesso blocco: raggruppa
  // per CAP così ogni zona ha un solo cerchio, con in tooltip tutti i blocchi che la coprono
  // quel giorno (può essere più di uno, veicoli diversi sulla stessa fascia o fasce diverse).
  const entriesByCap = {};
  for (const entry of dayEntries.value) {
    for (const cap of entry.caps || []) {
      if (!entriesByCap[cap]) entriesByCap[cap] = [];
      entriesByCap[cap].push(entry);
    }
  }

  const caps = Object.keys(entriesByCap);
  const geocoded = await Promise.all(caps.map((cap) => geocodeCap(cap)));

  if (token !== updateToken) return;

  clearLayers();

  const points = [];
  caps.forEach((cap, index) => {
    const position = geocoded[index];
    if (!position) return;

    points.push(position);
    const capEntries = entriesByCap[cap];
    const opacity = Math.min(0.15 + capEntries.length * 0.12, 0.6);

    const circle = L.circle([position.lat, position.lng], {
      radius: 900,
      color: theme.current.value.primaryColor,
      fillColor: theme.current.value.primaryColor,
      fillOpacity: opacity,
      weight: 2
    }).addTo(map.value);

    const detailsHtml = capEntries
      .slice()
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
      .map((entry) => `<div>${coverage.formatSlot(entry)} &middot; ${transportLabel(entry.transport_id)}</div>`)
      .join('');

    circle.bindTooltip(
      `<strong>CAP ${cap}</strong>${detailsHtml}`,
      { sticky: true, direction: 'top' }
    );

    layers.value.push(circle);
  });

  if (points.length)
    map.value.fitBounds(L.latLngBounds(points.map((p) => [p.lat, p.lng])), { maxZoom: 12 });

  loading.value = false;
};

onMounted(async () => {
  await nextTick();
  map.value = L.map(mapContainer.value, { zoomControl: false }).setView([41.1256, 16.8698], 9);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value);

  L.control.zoom({ position: 'bottomleft' }).addTo(map.value);

  updateMap();
});

watch([dayEntries, () => props.entries], updateMap);
</script>

<style scoped>
.coverage-map {
  width: 100%;
  height: 480px;
  border-radius: 8px;
  overflow: hidden;
}

.day-picker {
  display: flex;
  flex-wrap: wrap;
}
</style>
