import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useDeliveryCoverageStore } from '@/stores/deliveryCoverage';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const lastRequest = () => http.makeRequest.mock.calls.at(-1);


beforeEach(() => {
  setActivePinia(createPinia());
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => vi.useRealTimers());


describe('deliveryCoverage store', () => {
  it('parte vuota e non pronta', () => {
    const store = useDeliveryCoverageStore();

    expect(store.ready).toBe(false);
    expect(store.entries).toEqual([]);
    expect(store.element).toEqual({});
  });

  it('carica i blocchi di copertura con una GET', () => {
    const store = useDeliveryCoverageStore();

    store.initList();
    vi.advanceTimersByTime(50);

    const [url, method] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage', 'GET']);
  });

  it('crea un blocco con l-elemento corrente', () => {
    const store = useDeliveryCoverageStore();
    store.element = { day_of_week: 0, transport_id: 3, start_time: '08:00', end_time: '18:00', caps: ['70051'] };

    store.createEntry(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage', 'POST']);
    expect(payload.body).toEqual({
      day_of_week: 0, transport_id: 3, start_time: '08:00', end_time: '18:00', caps: ['70051']
    });
  });

  it('aggiorna un blocco senza i campi di sola lettura', () => {
    const store = useDeliveryCoverageStore();
    store.element = {
      id: 7,
      day_of_week: 0,
      transport_id: 3,
      start_time: '08:00',
      end_time: '18:00',
      caps: ['70051'],
      created_at: 'ieri',
      updated_at: 'oggi',
      company_id: 1
    };

    store.updateEntry(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage/7', 'PUT']);
    expect(payload.body).toEqual({
      id: 7, day_of_week: 0, transport_id: 3, start_time: '08:00', end_time: '18:00', caps: ['70051']
    });
  });

  it('cancella un blocco per id', () => {
    const store = useDeliveryCoverageStore();

    store.deleteEntry({ id: 9 }, vi.fn());

    expect(lastRequest().slice(0, 2)).toEqual(['delivery-coverage/9', 'DELETE']);
  });

  it('salva i dati ricevuti e marca lo store pronto', () => {
    const store = useDeliveryCoverageStore();

    store.setList({
      entries: [{ id: 2, day_of_week: 0, transport_id: 1, start_time: '08:00:00', end_time: '18:00:00', caps: ['70051'] }]
    });

    expect(store.entries).toEqual([
      { id: 2, day_of_week: 0, transport_id: 1, start_time: '08:00:00', end_time: '18:00:00', caps: ['70051'] }
    ]);
    expect(store.ready).toBe(true);
  });
});
