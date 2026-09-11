import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

// Store diverso dagli altri CRUD: companyId vive nello store (non e' quello
// della sessione), impostato da open() quando si apre il popup su una riga
// della tabella Company. Le azioni restano a zero argomenti come ogni altro
// store, quindi non entra nel contratto generico di describeCrudStore solo
// per l'inizializzazione via open() e per l'assenza del gate rae/tenant.
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

  it('open imposta la company, apre il popup e chiede la lista', () => {
    const store = useCompanyRaeDisposalPlaceStore();
    store.element = { id: 1, name: 'da svuotare' };
    store.activeForm = true;

    store.open(42);
    vi.advanceTimersByTime(50);

    expect(store.companyId).toBe(42);
    expect(store.dialogOpen).toBe(true);
    expect(store.element).toEqual({});
    expect(store.activeForm).toBe(false);
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

  it('crea un elemento sulla company impostata da open', () => {
    const store = useCompanyRaeDisposalPlaceStore();
    store.companyId = 42;
    store.element = { name: 'Deposito' };

    store.createElement(vi.fn());

    const [url, method, payload] = lastCall();
    expect([url, method]).toEqual(['company/42/rae-disposal-place', 'POST']);
    expect(payload.body).toMatchObject({ name: 'Deposito' });
  });

  it('aggiorna un elemento sulla company impostata da open', () => {
    const store = useCompanyRaeDisposalPlaceStore();
    store.companyId = 42;
    store.element = { id: 7, name: 'Aggiornato', created_at: 'x', updated_at: 'y', company_id: 42 };

    store.updateElement(vi.fn());

    const [url, method, payload] = lastCall();
    expect([url, method]).toEqual(['company/42/rae-disposal-place/7', 'PUT']);
    expect(payload.body).toMatchObject({ id: 7, name: 'Aggiornato' });
    expect(payload.body).not.toHaveProperty('created_at');
    expect(payload.body).not.toHaveProperty('company_id');
  });

  it('cancella un elemento sulla company impostata da open', () => {
    const store = useCompanyRaeDisposalPlaceStore();
    store.companyId = 42;
    const func = vi.fn();

    store.deleteElement({ id: 9 }, func);

    const [url, method, , callback] = lastCall();
    expect([url, method]).toEqual(['company/42/rae-disposal-place/9', 'DELETE']);
    expect(callback).toBe(func);
  });
});
