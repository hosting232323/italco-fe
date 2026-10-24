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

  it('senza abbonamento attivo non propone la scelta sull-abbonamento in corso', () => {
    const { wrapper } = setup();

    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0);
  });

  it('con abbonamento attivo propone di applicare il prezzo anche a quello, dal prossimo rinnovo', () => {
    const { wrapper } = setup({ subscription: ACTIVE });

    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(2);
    expect(wrapper.text()).toContain('dal prossimo rinnovo');
    expect(wrapper.text()).toContain('Prossimo rinnovo il');
  });

  it('salva il prezzo in centesimi sull-abbonamento attivo di default', async () => {
    const { wrapper } = setup({ subscription: ACTIVE });
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', price_cents: 5990, subscription: ACTIVE })
    );

    await wrapper.find('input[type="number"]').setValue('59.90');
    await saveButton(wrapper).trigger('click');
    await flushPromises();

    const [url, method, options] = http.makeRequest.mock.calls.find(([, requestMethod]) => requestMethod == 'PUT');
    expect([url, method]).toEqual(['subscription/company/42/price', 'PUT']);
    expect(options.body).toEqual({ price_cents: 5990, apply_to_active: true });
    expect(wrapper.text()).toContain('Prezzo aggiornato');
  });

  it('scegliendo solo i nuovi abbonamenti non tocca quello attivo', async () => {
    const { wrapper } = setup({ subscription: ACTIVE });
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', price_cents: 5990, subscription: ACTIVE })
    );

    await wrapper.findAll('input[type="radio"]')[1].setValue(true);
    await wrapper.find('input[type="number"]').setValue('59.90');
    await saveButton(wrapper).trigger('click');
    await flushPromises();

    const [, , options] = http.makeRequest.mock.calls.find(([, requestMethod]) => requestMethod == 'PUT');
    expect(options.body.apply_to_active).toBe(false);
  });

  it('senza abbonamento attivo non chiede mai di applicarlo', async () => {
    const { wrapper } = setup();
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', price_cents: 5990, subscription: NONE })
    );

    await wrapper.find('input[type="number"]').setValue('59.90');
    await saveButton(wrapper).trigger('click');
    await flushPromises();

    const [, , options] = http.makeRequest.mock.calls.find(([, requestMethod]) => requestMethod == 'PUT');
    expect(options.body.apply_to_active).toBe(false);
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
});
