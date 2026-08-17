import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, defineStore, setActivePinia } from 'pinia';

import storesUtils from '@/utils/stores';


const useFakeStore = defineStore('fake', {
  state: () => ({ list: [], ready: false }),
  actions: {
    initList() {
      this.list = ['caricata'];
      this.ready = true;
    },
    setList(data) {
      this.list = data;
      this.ready = true;
    }
  }
});


describe('getStoreList', () => {
  beforeEach(() => setActivePinia(createPinia()));

  it('carica la lista la prima volta', () => {
    const store = useFakeStore();

    const list = storesUtils.getStoreList(store);

    expect(list.value).toEqual(['caricata']);
  });

  it('non ricarica una lista gia pronta', () => {
    const store = useFakeStore();
    store.setList(['dal-backend']);
    const initList = vi.spyOn(store, 'initList');

    const list = storesUtils.getStoreList(store);

    expect(initList).not.toHaveBeenCalled();
    expect(list.value).toEqual(['dal-backend']);
  });
});


describe('refreshList', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
  });

  afterEach(() => vi.useRealTimers());

  it('aspetta il debounce prima di chiedere i dati', () => {
    const store = useFakeStore();
    const doSend = vi.fn();

    storesUtils.refreshList(store, doSend);

    expect(doSend).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);

    expect(doSend).toHaveBeenCalledOnce();
  });

  it('accorpa le chiamate ravvicinate in una sola', () => {
    const store = useFakeStore();
    const doSend = vi.fn();

    storesUtils.refreshList(store, doSend);
    storesUtils.refreshList(store, doSend);
    storesUtils.refreshList(store, doSend);
    vi.advanceTimersByTime(50);

    expect(doSend).toHaveBeenCalledOnce();
  });

  it('scrive nello store la risposta ricevuta', () => {
    const store = useFakeStore();

    storesUtils.refreshList(store, (callback) => callback(['dal-backend']));
    vi.advanceTimersByTime(50);

    expect(store.list).toEqual(['dal-backend']);
  });

  it('ignora la risposta di una richiesta ormai superata', () => {
    const store = useFakeStore();
    const risposte = [];

    storesUtils.refreshList(store, (callback) => risposte.push(callback), 0);
    vi.advanceTimersByTime(0);
    storesUtils.refreshList(store, (callback) => risposte.push(callback), 0);
    vi.advanceTimersByTime(0);

    // Arriva prima la risposta della richiesta piu' vecchia
    risposte[1](['recente']);
    risposte[0](['vecchia']);

    expect(store.list).toEqual(['recente']);
  });

  it('rispetta il debounce richiesto', () => {
    const store = useFakeStore();
    const doSend = vi.fn();

    storesUtils.refreshList(store, doSend, 500);
    vi.advanceTimersByTime(499);
    expect(doSend).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(doSend).toHaveBeenCalledOnce();
  });
});


describe('exclude_keys', () => {
  it('toglie le chiavi indicate', () => {
    const result = storesUtils.exclude_keys(
      { id: 1, name: 'Furgone', created_at: 'ieri', updated_at: 'oggi' },
      ['created_at', 'updated_at']
    );

    expect(result).toEqual({ id: 1, name: 'Furgone' });
  });

  it('lascia l-oggetto intatto se non c-e nulla da togliere', () => {
    expect(storesUtils.exclude_keys({ id: 1 }, ['boh'])).toEqual({ id: 1 });
  });
});


describe('formatFilters', () => {
  const dateTypes = storesUtils.ORDER_DATE_FILTER_TYPES;

  it('scarta i filtri vuoti', () => {
    expect(storesUtils.formatFilters({ 'Order.status': '', 'Order.cap': null }, dateTypes)).toEqual([]);
  });

  it('divide modello e campo', () => {
    expect(storesUtils.formatFilters({ 'Order.status': 'Acquired' }, dateTypes)).toEqual([
      { value: 'Acquired', model: 'Order', field: 'status' }
    ]);
  });

  it('tiene la sola data iniziale quando manca la finale', () => {
    expect(storesUtils.formatFilters({ 'Order.dpc': ['2026-09-01', null] }, dateTypes)).toEqual([
      { value: '2026-09-01', model: 'Order', field: 'dpc' }
    ]);
  });

  it('tiene l-intervallo quando ci sono entrambe le date', () => {
    expect(storesUtils.formatFilters({ 'Order.dpc': ['2026-09-01', '2026-09-30'] }, dateTypes)).toEqual([
      { value: ['2026-09-01', '2026-09-30'], model: 'Order', field: 'dpc' }
    ]);
  });

  it('scarta un intervallo senza data iniziale', () => {
    expect(storesUtils.formatFilters({ 'Order.dpc': [null, '2026-09-30'] }, dateTypes)).toEqual([]);
  });

  it('gestisce insieme filtri semplici e di data', () => {
    const result = storesUtils.formatFilters(
      { 'Order.status': 'Acquired', 'Order.dpc': ['2026-09-01', null], 'Order.cap': '' },
      dateTypes
    );

    expect(result).toHaveLength(2);
    expect(result.map(({ field }) => field)).toEqual(['status', 'dpc']);
  });
});


describe('elenchi dei filtri per data', () => {
  it('sono etichettati sull-entita giusta', () => {
    const entita = (tipi) => new Set(Object.values(tipi).map(({ entity }) => entity));

    expect(entita(storesUtils.ORDER_DATE_FILTER_TYPES)).toEqual(new Set(['Order']));
    expect(entita(storesUtils.SCHEDULE_DATE_FILTER_TYPES)).toEqual(new Set(['Schedule']));
    expect(entita(storesUtils.LOG_DATE_FILTER_TYPES)).toEqual(new Set(['Log']));
    expect(entita(storesUtils.RAE_PRODUCT_DATE_FILTER_TYPES)).toEqual(new Set(['RaeProduct']));
  });

  it('hanno tutti una etichetta leggibile', () => {
    Object.values(storesUtils.ORDER_DATE_FILTER_TYPES).forEach(({ label }) => {
      expect(label).toBeTruthy();
    });
  });
});
