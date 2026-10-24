import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

import http from '@/utils/http';
import { useSubscriptionStore } from '@/stores/subscription';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const lastCall = () => http.makeRequest.mock.calls.at(-1);

// makeRequest(url, method, options, callback): il callback si invoca con la risposta.
const respondWith = (data) => http.makeRequest.mockImplementationOnce((_u, _m, _o, callback) => callback(data));

const ACTIVE = { status: 'active', active: true, current_period_end: null, cancel_at_period_end: false };

describe('subscription store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    delete window.location;
    window.location = { href: '' };
  });

  it('parte senza abbonamento e non ancora pronto', () => {
    const store = useSubscriptionStore();

    expect(store.subscription.status).toBe('none');
    expect(store.ready).toBe(false);
  });

  it('carica prezzo e abbonamento', () => {
    const store = useSubscriptionStore();
    const func = vi.fn();
    respondWith({ status: 'ok', price_cents: 4900, subscription: ACTIVE });

    store.initData(func);

    expect(lastCall().slice(0, 2)).toEqual(['subscription', 'GET']);
    expect(store.priceCents).toBe(4900);
    expect(store.subscription).toEqual(ACTIVE);
    expect(store.ready).toBe(true);
    expect(func).toHaveBeenCalled();
  });

  it('mostra l\'errore del backend e si segna comunque pronto', () => {
    const store = useSubscriptionStore();
    respondWith({ status: 'ko', message: 'Pagamento automatico non attivo per questa attività' });

    store.initData();

    expect(store.message).toBe('Pagamento automatico non attivo per questa attività');
    expect(store.ready).toBe(true);
    expect(store.priceCents).toBeNull();
  });

  it('usa un messaggio di ripiego quando il backend non ne manda', () => {
    const store = useSubscriptionStore();
    respondWith({ status: 'ko' });

    store.sync();

    expect(store.message).not.toBe('');
  });

  it('sync aggiorna lo stato e chiama il callback', () => {
    const store = useSubscriptionStore();
    const func = vi.fn();
    respondWith({ status: 'ok', subscription: ACTIVE });

    store.sync(func);

    expect(lastCall().slice(0, 2)).toEqual(['subscription/sync', 'POST']);
    expect(store.subscription).toEqual(ACTIVE);
    expect(func).toHaveBeenCalled();
  });

  it('checkout porta il browser all\'URL di Stripe', () => {
    const store = useSubscriptionStore();
    respondWith({ status: 'ok', url: 'https://stripe.test/checkout' });

    store.startCheckout();

    const [url, method, options] = lastCall();
    expect([url, method, options.body]).toEqual(['subscription/checkout', 'POST', {}]);
    expect(window.location.href).toBe('https://stripe.test/checkout');
  });

  it('il portale porta il browser all\'URL di Stripe', () => {
    const store = useSubscriptionStore();
    respondWith({ status: 'ok', url: 'https://stripe.test/portal' });

    store.openPortal();

    expect(lastCall().slice(0, 2)).toEqual(['subscription/portal', 'POST']);
    expect(window.location.href).toBe('https://stripe.test/portal');
  });

  it('se Stripe non risponde ok non reindirizza e tiene il messaggio', () => {
    const store = useSubscriptionStore();
    const func = vi.fn();
    respondWith({ status: 'ko', message: 'Piano non valido' });

    store.startCheckout(func);

    expect(window.location.href).toBe('');
    expect(store.message).toBe('Piano non valido');
    expect(func).toHaveBeenCalled();
  });

  it('usa un messaggio di ripiego quando Stripe fallisce senza dettagli', () => {
    const store = useSubscriptionStore();
    respondWith({ status: 'ko' });

    store.openPortal();

    expect(store.message).toBe('Errore durante la richiesta a Stripe');
  });
});
