import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import CoverageMap from '@/components/operator/deliveryCoverage/CoverageMap.vue';
import { useTransportStore } from '@/stores/transport';
import { useCollectionPointStore } from '@/stores/collectionPoint';
import { useAdministrationUserStore } from '@/stores/administrationUser';
import { createTestPinia, mountComponent } from '../../helpers/mount';


// Leaflet in jsdom non ha una mappa vera da disegnare: si sostituisce con un
// registro di cio' che il componente chiede, cosi' si verifica cosa finirebbe
// sulla mappa (quali marker, dove, con che tooltip) senza dipendere dal rendering.
const leaflet = vi.hoisted(() => {
  const created = [];
  const removed = [];
  let nextId = 1;
  const map = {
    setView: vi.fn(function setView() { return this; }),
    addLayer: vi.fn(),
    // Il componente tiene i layer in un ref di Vue: a removeLayer arriva un Proxy, non
    // l'oggetto grezzo. Si registra l'id, che passa uguale attraverso il Proxy.
    removeLayer: vi.fn((layer) => removed.push(layer.id)),
    on: vi.fn(),
    fitBounds: vi.fn()
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
        return marker;
      });
      marker.getLatLng = () => ({ lat: latlng[0], lng: latlng[1] });
      created.push(marker);
      return marker;
    }),
    latLngBounds: vi.fn(() => {
      const bounds = { points: [] };
      bounds.extend = vi.fn((point) => bounds.points.push(point));
      bounds.isValid = () => bounds.points.length > 0;
      return bounds;
    })
  };
  return { L, map, created, removed };
});

vi.mock('leaflet', () => ({ default: leaflet.L }));
vi.mock('leaflet-draw', () => ({}));


const BARI = { id: 1, name: 'Magazzino Bari', address: 'Via Argiro 1, Bari', lat: 41.1259, lon: 16.8701 };
const MOLFETTA = { id: 2, name: 'Deposito Molfetta', address: 'Via Roma 5, Molfetta', lat: 41.2007, lon: 16.5992 };
const SENZA_COORDINATE = { id: 3, name: 'Indirizzo introvabile', address: 'Via Sconosciuta 9', lat: null, lon: null };


const mountMap = async (collectionPoints, users = []) => {
  const pinia = createTestPinia();
  const transportStore = useTransportStore();
  transportStore.ready = true;
  transportStore.list = [];
  const collectionPointStore = useCollectionPointStore();
  collectionPointStore.ready = true;
  collectionPointStore.list = collectionPoints;
  const administrationUserStore = useAdministrationUserStore();
  administrationUserStore.ready = true;
  administrationUserStore.list = users;

  const wrapper = mountComponent(CoverageMap, { pinia, props: { entries: [] } });
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

  it('senza nessun punto geocodificabile non mette marker e non inquadra la mappa', async () => {
    await mountMap([SENZA_COORDINATE]);

    expect(leaflet.created).toHaveLength(0);
    expect(leaflet.map.fitBounds).not.toHaveBeenCalled();
  });

  it('mostra ID, nome e ragione sociale per i punti senza coordinate', async () => {
    const point = { ...SENZA_COORDINATE, user_id: 17 };
    const { wrapper } = await mountMap([point], [{
      id: 17,
      customer_user_info: { company_name: 'Acme S.r.l.' }
    }]);

    expect(wrapper.text()).toContain('ID 3 — Indirizzo introvabile — Acme S.r.l.');
  });

  it('con dei marker inquadra la mappa senza zoomare oltre il livello 13', async () => {
    await mountMap([BARI, MOLFETTA]);

    expect(leaflet.map.fitBounds).toHaveBeenCalledTimes(1);
    expect(leaflet.map.fitBounds.mock.calls[0][1]).toEqual({ maxZoom: 13 });
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
