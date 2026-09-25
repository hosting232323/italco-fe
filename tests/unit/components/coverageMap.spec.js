import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';
import { isProxy } from 'vue';

import CoverageMap from '@/components/operator/deliveryCoverage/CoverageMap.vue';
import { useTransportStore } from '@/stores/transport';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { createTestPinia, mountComponent } from '../../helpers/mount';


// Leaflet in jsdom non ha una mappa vera da disegnare: si sostituisce con un
// registro di cio' che il componente chiede, cosi' si verifica cosa finirebbe
// sulla mappa (quali marker, dove, con che tooltip) senza dipendere dal rendering.
const leaflet = vi.hoisted(() => {
  const created = [];
  const removed = [];
  const listeners = {};
  let nextId = 1;
  const map = {
    setView: vi.fn(function setView() { return this; }),
    addLayer: vi.fn(),
    // Leaflet rimuove i listener usando l'identita' dell'istanza, quindi il componente
    // deve passare a removeLayer lo stesso oggetto che aveva aggiunto.
    removeLayer: vi.fn((layer) => removed.push(layer.id)),
    on: vi.fn((event, callback) => {
      listeners[event] ??= [];
      listeners[event].push(callback);
    }),
    fire: (event, payload) => (listeners[event] || []).forEach((callback) => callback(payload)),
    fitBounds: vi.fn()
  };
  const createShape = (type, coordinates, options) => {
    const shape = {
      id: nextId++,
      type,
      coordinates,
      options,
      added: false,
      tooltip: null,
      bindTooltip: vi.fn((html, tooltipOptions) => {
        shape.tooltip = { html, options: tooltipOptions };
        return shape;
      }),
      closeTooltip: vi.fn(),
      unbindTooltip: vi.fn(),
      addTo: vi.fn(() => {
        shape.added = true;
        map.addLayer(shape);
        return shape;
      })
    };
    created.push(shape);
    return shape;
  };
  const L = {
    map: vi.fn(() => map),
    tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
    control: { zoom: vi.fn(() => ({ addTo: vi.fn() })) },
    FeatureGroup: class { clearLayers() {} addLayer() {} },
    Control: { Draw: class { addTo() {} } },
    Draw: { Event: { CREATED: 'draw:created' } },
    divIcon: vi.fn((options) => options),
    marker: vi.fn((latlng, options) => {
      const marker = { id: nextId++, latlng, options, tooltip: null, tooltipOptions: null, added: false };
      marker.bindTooltip = vi.fn((html, tooltipOptions) => {
        marker.tooltip = html;
        marker.tooltipOptions = tooltipOptions;
        return marker;
      });
      marker.addTo = vi.fn(() => {
        marker.added = true;
        map.addLayer(marker);
        return marker;
      });
      marker.getLatLng = () => ({ lat: latlng[0], lng: latlng[1] });
      created.push(marker);
      return marker;
    }),
    polygon: vi.fn((coordinates, options) => createShape('polygon', coordinates, options)),
    circle: vi.fn((coordinates, options) => createShape('circle', coordinates, options)),
    geoJSON: vi.fn((feature, options) => createShape('geoJSON', feature, options)),
    latLngBounds: vi.fn(() => {
      const bounds = { points: [] };
      bounds.extend = vi.fn((point) => bounds.points.push(point));
      bounds.isValid = () => bounds.points.length > 0;
      return bounds;
    })
  };
  return { L, map, created, removed, listeners };
});

vi.mock('leaflet', () => ({ default: leaflet.L }));
vi.mock('leaflet-draw', () => ({}));


const BARI = { id: 1, name: 'Magazzino Bari', address: 'Via Argiro 1, Bari', lat: 41.1259, lon: 16.8701 };
const MOLFETTA = { id: 2, name: 'Deposito Molfetta', address: 'Via Roma 5, Molfetta', lat: 41.2007, lon: 16.5992 };
const SENZA_COORDINATE = { id: 3, name: 'Indirizzo introvabile', address: 'Via Sconosciuta 9', lat: null, lon: null };


const mountMap = async (collectionPoints, entries = []) => {
  const pinia = createTestPinia();
  const transportStore = useTransportStore();
  transportStore.ready = true;
  transportStore.list = [];
  const collectionPointStore = useCollectionPointStore();
  collectionPointStore.ready = true;
  collectionPointStore.list = collectionPoints;

  const wrapper = mountComponent(CoverageMap, { pinia, props: { entries } });
  await flushPromises();
  await flushPromises();
  return { wrapper, collectionPointStore };
};

// I marker che restano sulla mappa: creati e aggiunti, non ancora rimossi.
const liveMarkers = () => leaflet.created.filter((marker) => marker.added && !leaflet.removed.includes(marker.id));


