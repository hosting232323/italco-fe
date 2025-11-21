<template>
  <div
    ref="mapContainer"
    style="width: 100%; height: 100%;"
  />
</template>

<script setup>
import { useTheme } from 'vuetify';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useScheduleStore } from '@/stores/schedule';

const map = ref(null);
const markers = ref([]);
const theme = useTheme();
const distanceKm = ref(0);
const durationMin = ref(0);
const googleMapsUrl = ref('');
let directionsRenderer = null;
const mapContainer = ref(null);
const scheduleStore = useScheduleStore();
const { element: schedule } = storeToRefs(scheduleStore);

const geocodeAddress = async (address) => {
  return new Promise((resolve) => {
    new window.google.maps.Geocoder().geocode({ address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        resolve({
          lat: location.lat(),
          lng: location.lng(),
          formatted: results[0].formatted_address
        });
      } else resolve(null);
    });
  });
};

const drawRoute = async () => {
  if (!map.value || schedule.value.schedule_items.length < 2) return;

  const validLocations = (await Promise.all(
    schedule.value.schedule_items.map(item => {
      const address = item.type === 'Delivery'
        ? item.address
        : item.collection_point?.address;
      return address ? geocodeAddress(address) : null;
    })
  )).filter(l => l !== null);

  if (validLocations.length < 2) return;

  const [origin, ...rest] = validLocations;
  const destination = rest.pop();
  const waypoints = rest.map(loc => ({ location: loc, stopover: true }));
  const waypointsParam = waypoints.map(w => encodeURIComponent(w.location.formatted)).join('|');

  googleMapsUrl.value = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin.formatted)}&` +
    `destination=${encodeURIComponent(destination.formatted)}` +
    `${waypointsParam ? `&waypoints=${waypointsParam}` : ''}&travelmode=driving`;

  new window.google.maps.DirectionsService().route(
    {
      origin,
      destination,
      waypoints,
      travelMode: window.google.maps.TravelMode.DRIVING,
      optimizeWaypoints: true
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
            totalDuration += leg.duration.value;
          });
        }

        distanceKm.value = (totalDistance / 1000).toFixed(2);
        durationMin.value = Math.round(totalDuration / 60);
      }
    }
  );
};

const updateMarkers = async () => {
  if (!map.value) return;

  while (markers.value.length > 0)
    markers.value.pop().setVisible(false);

  (await Promise.all(
    schedule.value.schedule_items.map(item => {
      const address = item.type === 'Delivery'
        ? item.address
        : item.collection_point?.address;

      return address ? geocodeAddress(address) : null;
    })
  )).forEach((pos, i) => {
    if (!pos) return;

    const item = schedule.value.schedule_items[i];
    markers.value.push(new window.google.maps.Marker({
      position: pos,
      map: map.value,
      label: {
        text: item.type === 'Delivery'
          ? (item.schedule_index + 1).toString()
          : 'CP',
        color: 'white',
        fontWeight: 'bold'
      }
    }));
  });

  if (markers.value.length > 1) {
    const bounds = new window.google.maps.LatLngBounds();
    markers.value.forEach(marker => bounds.extend(marker.getPosition()));
    map.value.fitBounds(bounds);
  }
};

const addMapButton = () => {
  const controlDiv = document.createElement('div');
  controlDiv.classList.add('map-control-container');

  const controlUI = document.createElement('button');
  controlUI.classList.add('map-button');
  controlUI.style.backgroundColor = theme.current.value.primaryColor;
  controlUI.textContent = 'Apri in Google Maps';
  controlUI.title = 'Apri questo itinerario in Google Maps';
  controlDiv.appendChild(controlUI);

  controlUI.addEventListener('click', () => {
    if (googleMapsUrl.value)
      window.open(googleMapsUrl.value, '_blank');
  });

  map.value.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
};

const addLegend = () => {
  const legendDiv = document.createElement('div');
  legendDiv.classList.add('map-legend');

  const updateLegend = () => {
    const hours = Math.floor(durationMin.value / 60);
    const minutes = durationMin.value % 60;
    legendDiv.innerHTML = `🚗 Distanza: ${distanceKm.value} km<br>🕒 Tempo: ${hours > 0 ? hours + 'h ' : ''}${minutes} min`;
  };

  watch([distanceKm, durationMin], updateLegend);

  updateLegend();
  map.value.controls[window.google.maps.ControlPosition.TOP_LEFT].push(legendDiv);
};

onMounted(async () => {
  while (!window.google?.maps?.places)
    await new Promise((resolve) => setTimeout(resolve, 100));

  const firstDelivery = schedule.value.schedule_items.find(item => item.type === 'Delivery');
  map.value = new window.google.maps.Map(mapContainer.value, {
    zoom: 10,
    mapTypeControl: false,
    center: firstDelivery?.address
      ? await geocodeAddress(firstDelivery.address)
      : { lat: 41.8719, lng: 12.5674 }
  });

  directionsRenderer = new window.google.maps.DirectionsRenderer({
    map: map.value,
    suppressMarkers: true
  });

  updateMarkers();
  drawRoute();
  addLegend();
  addMapButton();
});

watch(
  () => schedule.value.schedule_items,
  () => {
    updateMarkers();
    drawRoute();
  },
  { deep: true }
);
</script>

<style>
.map-control-container {
  margin: 10px;
  text-align: center;
}

.map-button {
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.map-legend {
  background-color: white;
  padding: 8px 12px;
  margin: 10px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  font-size: 14px;
  font-weight: bold;
  text-align: left;
}
</style>
