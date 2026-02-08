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
  </div>
</template>

<script setup>
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useScheduleStore } from '@/stores/schedule';

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

const geocode = async (address) => {
  const res = await fetch(
    `https://panificio-mulinobianco.it/nominatim/search?format=json&q=${encodeURIComponent(address)}`
  );
  const data = await res.json();
  return data[0]
    ? { lat: +data[0].lat, lng: +data[0].lon }
    : null;
};

const drawRoute = async (coords) => {
  if (coords.length < 2) return;

  const coordStr = coords.map(c => `${c.lng},${c.lat}`).join(';');

  osmUrl.value =
    'https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=' +
    coords.map(c => `${c.lat},${c.lng}`).join(';');

  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`
  );
  const data = await res.json();

  if (!data.routes?.length) return;

  const route = data.routes[0];
  distanceKm.value = (route.distance / 1000).toFixed(2);
  durationMin.value = Math.round(route.duration / 60);

  if (routeLine.value)
    map.value.removeLayer(routeLine.value);

  routeLine.value = L.geoJSON(route.geometry).addTo(map.value);
};

const updateMap = async () => {
  if (!map.value) return;

  markers.value.forEach(m => map.value.removeLayer(m));
  markers.value = [];

  locations.value = (await Promise.all(
    schedule.value.schedule_items.map(i =>
      i.address ? geocode(i.address) : null
    )
  )).filter(Boolean);

  locations.value.forEach((pos, i) => {
    const marker = L.marker([pos.lat, pos.lng], { icon: redIcon }).addTo(map.value);

    marker.bindTooltip(`${i + 1}`, {
      permanent: true,
      direction: 'top',
      className: 'number-tooltip'
    });

    markers.value.push(marker);
  });

  if (locations.value.length) {
    const bounds = L.latLngBounds(locations.value.map(p => [p.lat, p.lng]));
    map.value.fitBounds(bounds);
    await drawRoute(locations.value);
  }
};

const redIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
  map.value = L.map(mapContainer.value).setView([41.8719, 12.5674], 6);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value);

  updateMap();
});

watch(
  () => schedule.value.schedule_items,
  updateMap,
  { deep: true }
);
</script>

<style>
.number-tooltip {
  background: none;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 14px;
  text-align: center;
  padding: 0;
}
</style>
