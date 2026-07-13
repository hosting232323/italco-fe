<template>
  <div style="position: relative; width:100%; height:100%">
    <div
      ref="mapContainer"
      style="width:100%; height:100%"
    />

    <div
      style="
        position: absolute;
        top: 10px;
        left: 10px;
        background: rgba(255, 255, 255, 0.9);
        padding: 8px 12px;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-weight: bold;
        font-size: 13px;
        z-index: 1000;
      "
    >
      <div>🚗 Distanza: {{ distanceKm }} km</div>
      <div>🕒 Tempo: {{ durationMin }} min</div>
    </div>

    <div
      style="
        position: absolute;
        top: 10px;
        right: 10px;
        background: #4285F4;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: bold;
        font-size: 13px;
        cursor: pointer;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        z-index: 1000;
      "
      @click="openInGoogleMaps"
    >
      Apri in Google Maps
    </div>
    <div
      v-if="loading"
      class="loading"
    >
      Caricamento...
    </div>
  </div>
</template>

<script setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useScheduleStore } from '@/stores/schedule';

const loading = ref(true);
const locations = ref([]);
const map = ref(null);
const mapContainer = ref(null);
const markers = ref([]);
const routeLine = ref(null);

const distanceKm = ref(0);
const durationMin = ref(0);
const osmUrl = ref('');

const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);

const geocodeCache = new Map();

const searchNominatim = async (query) => {
  try {
    const res = await fetch(
      `https://nominatim.ares-logistics.it/search?format=json&q=${encodeURIComponent(query)}`
    );
    const data = await res.json();

    return data[0]
      ? { lat: +data[0].lat, lng: +data[0].lon }
      : null;
  } catch {
    return null;
  }
};

const simplifyAddress = (address) => address
  .split(',')
  .map(part => part
    .replace(/\b(snc|s\.n\.c\.?)\b/gi, '')
    .replace(/\b\d+\s*\/?\s*[a-z]?(?=\s|,|$)/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim())
  .filter(Boolean)
  .join(', ');

const geocode = async (item) => {
  const cacheKey = `${item.address}|${item.cap}`;
  if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey);

  const queries = [];
  if (item.address) {
    queries.push({ query: item.address, precision: 'full' });
    const simplified = simplifyAddress(item.address);
    if (simplified && simplified !== item.address)
      queries.push({ query: simplified, precision: 'simplified' });
  }
  if (item.cap) queries.push({ query: `${item.cap} Italia`, precision: 'cap' });

  let result = null;
  for (const { query, precision } of queries) {
    const coords = await searchNominatim(query);
    if (coords) {
      result = { ...coords, precision };
      break;
    }
  }

  geocodeCache.set(cacheKey, result);
  return result;
};

const drawRoute = async (coords) => {
  if (coords.length < 2) return;

  const coordStr = coords.map(c => `${c.lng},${c.lat}`).join(';');

  osmUrl.value =
    'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=' +
    coords.map(c => `${c.lat},${c.lng}`).join(';');

  let data;
  try {
    const res = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`
    );
    data = await res.json();
  } catch {
    return;
  }

  if (!data.routes?.length) return;

  const route = data.routes[0];
  distanceKm.value = (route.distance / 1000).toFixed(2);
  durationMin.value = Math.round(route.duration / 60);

  if (routeLine.value)
    map.value.removeLayer(routeLine.value);

  routeLine.value = L.geoJSON(route.geometry).addTo(map.value);
};

let updateToken = 0;

const updateMap = async () => {
  if (!map.value) return;
  const token = ++updateToken;
  loading.value = true;

  try {
    const results = await Promise.all(
      schedule.value.schedule_items.map(async (item) => {
        if (!item.address && !item.cap) return null;

        return await geocode(item);
      })
    );

    if (token !== updateToken) return;

    markers.value.forEach(m => map.value.removeLayer(m));
    markers.value = [];

    locations.value = results.filter(coords => coords);

    locations.value.forEach((pos, i) => {
      const marker = L.marker(
        [pos.lat, pos.lng],
        { icon: numberedIcon(pos.precision, i + 1) }
      ).addTo(map.value);

      markers.value.push(marker);
    });

    if (locations.value.length) {
      const bounds = L.latLngBounds(locations.value.map(p => [p.lat, p.lng]));
      map.value.fitBounds(bounds);
      await drawRoute(locations.value);
    }
  } finally {
    if (token === updateToken) loading.value = false;
  }
};

const precisionColors = {
  full: { background: '#2E7D32', color: 'white' },
  simplified: { background: '#F9A825', color: '#212121' },
  cap: { background: '#C62828', color: 'white' }
};

const numberedIcon = (precision, number) => {
  const { background, color } = precisionColors[precision];
  return L.divIcon({
    className: '',
    html: `<div style="width:28px;height:28px;border-radius:50%;background:${background};color:${color};` +
      'border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.5);display:flex;align-items:center;' +
      `justify-content:center;font-weight:bold;font-size:13px;">${number}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

const openInGoogleMaps = () => {
  if (locations.value.length < 2) return;

  const origin = `${locations.value[0].lat},${locations.value[0].lng}`;
  const destination = `${locations.value[locations.value.length - 1].lat},${locations.value[locations.value.length - 1].lng}`;
  const waypoints = locations.value
    .slice(1, -1)
    .map(p => `${p.lat},${p.lng}`)
    .join('|');

  let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
  if (waypoints) url += `&waypoints=${waypoints}`;

  window.open(url, '_blank');
};

onMounted(() => {
  map.value = L.map(mapContainer.value, {
    zoomControl: false
  }).setView([41.1256, 16.8698], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value);

  L.control.zoom({ position: 'bottomleft' }).addTo(map.value);

  updateMap();
});

watch(
  () => (schedule.value.schedule_items || []).map(item => `${item.address}|${item.cap}`).join(';'),
  updateMap
);
</script>

<style scoped>
.loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  color: white;
  font-size: 18px;
  font-weight: bold;
}
</style>
