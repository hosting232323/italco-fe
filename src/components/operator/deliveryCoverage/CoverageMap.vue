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
        Le zone disegnate sono il confine reale del CAP quando disponibile (comuni con un solo CAP: confine ISTAT
        esatto; città con più CAP: zone sub-comunali ricostruite, accuratezza ~97%). Per un CAP fuori dataset viene
        mostrato un punto indicativo. Passa il mouse su una zona per vedere i veicoli e le fasce orarie di quel giorno.
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
        Caricamento zone in corso...
      </div>
      <div
        v-else-if="dayEntries.length === 0"
        class="text-caption text-medium-emphasis mt-2"
      >
        Nessuna copertura per questo giorno.
      </div>

      <p class="text-caption text-medium-emphasis mt-3 mb-0">
        Confini CAP: dataset "Zone CAP Sub-comunali" di
        <a
          href="https://zornade.com/blog/cap-subcomunali-italia-v2-2026-catasto-download-dataset-gis/"
          target="_blank"
          rel="noopener"
        >Zornade</a>
        (Catasto + OpenStreetMap + dati comunali, open data).
      </p>
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

// Zone reali dei CAP di tutta la Puglia: caricate una volta sola e condivise tra
// tutti i mount del componente (calendario <-> mappa).
let capZonesPromise = null;
const loadCapZoneByCap = () => {
  if (!capZonesPromise) {
    capZonesPromise = fetch('/data/cap-zones-puglia.geojson')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const byCap = {};
        for (const feature of data?.features || []) byCap[feature.properties.cap] = feature;
        return byCap;
      })
      .catch(() => ({}));
  }
  return capZonesPromise;
};

// Fallback quando il CAP non e' nel dataset locale (fuori Puglia/BAT): un punto
// indicativo geocodificato via Nominatim self-hosted, come il resto dell'app.
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

const tooltipHtml = (cap, capEntries) => {
  const details = capEntries
    .slice()
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .map((entry) => `<div>${coverage.formatSlot(entry)} &middot; ${transportLabel(entry.transport_id)}</div>`)
    .join('');
  return `<strong>CAP ${cap}</strong>${details}`;
};

let updateToken = 0;

const updateMap = async () => {
  if (!map.value) return;
  const token = ++updateToken;
  loading.value = true;

  // Un blocco copre piu' CAP e piu' CAP possono condividere lo stesso blocco: raggruppa
  // per CAP cosi' ogni zona ha una sola forma, con in tooltip tutti i blocchi che la
  // coprono quel giorno (puo' essere piu' di uno, veicoli diversi sulla stessa fascia o
  // fasce diverse).
  const entriesByCap = {};
  for (const entry of dayEntries.value) {
    for (const cap of entry.caps || []) {
      if (!entriesByCap[cap]) entriesByCap[cap] = [];
      entriesByCap[cap].push(entry);
    }
  }

  const caps = Object.keys(entriesByCap);
  const zoneByCap = await loadCapZoneByCap();
  const missingCaps = caps.filter((cap) => !zoneByCap[cap]);
  const geocodedMissing = await Promise.all(missingCaps.map((cap) => geocodeCap(cap)));
  const geocodedByCap = {};
  missingCaps.forEach((cap, i) => { geocodedByCap[cap] = geocodedMissing[i]; });

  if (token !== updateToken) return;

  clearLayers();

  const bounds = L.latLngBounds([]);
  caps.forEach((cap) => {
    const capEntries = entriesByCap[cap];
    const opacity = Math.min(0.15 + capEntries.length * 0.12, 0.6);
    const style = {
      color: theme.current.value.primaryColor,
      fillColor: theme.current.value.primaryColor,
      fillOpacity: opacity,
      weight: 2
    };

    const zoneFeature = zoneByCap[cap];
    let shape;
    if (zoneFeature) {
      shape = L.geoJSON(zoneFeature, { style });
    } else {
      const position = geocodedByCap[cap];
      if (!position) return;
      shape = L.circle([position.lat, position.lng], { ...style, radius: 900 });
    }
    shape.addTo(map.value);
    bounds.extend(shape.getBounds());

    // bindTooltip su un L.geoJSON (FeatureGroup) non si propaga in modo affidabile
    // ai layer figli in tutte le versioni di Leaflet: lo lego a ciascun layer.
    const tooltip = tooltipHtml(cap, capEntries);
    const tooltipOptions = { sticky: true, direction: 'top' };
    if (typeof shape.eachLayer === 'function')
      shape.eachLayer((layer) => layer.bindTooltip(tooltip, tooltipOptions));
    else
      shape.bindTooltip(tooltip, tooltipOptions);
    layers.value.push(shape);
  });

  if (bounds.isValid()) map.value.fitBounds(bounds, { maxZoom: 13 });

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
