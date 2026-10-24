import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import CompanyConfigurationForm from '@/components/configuration/CompanyConfigurationForm.vue';
import SubscriptionCard from '@/components/configuration/SubscriptionCard.vue';
import http from '@/utils/http';
import { useUserStore } from '@/stores/user';
import { useSubscriptionStore } from '@/stores/subscription';
import { createTestPinia, createTestRouter, mountComponent } from '../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: {
    makeRequest: vi.fn(),
    uploadRequest: vi.fn(),
    withSessionToken: vi.fn((url) => `${url}?token=fake`)
  }
}));

const COMPANY = {
  id: 3,
  name: 'Attivita',
  legal_name: 'Attivita SRL',
  vat_number: '11122233344',
  address: 'Via Test 1',
  city: 'Bari',
  rae: false
};


describe('CompanyConfigurationForm', () => {
  beforeEach(() => vi.clearAllMocks());

  const mountForm = (company) => {
    const pinia = createTestPinia();
    http.makeRequest.mockImplementation((url, method, options, func) => func({ status: 'ok', company }));
    const wrapper = mountComponent(CompanyConfigurationForm, { pinia });
    return { wrapper, pinia };
  };

  it('carica i dati della propria attivita e li mostra', async () => {
    const { wrapper } = mountForm(COMPANY);
    await flushPromises();

    expect(http.makeRequest.mock.calls[0].slice(0, 2)).toEqual(['company/me', 'GET']);
    expect(wrapper.find('input[type="text"]').element.value).toBe('Attivita');
  });

  it('il campo iscrizione Albo compare solo col modulo RAEE acceso', async () => {
    const spento = mountForm(COMPANY).wrapper;
    const acceso = mountForm({ ...COMPANY, rae: true, rae_registration: 'RD-1' }).wrapper;
    await flushPromises();

    expect(spento.text()).not.toContain('Estremi iscrizione Albo');
    expect(acceso.text()).toContain('Estremi iscrizione Albo');
  });

  it('salva e aggiorna la company in sessione', async () => {
    const { wrapper } = mountForm(COMPANY);
    await flushPromises();
    http.uploadRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', company: { ...COMPANY, name: 'Nuovo nome' } })
    );

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    const [url, method] = http.uploadRequest.mock.calls.at(-1);
    expect([url, method]).toEqual(['company/me', 'PUT']);
    expect(useUserStore().company.name).toBe('Nuovo nome');
    expect(wrapper.text()).toContain('Dati salvati');
  });

  it('non invia nulla se manca un dato legale obbligatorio', async () => {
    const { wrapper } = mountForm({ ...COMPANY, vat_number: '' });
    await flushPromises();

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(http.uploadRequest).not.toHaveBeenCalled();
  });

  it('mostra l errore del backend', async () => {
    const { wrapper } = mountForm(COMPANY);
    await flushPromises();
    http.uploadRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ko', message: 'Campi obbligatori mancanti: Partita IVA' })
    );

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.text()).toContain('Campi obbligatori mancanti: Partita IVA');
  });

  it('mostra il logo gia caricato con token e cache-buster', async () => {
    const { wrapper } = mountForm({ ...COMPANY, updated_at: 'v1', logo: 'https://api.test/company/logo/3.png' });
    await flushPromises();

    const img = wrapper.findComponent({ name: 'VImg' });
    expect(img.props('src')).toBe('https://api.test/company/logo/3.png?token=fake&v=v1');
    expect(wrapper.text()).toContain('Logo attuale');
  });
});


