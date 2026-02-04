<template>
  <div ref="mapContainer" style="width:100%; height:100%" />
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { storeToRefs } from 'pinia'
import { useScheduleStore } from '@/stores/schedule'

const map = ref(null)
const mapContainer = ref(null)
const markers = ref([])
const routeLine = ref(null)

const distanceKm = ref(0)
const durationMin = ref(0)
const osmUrl = ref('')

const scheduleStore = useScheduleStore()
const { element: schedule } = storeToRefs(scheduleStore)

const geocode = async (address) => {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
  )
  const data = await res.json()
  return data[0]
    ? { lat: +data[0].lat, lng: +data[0].lon }
    : null
}

const drawRoute = async (coords) => {
  if (coords.length < 2) return

  const coordStr = coords.map(c => `${c.lng},${c.lat}`).join(';')

  osmUrl.value =
    `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=` +
    coords.map(c => `${c.lat},${c.lng}`).join(';')

  const res = await fetch(
    `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`
  )
  const data = await res.json()

  if (!data.routes?.length) return

  const route = data.routes[0]
  distanceKm.value = (route.distance / 1000).toFixed(2)
  durationMin.value = Math.round(route.duration / 60)

  if (routeLine.value)
    map.value.removeLayer(routeLine.value)

  routeLine.value = L.geoJSON(route.geometry).addTo(map.value)
}

const updateMap = async () => {
  if (!map.value) return

  markers.value.forEach(m => map.value.removeLayer(m))
  markers.value = []

  const locations = (await Promise.all(
    schedule.value.schedule_items.map(i =>
      i.address ? geocode(i.address) : null
    )
  )).filter(Boolean)

  locations.forEach((pos, i) => {
    const marker = L.marker([pos.lat, pos.lng], {
      title: (i + 1).toString()
    }).addTo(map.value)

    marker.bindTooltip(`${i + 1}`, {
      permanent: true,
      direction: 'top'
    })

    markers.value.push(marker)
  })

  if (locations.length) {
    const bounds = L.latLngBounds(locations.map(p => [p.lat, p.lng]))
    map.value.fitBounds(bounds)
    await drawRoute(locations)
  }
}

onMounted(() => {
  map.value = L.map(mapContainer.value).setView([41.8719, 12.5674], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value)

  updateMap()
})

watch(
  () => schedule.value.schedule_items,
  updateMap,
  { deep: true }
)
</script>
