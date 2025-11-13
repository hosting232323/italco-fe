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
const distanceKm = ref(0);
const durationMin = ref(0);
const googleMapsUrl = ref('');
const mapContainer = ref(null);
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

let directionsService = null;
let directionsRenderer = null;

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
};

const geocodeAddress = async (address) => {
  return new Promise((resolve) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted: results[0].formatted_address,
        });
      } else {
        console.warn(`Geocode non riuscito per ${address}: ${status}`);
        resolve(null);
      }
    });
  });
};

const drawRoute = async () => {
  if (!map.value || orders.length < 2) return;

  const locations = await Promise.all(
    orders.map(order => order.address ? geocodeAddress(order.address) : null)
  );

  const validLocations = locations.filter(l => l !== null);
  if (validLocations.length < 2) return;

  const [origin, ...rest] = validLocations;
  const destination = rest.pop();
  const waypoints = rest.map(loc => ({ location: loc, stopover: true }));

  const originParam = encodeURIComponent(origin.formatted);
  const destinationParam = encodeURIComponent(destination.formatted);
  const waypointsParam = waypoints.map(w => encodeURIComponent(w.location.formatted)).join('|');

  googleMapsUrl.value = `https://www.google.com/maps/dir/?api=1&origin=${originParam}&destination=${destinationParam}${
    waypointsParam ? `&waypoints=${waypointsParam}` : ''
  }&travelmode=driving`;

  directionsService.route(
    {
      origin,
      destination,
      waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true,
    },
    (response, status) => {
      if (status === 'OK') {
        directionsRenderer.setDirections(response);
        let totalDistance = 0;
        let totalDuration = 0;
        const route = response.routes[0];
        if (route && route.legs) {
          route.legs.forEach((leg) => {
            totalDistance += leg.distance.value;
            totalDuration+= leg.duration.value;
          });
        }

        distanceKm.value = (totalDistance / 1000).toFixed(2);
        durationMin.value = Math.round(totalDuration / 60);
      } else {
        console.warn('Errore nella creazione dell’itinerario:', status);
      }
    }
  );
};

const updateMarkers = async () => {
  if (!map.value) return;

  const googleMaps = window.google.maps;
  markers.value.forEach(marker => marker.setMap(null));
  markers.value = [];

  const positions = await Promise.all(
    orders.map(order => order.address ? geocodeAddress(order.address) : null)
  );

  positions.forEach((pos, i) => {
    if (!pos) return;
    const marker = new googleMaps.Marker({
      position: pos,
      map: map.value,
      label: {
        text: (orders[i].schedule_index + 1).toString(), // oppure direttamente orders[i].schedule_index
        color: "white",
        fontWeight: "bold",
      }
    });
    markers.value.push(marker);
  });

  if (markers.value.length > 1) {
    const bounds = new googleMaps.LatLngBounds();
    markers.value.forEach(marker => bounds.extend(marker.getPosition()));
    map.value.fitBounds(bounds);
  }
};

const addMapButton = (googleMaps) => {
  const controlDiv = document.createElement('div');
  controlDiv.style.margin = '10px';
  controlDiv.style.textAlign = 'center';

  const controlUI = document.createElement('button');
  controlUI.style.backgroundColor = '#1a73e8';
  controlUI.style.color = 'white';
  controlUI.style.border = 'none';
  controlUI.style.borderRadius = '6px';
  controlUI.style.padding = '8px 12px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.fontSize = '14px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  controlUI.textContent = 'Apri in Google Maps';
  controlUI.title = 'Apri questo itinerario in Google Maps';
  controlDiv.appendChild(controlUI);

  controlUI.addEventListener('click', () => {
    if (googleMapsUrl.value) {
      window.open(googleMapsUrl.value, '_blank');
    }
  });

  map.value.controls[googleMaps.ControlPosition.TOP_RIGHT].push(controlDiv);
};

const addLegend = (googleMaps) => {
  const legendDiv = document.createElement('div');
  legendDiv.style.backgroundColor = 'white';
  legendDiv.style.padding = '8px 12px';
  legendDiv.style.margin = '10px';
  legendDiv.style.borderRadius = '6px';
  legendDiv.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
  legendDiv.style.fontSize = '14px';
  legendDiv.style.fontWeight = 'bold';
  legendDiv.style.textAlign = 'left';

  const updateLegend = () => {
    const hours = Math.floor(durationMin.value / 60);
    const minutes = durationMin.value % 60;
    legendDiv.innerHTML = `🚗 Distanza: ${distanceKm.value} km<br>🕒 Tempo: ${hours > 0 ? hours + 'h ' : ''}${minutes} min`;
  };

  watch([distanceKm, durationMin], updateLegend);

  updateLegend();
  map.value.controls[googleMaps.ControlPosition.TOP_LEFT].push(legendDiv);
};

onMounted(async () => {
  const googleMaps = await loadGoogleMapsScript();
  
    const center = orders[0]?.address
    ? await geocodeAddress(orders[0].address)
    : { lat: 41.8719, lng: 12.5674 };

  map.value = new googleMaps.Map(mapContainer.value, {
    zoom: 10,
    center,
    mapTypeControl: false,
  });

  directionsService = new googleMaps.DirectionsService();
  directionsRenderer = new googleMaps.DirectionsRenderer({ map: map.value, suppressMarkers: true });

  await updateMarkers();
  await drawRoute();

  addLegend(googleMaps);
  addMapButton(googleMaps);
});

watch(
  () => orders,
  async () => {
    await updateMarkers();
    await drawRoute();
  },
  { deep: true }
);
</script>