describe('SubscriptionCard', () => {
  beforeEach(() => vi.clearAllMocks());

  const NONE = { status: 'none', active: false, current_period_end: null, cancel_at_period_end: false };
  const ACTIVE = {
    status: 'active',
    active: true,
    current_period_end: '2030-01-01T00:00:00',
    cancel_at_period_end: false
  };

  const mountCard = async (state, query = {}) => {
    const pinia = createTestPinia();
    const store = useSubscriptionStore();
    http.makeRequest.mockImplementation((url, method, options, func) => {
      if (url == 'subscription')
        func({ status: 'ok', price_cents: state.priceCents, subscription: state.subscription });
      else
        func({ status: 'ok', subscription: state.subscription });
    });
    const router = createTestRouter();
    await router.push({ path: '/', query });
    const wrapper = mountComponent(SubscriptionCard, { pinia, router });
    return { wrapper, store };
  };

  const buttonByText = (wrapper, text) => wrapper.findAll('button').find((item) => item.text() == text);

  it('senza abbonamento mostra il prezzo e Sottoscrivi', async () => {
    const { wrapper } = await mountCard({ priceCents: 4900, subscription: NONE });
    await flushPromises();

    expect(wrapper.text()).toContain('49,00');
    expect(wrapper.text()).toContain('Sottoscrivi');
    expect(wrapper.text()).not.toContain('Gestisci abbonamento');
  });

  it('senza prezzo definito avvisa e non permette di sottoscrivere', async () => {
    const { wrapper } = await mountCard({ priceCents: null, subscription: NONE });
    await flushPromises();

    expect(wrapper.text()).toContain('non è ancora stato definito');
    expect(buttonByText(wrapper, 'Sottoscrivi').element.disabled).toBe(true);
  });

  it('con abbonamento attivo mostra stato, rinnovo e Gestisci abbonamento', async () => {
    const { wrapper } = await mountCard({ priceCents: 4900, subscription: ACTIVE });
    await flushPromises();

    expect(wrapper.text()).toContain('Attivo');
    expect(wrapper.text()).toContain('Prossimo rinnovo il');
    expect(wrapper.text()).toContain('Gestisci abbonamento');
  });

  it('con disdetta programmata dice quando termina', async () => {
    const { wrapper } = await mountCard({ priceCents: 4900, subscription: { ...ACTIVE, cancel_at_period_end: true } });
    await flushPromises();

    expect(wrapper.text()).toContain('Termina il');
  });

  it('con pagamento in ritardo avvisa e offre il portale', async () => {
    const { wrapper } = await mountCard({ priceCents: 4900, subscription: { ...NONE, status: 'past_due' } });
    await flushPromises();

    expect(wrapper.text()).toContain('non è andato a buon fine');
    expect(wrapper.text()).toContain('Gestisci abbonamento');
  });

  it('Sottoscrivi avvia il checkout', async () => {
    const { wrapper, store } = await mountCard({ priceCents: 4900, subscription: NONE });
    await flushPromises();
    const checkout = vi.spyOn(store, 'startCheckout').mockImplementation(() => {});

    await buttonByText(wrapper, 'Sottoscrivi').trigger('click');

    expect(checkout).toHaveBeenCalled();
  });

  it('Gestisci abbonamento apre il portale', async () => {
    const { wrapper, store } = await mountCard({ priceCents: 4900, subscription: ACTIVE });
    await flushPromises();
    const portal = vi.spyOn(store, 'openPortal').mockImplementation(() => {});

    await buttonByText(wrapper, 'Gestisci abbonamento').trigger('click');

    expect(portal).toHaveBeenCalled();
  });

  it('di ritorno dal checkout rilegge lo stato da Stripe', async () => {
    const { wrapper } = await mountCard({ priceCents: 4900, subscription: ACTIVE }, { checkout: 'success' });
    await flushPromises();

    expect(http.makeRequest.mock.calls[0].slice(0, 2)).toEqual(['subscription/sync', 'POST']);
    expect(wrapper.text()).toContain('Pagamento completato');
  });

  it('dopo un checkout annullato lo dice', async () => {
    const { wrapper } = await mountCard({ priceCents: 4900, subscription: NONE }, { checkout: 'cancel' });
    await flushPromises();

    expect(wrapper.text()).toContain('nessun addebito');
  });
});
