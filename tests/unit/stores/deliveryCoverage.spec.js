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
    expect(store.coverages).toEqual([]);
    expect(store.absences).toEqual([]);
    expect(store.deliveryUsers).toEqual([]);
    expect(store.managedCoverage).toBeNull();
  });

  it('carica coperture, assenze e corrieri in una sola GET', () => {
    const store = useDeliveryCoverageStore();

    store.initList();
    vi.advanceTimersByTime(50);

    const [url, method] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage', 'GET']);
  });

  it('crea una copertura con l-elemento corrente', () => {
    const store = useDeliveryCoverageStore();
    store.element = { user_id: 3, start_date: '2026-09-01', end_date: '2026-12-31' };

    store.createCoverage(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage', 'POST']);
    expect(payload.body).toEqual({ user_id: 3, start_date: '2026-09-01', end_date: '2026-12-31' });
  });

  it('aggiorna una copertura senza i campi di sola lettura', () => {
    const store = useDeliveryCoverageStore();
    store.element = {
      id: 7,
      user_id: 3,
      start_date: '2026-09-01',
      end_date: '2027-01-31',
      days: [{ id: 1 }],
      created_at: 'ieri',
      updated_at: 'oggi',
      company_id: 1
    };

    store.updateCoverage(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage/7', 'PUT']);
    expect(payload.body).toEqual({ id: 7, user_id: 3, start_date: '2026-09-01', end_date: '2027-01-31' });
  });

  it('cancella una copertura per id', () => {
    const store = useDeliveryCoverageStore();

    store.deleteCoverage({ id: 9 }, vi.fn());

    expect(lastRequest().slice(0, 2)).toEqual(['delivery-coverage/9', 'DELETE']);
  });

  it('aggiunge un giorno alla copertura indicata', () => {
    const store = useDeliveryCoverageStore();
    const data = { day_of_week: 2, start_time: '08:00', end_time: '18:00' };

    store.createCoverageDay(7, data, vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage/7/day', 'POST']);
    expect(payload.body).toEqual(data);
  });

  it('aggiorna gli orari di un giorno', () => {
    const store = useDeliveryCoverageStore();

    store.updateCoverageDay(4, { start_time: '09:00', end_time: '17:00' }, vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage/day/4', 'PUT']);
    expect(payload.body).toEqual({ start_time: '09:00', end_time: '17:00' });
  });

  it('cancella un giorno per id', () => {
    const store = useDeliveryCoverageStore();

    store.deleteCoverageDay(4, vi.fn());

    expect(lastRequest().slice(0, 2)).toEqual(['delivery-coverage/day/4', 'DELETE']);
  });

  it('crea un-assenza con l-elemento corrente', () => {
    const store = useDeliveryCoverageStore();
    store.element = { user_id: 3, start_date: '2026-09-10', end_date: '2026-09-14', note: 'Ferie' };

    store.createAbsence(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage/absence', 'POST']);
    expect(payload.body).toEqual({ user_id: 3, start_date: '2026-09-10', end_date: '2026-09-14', note: 'Ferie' });
  });

  it('aggiorna un-assenza senza i campi di sola lettura', () => {
    const store = useDeliveryCoverageStore();
    store.element = { id: 5, user_id: 3, note: 'Permesso', created_at: 'ieri', updated_at: 'oggi', company_id: 1 };

    store.updateAbsence(vi.fn());

    const [url, method, payload] = lastRequest();
    expect([url, method]).toEqual(['delivery-coverage/absence/5', 'PUT']);
    expect(payload.body).toEqual({ id: 5, user_id: 3, note: 'Permesso' });
  });

  it('cancella un-assenza per id', () => {
    const store = useDeliveryCoverageStore();

    store.deleteAbsence({ id: 5 }, vi.fn());

    expect(lastRequest().slice(0, 2)).toEqual(['delivery-coverage/absence/5', 'DELETE']);
  });

  it('salva i dati ricevuti e marca lo store pronto', () => {
    const store = useDeliveryCoverageStore();

    store.setList({
      delivery_users: [{ id: 1, nickname: 'Delia' }],
      coverages: [{ id: 2, user_id: 1, days: [] }],
      absences: [{ id: 3, user_id: 1 }]
    });

    expect(store.deliveryUsers).toEqual([{ id: 1, nickname: 'Delia' }]);
    expect(store.coverages).toEqual([{ id: 2, user_id: 1, days: [] }]);
    expect(store.absences).toEqual([{ id: 3, user_id: 1 }]);
    expect(store.ready).toBe(true);
  });

  it('riaggancia la copertura gestita alla versione appena arrivata', () => {
    const store = useDeliveryCoverageStore();
    store.managedCoverage = { id: 2, days: [] };

    store.setList({
      delivery_users: [],
      coverages: [{ id: 2, user_id: 1, days: [{ id: 9, day_of_week: 0 }] }],
      absences: []
    });

    expect(store.managedCoverage.days).toEqual([{ id: 9, day_of_week: 0 }]);
  });

  it('azzera la copertura gestita se non c-e piu dopo il refresh', () => {
    const store = useDeliveryCoverageStore();
    store.managedCoverage = { id: 2, days: [] };

    store.setList({ delivery_users: [], coverages: [], absences: [] });

    expect(store.managedCoverage).toBeNull();
  });
});
