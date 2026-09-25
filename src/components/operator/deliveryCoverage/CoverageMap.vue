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
        Usa lo strumento poligono in alto a destra sulla mappa per disegnare un nuovo blocco di copertura per zona
        invece che per CAP. I marker viola sono i punti di ritiro dei clienti della company, validi per tutti i
        giorni.
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
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue';
import { useTheme } from 'vuetify';
import days from '@/utils/days';
import coverage from '@/utils/coverage';
import storesUtils from '@/utils/stores';
import { useTransportStore } from '@/stores/transport';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';
import { useCollectionPointStore } from '@/stores/collectionPoint';

const props = defineProps({
  entries: {
    type: Array,
    required: true
  }
});

const theme = useTheme();
const transportStore = useTransportStore();
const transports = storesUtils.getStoreList(transportStore);
const coverageStore = useDeliveryCoverageStore();
const collectionPointStore = useCollectionPointStore();
const collectionPoints = storesUtils.getStoreList(collectionPointStore);

const weekDayOptions = days.weekDays;
const selectedDay = ref(coverage.weekDayIndex(new Date()));

// Arancione acceso, fisso (non da theme): deve restare ben visibile sia in tema
// chiaro che scuro e distinguersi sempre dal colore primario usato per le zone CAP.
const DRAWN_ZONE_COLOR = '#e65100';

