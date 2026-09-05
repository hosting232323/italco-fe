import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

// Store diverso dagli altri CRUD: ogni azione porta il companyId esplicito
// della company che il super admin sta editando, non quella della sessione -
// non entra quindi nel contratto generico di describeCrudStore.
vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

describe('companyRaeDisposalPlace store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  const lastCall = () => http.makeRequest.mock.calls.at(-1);

  it('chiede la lista per la company passata', () => {
    const store = useCompanyRaeDisposalPlaceStore();

    store.initList(42);
    vi.advanceTimersByTime(50);

    const [url, method] = lastCall();
    expect(url).toBe('company/42/rae-disposal-place');
    expect(method).toBe('GET');
  });

  it('salva la lista ricevuta e si segna pronta', () => {
    const store = useCompanyRaeDisposalPlaceStore();

    store.setList({ rae_disposal_places: [{ id: 1 }, { id: 2 }] });

    expect(store.list).toEqual([{ id: 1 }, { id: 2 }]);
    expect(store.ready).toBe(true);
  });

  it('crea un elemento sulla company passata', () => {
    const store = useCompanyRaeDisposalPlaceStore();
    store.element = { name: 'Deposito' };

    store.createElement(42, vi.fn());

    const [url, method, payload] = lastCall();
    expect([url, method]).toEqual(['company/42/rae-disposal-place', 'POST']);
    expect(payload.body).toMatchObject({ name: 'Deposito' });
  });

  it('aggiorna un elemento sulla company e sull-id passati', () => {
    const store = useCompanyRaeDisposalPlaceStore();
    store.element = { id: 7, name: 'Aggiornato', created_at: 'x', updated_at: 'y', company_id: 42 };

    store.updateElement(42, vi.fn());

    const [url, method, payload] = lastCall();
    expect([url, method]).toEqual(['company/42/rae-disposal-place/7', 'PUT']);
    expect(payload.body).toMatchObject({ id: 7, name: 'Aggiornato' });
    expect(payload.body).not.toHaveProperty('created_at');
    expect(payload.body).not.toHaveProperty('company_id');
  });

  it('cancella un elemento sulla company passata', () => {
    const store = useCompanyRaeDisposalPlaceStore();
    const func = vi.fn();

    store.deleteElement(42, { id: 9 }, func);

    const [url, method, , callback] = lastCall();
    expect([url, method]).toEqual(['company/42/rae-disposal-place/9', 'DELETE']);
    expect(callback).toBe(func);
  });
});
