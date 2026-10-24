import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useCompanySubscriptionStore } from '@/stores/companySubscription';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const respondWith = (data) => http.makeRequest.mockImplementationOnce((url, method, options, callback) => callback(data));
const lastCall = () => http.makeRequest.mock.calls.at(-1);

const ACTIVE = { status: 'active', active: true, current_period_end: null, cancel_at_period_end: false };

describe('companySubscription store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('open imposta la company, apre il popup e chiede prezzo e stato', () => {
    const store = useCompanySubscriptionStore();
    respondWith({ status: 'ok', price_cents: 4900, subscription: ACTIVE });

    store.open(42);

    expect(store.companyId).toBe(42);
    expect(store.dialogOpen).toBe(true);
    expect(http.makeRequest.mock.calls[0].slice(0, 2)).toEqual(['subscription/company/42', 'GET']);
    expect(store.priceCents).toBe(4900);
    expect(store.subscription).toEqual(ACTIVE);
    expect(store.ready).toBe(true);
  });

  it('open chiede anche lo storico dei pagamenti', () => {
    const store = useCompanySubscriptionStore();
    const history = { subscriptions: [{ id: 's' }], invoices: [{ id: 'i' }], summary: { regular: true } };
    http.makeRequest.mockImplementation((url, method, options, callback) =>
      callback(url.endsWith('/history') ? { status: 'ok', ...history } : { status: 'ok', subscription: ACTIVE })
    );

    store.open(42);

    expect(http.makeRequest.mock.calls.map(([url]) => url)).toContain('subscription/company/42/history');
    expect(store.history).toEqual(history);
    expect(store.historyReady).toBe(true);
    expect(store.historyMessage).toBe('');
  });

  it('se lo storico fallisce tiene il messaggio senza toccare il resto', () => {
    const store = useCompanySubscriptionStore();
    const func = vi.fn();
    store.companyId = 42;
    respondWith({ status: 'ko', message: 'Errore Stripe: rete' });

    store.initHistory(func);

    expect(store.historyMessage).toBe('Errore Stripe: rete');
    expect(store.historyReady).toBe(true);
    expect(store.history.invoices).toEqual([]);
    expect(func).toHaveBeenCalled();
  });

  it('lo storico usa un messaggio di ripiego quando il backend non ne manda uno', () => {
    const store = useCompanySubscriptionStore();
    store.companyId = 42;
    respondWith({ status: 'ko' });

    store.initHistory();

    expect(store.historyMessage).toBe('Errore nella lettura dello storico');
  });

  it('senza prezzo definito lo tiene a null', () => {
    const store = useCompanySubscriptionStore();
    respondWith({ status: 'ok', subscription: ACTIVE });

    store.open(42);

    expect(store.priceCents).toBeNull();
  });

  it('se il caricamento fallisce resta non pronto', () => {
    const store = useCompanySubscriptionStore();
    const func = vi.fn();
    respondWith({ status: 'ko', message: 'Company non trovata' });

    store.companyId = 42;
    store.initData(func);

    expect(store.ready).toBe(false);
    expect(func).toHaveBeenCalledWith({ status: 'ko', message: 'Company non trovata' });
  });

  it('updatePrice manda il prezzo e aggiorna lo stato', () => {
    const store = useCompanySubscriptionStore();
    const func = vi.fn();
    store.companyId = 42;
    respondWith({ status: 'ok', price_cents: 5900, subscription: ACTIVE });

    store.updatePrice(5900, func);

    const [url, method, options] = lastCall();
    expect([url, method]).toEqual(['subscription/company/42/price', 'PUT']);
    expect(options.body).toEqual({ price_cents: 5900 });
    expect(store.priceCents).toBe(5900);
    expect(func).toHaveBeenCalled();
  });

  it('se il salvataggio fallisce non tocca il prezzo mostrato', () => {
    const store = useCompanySubscriptionStore();
    store.companyId = 42;
    store.priceCents = 4900;
    respondWith({ status: 'ko', message: 'Errore Stripe' });

    store.updatePrice(5900);

    expect(store.priceCents).toBe(4900);
  });
});
