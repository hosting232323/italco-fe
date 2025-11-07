<template>
  <div ref="mapContainer" style="width: 100%; height: 100%;"></div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
});

const map = ref(null);
const markers = ref([]);
const mapContainer = ref(null);

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

function loadGoogleMapsScript() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initMap() {
  const googleMaps = await loadGoogleMapsScript();
  console.log(props.orders)
  const center = props.orders.length
    ? { lat: props.orders[0].latitude || 45.4642, lng: props.orders[0].longitude || 9.19 }
    : { lat: 45.4642, lng: 9.19 };

  map.value = new googleMaps.Map(mapContainer.value, {
    zoom: 10,
    center,
    mapTypeControl: false,
  });

  updateMarkers();
}

// Crea o aggiorna i marker
function updateMarkers() {
  if (!map.value) return;
  const googleMaps = window.google.maps;

  // Rimuove marker precedenti
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];

  // Aggiunge nuovi marker
  props.orders.forEach(order => {
    if (!order.latitude || !order.longitude) return;

    const marker = new googleMaps.Marker({
      position: { lat: order.latitude, lng: order.longitude },
      map: map.value,
      label: `${order.id}`,
    });
    markers.value.push(marker);
  });

  // Adatta lo zoom se ci sono più marker
  if (markers.value.length > 1) {
    const bounds = new googleMaps.LatLngBounds();
    markers.value.forEach(marker => bounds.extend(marker.getPosition()));
    map.value.fitBounds(bounds);
  }
}

onMounted(() => {
  initMap();
});

// Aggiorna la mappa ogni volta che cambia la lista ordini
watch(
  () => props.orders,
  () => updateMarkers(),
  { deep: true }
);
</script>