// Viola fisso, distinto sia dall'arancione delle zone disegnate sia dal colore
// primario delle zone CAP: i punti di ritiro non sono legati a un giorno, quindi
// devono restare riconoscibili su qualunque combinazione di colori del tema.
const COLLECTION_POINT_COLOR = '#6A1B9A';
const collectionPointIcon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50%;background:${COLLECTION_POINT_COLOR};` +
    'color:white;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.5);display:flex;' +
    'align-items:center;justify-content:center;"><i class="mdi mdi-storefront" style="font-size:15px;"></i></div>',
  iconSize: [26, 26],
  iconAnchor: [13, 13]
});

const mapContainer = ref(null);
// Le istanze Leaflet non devono passare attraverso i Proxy profondi di Vue:
// Leaflet rimuove i listener usando l'identita' dell'istanza come context.
const map = shallowRef(null);
const layers = [];
const collectionPointLayers = [];
const drawnLayer = shallowRef(null);
const loading = ref(false);
let mapIsZooming = false;
let mapIsMoving = false;
const pendingLayerRenders = new Map();

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

const closeLayerTooltips = (layer) => {
  if (typeof layer.eachLayer === 'function') layer.eachLayer(closeLayerTooltips);
  layer.closeTooltip?.();
};

const closeMapTooltips = () => {
  layers.forEach(closeLayerTooltips);
  collectionPointLayers.forEach(closeLayerTooltips);
  if (drawnLayer.value) closeLayerTooltips(drawnLayer.value);
};

const flushPendingLayerRender = () => {
  if (mapIsZooming || mapIsMoving || pendingLayerRenders.size === 0) return;
  const renders = [...pendingLayerRenders.values()];
  pendingLayerRenders.clear();
  renders.forEach((render) => render());
};

const scheduleLayerRender = (key, render) => {
  pendingLayerRenders.set(key, render);
  flushPendingLayerRender();
};

const clearLayers = () => {
  const detachTooltips = (layer) => {
    if (typeof layer.eachLayer === 'function') layer.eachLayer(detachTooltips);
    layer.closeTooltip?.();
    layer.unbindTooltip?.();
  };

  layers.forEach((layer) => {
    detachTooltips(layer);
    map.value.removeLayer(layer);
  });
  layers.length = 0;
};

const clearCollectionPointLayers = () => {
  collectionPointLayers.forEach((layer) => {
    layer.closeTooltip?.();
    layer.unbindTooltip?.();
    map.value.removeLayer(layer);
  });
  collectionPointLayers.length = 0;
};

const updateCollectionPointLayers = () => {
  if (!map.value) return;
  const points = collectionPoints.value
    .filter((point) => point.lat != null && point.lon != null);
  scheduleLayerRender('collection-points', () => {
    if (!map.value) return;
    clearCollectionPointLayers();

    points.forEach((point) => {
      const marker = L.marker([point.lat, point.lon], { icon: collectionPointIcon });
      marker.bindTooltip(`<strong>${point.name}</strong><div>${point.address}</div>`, {
        sticky: true,
        direction: 'top'
      });
      marker.addTo(map.value);
      collectionPointLayers.push(marker);
    });
  });
};

const tooltipHtml = (cap, capEntries) => {
  const details = capEntries
    .slice()
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
    .map((entry) => `<div>${coverage.formatSlot(entry)} &middot; ${transportLabel(entry.transport_id)}</div>`)
    .join('');
  return `<strong>CAP ${cap}</strong>${details}`;
};

const polygonTooltipHtml = (entry) =>
  `<strong>Zona disegnata</strong><div>${coverage.formatSlot(entry)} &middot; ${transportLabel(entry.transport_id)}</div>`;

let updateToken = 0;
let mapResizeObserver = null;

const updateMap = async () => {
  if (!map.value) return;
  const token = ++updateToken;
  closeMapTooltips();
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

  scheduleLayerRender('coverage-zones', () => {
    if (!map.value || token !== updateToken) return;
    clearLayers();

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

      // bindTooltip su un L.geoJSON (FeatureGroup) non si propaga in modo affidabile
      // ai layer figli in tutte le versioni di Leaflet: lo lego a ciascun layer.
      const tooltip = tooltipHtml(cap, capEntries);
      const tooltipOptions = { sticky: true, direction: 'top' };
      if (typeof shape.eachLayer === 'function')
        shape.eachLayer((layer) => layer.bindTooltip(tooltip, tooltipOptions));
      else
        shape.bindTooltip(tooltip, tooltipOptions);
      layers.push(shape);
    });

    // Blocchi disegnati sulla mappa: un poligono per entry (non raggruppati per CAP,
    // perché non ne hanno). Colore fisso e acceso (non theme.secondaryColor, troppo
    // chiaro in questo tema e quasi invisibile) per distinguerli a colpo d'occhio
    // dalle zone CAP.
    dayEntries.value
      .filter((entry) => (entry.polygon || []).length >= 3)
      .forEach((entry) => {
        const shape = L.polygon(entry.polygon, {
          color: DRAWN_ZONE_COLOR,
          fillColor: DRAWN_ZONE_COLOR,
          fillOpacity: 0.35,
          weight: 3
        });
        shape.addTo(map.value);
        shape.bindTooltip(polygonTooltipHtml(entry), { sticky: true, direction: 'top' });
        layers.push(shape);
      });

    loading.value = false;
  });
};

onMounted(async () => {
  await nextTick();
  // Centro stabile in Puglia: l'inquadratura non dipende dal giorno selezionato
  // o dalle geometrie caricate e resta sotto il controllo dell'utente.
  map.value = L.map(mapContainer.value, {
    zoomControl: false
  }).setView([41.1256, 16.8698], 9);

  map.value.on('zoomstart', () => {
    mapIsZooming = true;
    closeMapTooltips();
  });
  map.value.on('zoomend', () => {
    mapIsZooming = false;
    flushPendingLayerRender();
  });
  map.value.on('movestart', () => {
    mapIsMoving = true;
    closeMapTooltips();
  });
  map.value.on('moveend', () => {
    mapIsMoving = false;
    flushPendingLayerRender();
  });

  // Il drawer laterale si espande al passaggio del mouse senza ridimensionare
  // la finestra: Leaflet non intercetta quel cambio di larghezza da solo.
  mapResizeObserver = new ResizeObserver(() => {
    map.value?.invalidateSize({ pan: false, debounceMoveend: true });
  });
  mapResizeObserver.observe(mapContainer.value);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap'
  }).addTo(map.value);

  L.control.zoom({ position: 'bottomleft' }).addTo(map.value);

  // Strumento di disegno per creare un blocco di copertura per zona invece che per
  // CAP: un solo poligono alla volta, sostituito dal form appena disegnato (non
  // resta come layer permanente, torna a farne parte l'entry salvata dal backend).
  drawnLayer.value = new L.FeatureGroup();
  map.value.addLayer(drawnLayer.value);

  new L.Control.Draw({
    position: 'topright',
    draw: {
      polygon: { allowIntersection: false, showArea: false, shapeOptions: { color: DRAWN_ZONE_COLOR } },
      polyline: false,
      rectangle: false,
      circle: false,
      circlemarker: false,
      marker: false
    },
    edit: false
  }).addTo(map.value);

  map.value.on(L.Draw.Event.CREATED, (event) => {
    drawnLayer.value.clearLayers();
    drawnLayer.value.addLayer(event.layer);
    const polygon = event.layer.getLatLngs()[0].map((point) => [point.lat, point.lng]);
    coverageStore.element = { caps: [], polygon };
    coverageStore.entryForm = true;
  });

  updateCollectionPointLayers();
  updateMap();
});

onBeforeUnmount(() => {
  updateToken++;
  pendingLayerRenders.clear();
  mapResizeObserver?.disconnect();
  mapResizeObserver = null;
  closeMapTooltips();
  map.value?.remove();
  map.value = null;
});

// La zona appena disegnata resta visibile mentre il form è aperto (anteprima), e
// sparisce alla chiusura: se è stata salvata, updateMap la ridisegna dai dati veri.
watch(
  () => coverageStore.entryForm,
  (open) => {
    if (!open) drawnLayer.value?.clearLayers();
  }
);

watch([dayEntries, () => props.entries], updateMap);
watch(collectionPoints, updateCollectionPointLayers);
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

/* Leaflet rende le zone (path SVG) focusabili per accessibilita': un click
   attiva il focus ring nero di default del browser sull'intero bounding box. */
.coverage-map :deep(.leaflet-interactive:focus) {
  outline: none;
}
</style>
