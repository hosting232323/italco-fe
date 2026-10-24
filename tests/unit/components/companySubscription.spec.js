import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import CompanySubscriptionDialog from '@/components/administration/companySubscription/CompanySubscriptionDialog.vue';
import http from '@/utils/http';
import { useCompanyStore } from '@/stores/company';
import { useCompanySubscriptionStore } from '@/stores/companySubscription';
import { createTestPinia, mountComponent } from '../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const NONE = { status: 'none', active: false, current_period_end: null, cancel_at_period_end: false };
const ACTIVE = {
  status: 'active',
  active: true,
  current_period_end: '2030-01-15T00:00:00',
  cancel_at_period_end: false
};

describe('CompanySubscriptionDialog', () => {
  beforeEach(() => vi.clearAllMocks());

  const setup = ({ subscription = NONE, priceCents = 4900 } = {}) => {
    const pinia = createTestPinia();
    useCompanyStore().list = [{ id: 42, name: 'Attivita Test' }];
    const store = useCompanySubscriptionStore();
    store.dialogOpen = true;
    store.companyId = 42;
    store.priceCents = priceCents;
    store.subscription = subscription;
    store.ready = true;
    const wrapper = mountComponent(CompanySubscriptionDialog, { pinia });
    return { wrapper, store };
  };

  const INVOICE = {
    id: 'in_1',
    number: 'N-1',
    status: 'paid',
    amount_cents: 4900,
    created: '2026-01-01T00:00:00',
    paid_at: '2026-01-01T00:01:00',
    attempts: 1,
    url: 'https://stripe.test/in_1'
  };
  const SUMMARY = {
    customer_since: '2026-01-01T00:01:00',
    paid_count: 1,
    paid_total_cents: 4900,
    unpaid_count: 0,
    retried_count: 0,
    regular: true
  };
  const RECORD = { id: 'sub_1', status: 'active', created: '2026-01-01T00:00:00', ended_at: null, price_cents: 4900 };

  const withHistory = (store, history) => {
    store.history = history;
    store.historyReady = true;
  };

  const saveButton = (wrapper) => wrapper.findAll('button').find((item) => item.text() == 'Salva prezzo');

  it('mostra la company, lo stato e il prezzo attuale', () => {
    const { wrapper } = setup();

    expect(wrapper.text()).toContain('Attivita Test');
    expect(wrapper.text()).toContain('Nessun abbonamento');
    expect(wrapper.text()).toContain('49,00');
    expect(wrapper.find('input[type="number"]').element.value).toBe('49.00');
  });

  it('senza prezzo definito lo dice e parte con il campo vuoto', () => {
    const { wrapper } = setup({ priceCents: null });

    expect(wrapper.text()).toContain('Prezzo non ancora definito');
    expect(wrapper.find('input[type="number"]').element.value).toBe('');
    expect(saveButton(wrapper).element.disabled).toBe(true);
  });

  it('mentre carica non mostra il form', () => {
    const { wrapper, store } = setup();
    store.ready = false;

    return wrapper.vm.$nextTick().then(() => {
      expect(wrapper.find('input[type="number"]').exists()).toBe(false);
    });
  });

  it('non propone scelte: il prezzo vale sempre anche per l-abbonamento attivo', () => {
    const { wrapper } = setup({ subscription: ACTIVE });

    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0);
    expect(wrapper.text()).toContain('il nuovo prezzo vale dal prossimo rinnovo');
    expect(wrapper.text()).toContain('Prossimo rinnovo il');
  });

  it('senza abbonamento attivo non parla di rinnovo', () => {
    const { wrapper } = setup();

    expect(wrapper.text()).not.toContain('il nuovo prezzo vale dal prossimo rinnovo');
  });

  it('salva il prezzo in centesimi', async () => {
    const { wrapper } = setup({ subscription: ACTIVE });
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', price_cents: 5990, subscription: ACTIVE })
    );

    await wrapper.find('input[type="number"]').setValue('59.90');
    await saveButton(wrapper).trigger('click');
    await flushPromises();

    const [url, method, options] = http.makeRequest.mock.calls.find(([, requestMethod]) => requestMethod == 'PUT');
    expect([url, method]).toEqual(['subscription/company/42/price', 'PUT']);
    expect(options.body).toEqual({ price_cents: 5990 });
    expect(wrapper.text()).toContain('Prezzo aggiornato');
  });

  it('mostra l-errore del backend, ad esempio il rifiuto di Stripe', async () => {
    const { wrapper } = setup({ subscription: ACTIVE });
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ko', message: 'Errore Stripe: rifiutato' })
    );

    await saveButton(wrapper).trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Errore Stripe: rifiutato');
  });

  it('usa un messaggio di ripiego quando il backend non ne manda uno', async () => {
    const { wrapper } = setup();
    http.makeRequest.mockImplementation((url, method, options, func) => func({ status: 'ko' }));

    await saveButton(wrapper).trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Errore durante il salvataggio');
  });

  it('non salva un prezzo sotto il minimo', async () => {
    const { wrapper } = setup();

    await wrapper.find('input[type="number"]').setValue('0.10');

    expect(saveButton(wrapper).element.disabled).toBe(true);
  });

  describe('storico pagamenti', () => {
    it('mentre carica mostra la barra e non la tabella', () => {
      const { wrapper } = setup();

      expect(wrapper.text()).toContain('Storico pagamenti');
      expect(wrapper.find('table').exists()).toBe(false);
    });

    it('senza fatture dice che non ha mai sottoscritto', () => {
      const { wrapper, store } = setup();
      withHistory(store, { subscriptions: [], invoices: [], summary: null });

      return wrapper.vm.$nextTick().then(() => {
        expect(wrapper.text()).toContain('non ha ancora sottoscritto');
      });
    });

    it('se Stripe non risponde mostra l-errore al posto dello storico', () => {
      const { wrapper, store } = setup();
      store.historyReady = true;
      store.historyMessage = 'Errore Stripe: rete';

      return wrapper.vm.$nextTick().then(() => {
        expect(wrapper.text()).toContain('Errore Stripe: rete');
      });
    });

    it('con pagamenti sempre regolari lo dice, con da quando paga e il totale incassato', async () => {
      const { wrapper, store } = setup({ subscription: ACTIVE });
      withHistory(store, { subscriptions: [RECORD], invoices: [INVOICE], summary: SUMMARY });
      await wrapper.vm.$nextTick();

      const text = wrapper.text();
      expect(text).toContain('Pagamenti sempre regolari');
      expect(text).toContain('Paga dal');
      expect(text).toContain('01/01/2026');
      expect(text).toContain('1 saldate');
      expect(text).toContain('N-1');
      expect(text).toContain('Saldata');
      expect(wrapper.find('a[href="https://stripe.test/in_1"]').exists()).toBe(true);
    });

    it('elenca anche gli abbonamenti, con prezzo e fine', async () => {
      const { wrapper, store } = setup();
      const ended = { ...RECORD, id: 'sub_old', status: 'canceled', ended_at: '2026-02-01T00:00:00' };
      withHistory(store, { subscriptions: [ended, RECORD], invoices: [INVOICE], summary: SUMMARY });
      await wrapper.vm.$nextTick();

      expect(wrapper.text()).toContain('Annullato');
      expect(wrapper.text()).toContain('01/02/2026');
      expect(wrapper.text()).toContain('49,00');
    });

    it('segnala le irregolarita: non saldate e saldate dopo un nuovo tentativo', async () => {
      const { wrapper, store } = setup();
      const unpaid = { ...INVOICE, id: 'in_2', status: 'open', number: null, url: null, attempts: 3 };
      const summary = { ...SUMMARY, regular: false, unpaid_count: 1, retried_count: 2 };
      withHistory(store, { subscriptions: [], invoices: [INVOICE, unpaid], summary });
      await wrapper.vm.$nextTick();

      const text = wrapper.text();
      expect(text).toContain('Pagamenti con irregolarità');
      expect(text).toContain('1 non saldate');
      expect(text).toContain('2 saldate solo dopo un nuovo tentativo');
      expect(text).toContain('Da pagare');
      expect(text).toContain('in_2');
    });
  });
});