describe('CoverageMap: punti di ritiro', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leaflet.created.length = 0;
    leaflet.removed.length = 0;
    Object.keys(leaflet.listeners).forEach((event) => delete leaflet.listeners[event]);
  });

  it('mette un marker su ogni punto di ritiro che ha le coordinate', async () => {
    await mountMap([BARI, MOLFETTA]);

    expect(liveMarkers().map((marker) => marker.latlng)).toEqual([
      [BARI.lat, BARI.lon],
      [MOLFETTA.lat, MOLFETTA.lon]
    ]);
  });

  it('nel tooltip mostra nome e indirizzo del punto', async () => {
    await mountMap([BARI]);

    const [marker] = liveMarkers();
    expect(marker.tooltip).toContain('Magazzino Bari');
    expect(marker.tooltip).toContain('Via Argiro 1, Bari');
    expect(marker.tooltipOptions).toEqual({ sticky: true, direction: 'top' });
  });

  it('usa l-icona viola dei punti di ritiro, distinta dalle zone', async () => {
    await mountMap([BARI]);

    const [marker] = liveMarkers();
    expect(marker.options.icon.html).toContain('#6A1B9A');
    expect(marker.options.icon.html).toContain('mdi-storefront');
  });

  it('salta i punti senza coordinate e tiene quelli che le hanno', async () => {
    await mountMap([SENZA_COORDINATE, BARI]);

    expect(liveMarkers()).toHaveLength(1);
    expect(liveMarkers()[0].latlng).toEqual([BARI.lat, BARI.lon]);
  });

  it('senza punti geocodificabili non crea marker e mantiene il centro iniziale', async () => {
    await mountMap([SENZA_COORDINATE]);

    expect(leaflet.created).toHaveLength(0);
    expect(leaflet.map.fitBounds).not.toHaveBeenCalled();
    expect(leaflet.map.setView).toHaveBeenCalledWith([41.1256, 16.8698], 9);
  });

  it('con dei marker mantiene il centro e lo zoom indipendenti dai punti', async () => {
    await mountMap([BARI, MOLFETTA]);

    expect(leaflet.map.fitBounds).not.toHaveBeenCalled();
    expect(leaflet.map.setView).toHaveBeenCalledWith([41.1256, 16.8698], 9);
  });

  it('ridisegna i marker quando cambia la lista dei punti di ritiro', async () => {
    const { collectionPointStore } = await mountMap([BARI]);
    expect(liveMarkers()).toHaveLength(1);

    collectionPointStore.list = [BARI, MOLFETTA];
    await flushPromises();
    await flushPromises();

    // Quelli vecchi vengono tolti prima di rimetterli: nessun marker doppio.
    expect(liveMarkers().map((marker) => marker.latlng)).toEqual([
      [BARI.lat, BARI.lon],
      [MOLFETTA.lat, MOLFETTA.lon]
    ]);
    expect(isProxy(leaflet.map.removeLayer.mock.calls[0][0])).toBe(false);
  });

  it('non dipendono dal giorno scelto: cambiando giorno restano tutti', async () => {
    const { wrapper } = await mountMap([BARI, MOLFETTA]);

    const chips = wrapper.findAll('.day-picker .v-chip');
    await chips[3].trigger('click');
    await flushPromises();
    await flushPromises();

    expect(liveMarkers()).toHaveLength(2);
  });

  it('non mette nessun marker se la company non ha punti di ritiro', async () => {
    await mountMap([]);

    expect(leaflet.created).toHaveLength(0);
  });
});

describe('CoverageMap: zone disegnate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    leaflet.created.length = 0;
    leaflet.removed.length = 0;
    Object.keys(leaflet.listeners).forEach((event) => delete leaflet.listeners[event]);
  });

  const firstDay = (new Date().getDay() + 6) % 7;
  const secondDay = (firstDay + 1) % 7;
  const firstZone = {
    id: 10,
    day_of_week: firstDay,
    transport_id: 1,
    start_time: '08:00:00',
    end_time: '12:00:00',
    caps: [],
    polygon: [[41.1, 16.8], [41.2, 16.8], [41.2, 16.9]]
  };
  const secondZone = {
    ...firstZone,
    id: 11,
    day_of_week: secondDay,
    polygon: [[41.3, 16.8], [41.4, 16.8], [41.4, 16.9]]
  };

  it('mostra il poligono salvato per il giorno selezionato', async () => {
    const { wrapper } = await mountMap([], [firstZone, secondZone]);

    await wrapper.findAll('.day-picker .v-chip')[firstDay].trigger('click');
    await flushPromises();

    const polygon = leaflet.created.find((layer) => layer.type === 'polygon');
    expect(polygon.coordinates).toEqual(firstZone.polygon);
    expect(polygon.tooltip.html).toContain('Zona disegnata');
    expect(polygon.added).toBe(true);
  });

  it('rimanda il cambio zona finché termina lo zoom e rimuove il layer Leaflet originale', async () => {
    const { wrapper } = await mountMap([], [firstZone, secondZone]);
    await wrapper.findAll('.day-picker .v-chip')[firstDay].trigger('click');
    await flushPromises();
    const firstLayer = leaflet.created.find((layer) => layer.type === 'polygon');

    leaflet.map.fire('zoomstart');
    await wrapper.findAll('.day-picker .v-chip')[secondDay].trigger('click');
    await flushPromises();

    expect(leaflet.map.removeLayer).not.toHaveBeenCalled();
    expect(leaflet.created.filter((layer) => layer.type === 'polygon')).toHaveLength(1);

    leaflet.map.fire('zoomend');
    await flushPromises();

    const polygons = leaflet.created.filter((layer) => layer.type === 'polygon');
    expect(polygons).toHaveLength(2);
    expect(leaflet.map.removeLayer).toHaveBeenCalledWith(firstLayer);
    expect(isProxy(leaflet.map.removeLayer.mock.calls[0][0])).toBe(false);
    expect(polygons[1].coordinates).toEqual(secondZone.polygon);
  });
});
