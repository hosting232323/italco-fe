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
    expect(lastCall().slice(0, 2)).toEqual(['subscription/company/42', 'GET']);
    expect(store.priceCents).toBe(4900);
    expect(store.subscription).toEqual(ACTIVE);
    expect(store.ready).toBe(true);
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

  it('updatePrice manda prezzo e scelta sull-abbonamento attivo e aggiorna lo stato', () => {
    const store = useCompanySubscriptionStore();
    const func = vi.fn();
    store.companyId = 42;
    respondWith({ status: 'ok', price_cents: 5900, subscription: ACTIVE });

    store.updatePrice(5900, true, func);

    const [url, method, options] = lastCall();
    expect([url, method]).toEqual(['subscription/company/42/price', 'PUT']);
    expect(options.body).toEqual({ price_cents: 5900, apply_to_active: true });
    expect(store.priceCents).toBe(5900);
    expect(func).toHaveBeenCalled();
  });

  it('se il salvataggio fallisce non tocca il prezzo mostrato', () => {
    const store = useCompanySubscriptionStore();
    store.companyId = 42;
    store.priceCents = 4900;
    respondWith({ status: 'ko', message: 'Errore Stripe' });

    store.updatePrice(5900, false);

    expect(store.priceCents).toBe(4900);
  });
});
