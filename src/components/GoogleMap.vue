<template>
  <div ref="mapContainer" style="width: 100%; height: 100%;" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue';

const { orders } = defineProps({
  orders: {
    type: Array,
    default: () => [],
  },
});

const map = ref(null);
const markers = ref([]);
const mapContainer = ref(null);
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const loadGoogleMapsScript = () => {
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

const geocodeAddress = async (address) => {
  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        console.warn(`Geocode non riuscito per ${address}: ${status}`);
        resolve(null);
      }
    });
  });
};

const updateMarkers = async () => {
  if (!map.value) return;

  const googleMaps = window.google.maps;
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];

  (await Promise.all(
    orders.map(order => order.address ? geocodeAddress(order.address) : null)
  )).forEach((pos, i) => {
    if (!pos) return;
    const marker = new googleMaps.Marker({
      position: pos,
      map: map.value,
    });
    markers.value.push(marker);
  });

  if (markers.value.length > 1) {
    const bounds = new googleMaps.LatLngBounds();
    markers.value.forEach(marker => bounds.extend(marker.getPosition()));
    map.value.fitBounds(bounds);
  }
};

onMounted(async () => {
  const googleMaps = await loadGoogleMapsScript();
  const center = await geocodeAddress(orders[0].address);

  map.value = new googleMaps.Map(mapContainer.value, {
    zoom: 10,
    center,
    mapTypeControl: false,
  });

  updateMarkers();
});

watch(
  () => orders,
  () => updateMarkers(),
  { deep: true }
);
</script>
