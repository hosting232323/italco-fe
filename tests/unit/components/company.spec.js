import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import CompanyForm from '@/components/administration/company/CompanyForm.vue';
import http from '@/utils/http';
import { useCompanyStore } from '@/stores/company';
import { createTestPinia, mountComponent } from '../../helpers/mount';


vi.mock('@/utils/http', () => ({
  default: {
    makeRequest: vi.fn(),
    uploadRequest: vi.fn(),
    withSessionToken: vi.fn((url) => `${url}?token=fake`)
  }
}));


const LEGAL = {
  legal_name: 'Attivita SRL',
  vat_number: '11122233344',
  address: 'Via Test 1',
  city: 'Bari',
  rae_registration: 'RD000S00000000 del 01/01/26',
  rae_grouping_place: 'Via Deposito 1'
};


describe('CompanyForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('invia true quando il super admin attiva il modulo RAEE', async () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { id: 7, name: 'Attivita senza RAEE', rae: false, ...LEGAL };
    const wrapper = mountComponent(CompanyForm, { pinia });

    const radios = wrapper.findAll('input[type="radio"]');
    expect(radios).toHaveLength(2);

    await radios[0].trigger('click');
    expect(store.element.rae).toBe(true);

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    const [url, method, options] = http.uploadRequest.mock.calls.at(-1);
    expect([url, method]).toEqual(['company/7', 'PUT']);
    expect(options.body).toMatchObject({ name: 'Attivita senza RAEE', rae: true, legal_name: 'Attivita SRL' });
  });

  it('manda i dati legali e il codice fiscale nullo quando vuoto in creazione', async () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = {
      name: 'Nuova',
      rae: false,
      adminEmail: 'admin',
      adminPassword: 'pw',
      ...LEGAL
    };
    const wrapper = mountComponent(CompanyForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    const [url, method, options] = http.uploadRequest.mock.calls.at(-1);
    expect([url, method]).toEqual(['company', 'POST']);
    expect(options.body.tax_code).toBeNull();
    expect(options.body).toMatchObject({ address: 'Via Test 1', city: 'Bari' });
    expect(options.files).toHaveProperty('logo');
  });

  it('blocca la submit se mancano i dati legali obbligatori', async () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { name: 'Nuova', rae: false, adminEmail: 'admin', adminPassword: 'pw' };
    const wrapper = mountComponent(CompanyForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    // form.validate() fallisce sui campi legali: nessuna richiesta parte
    expect(http.uploadRequest).not.toHaveBeenCalled();
  });

  it('in modifica mostra il logo già caricato con token e cache-buster', async () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = {
      id: 3,
      name: 'Con logo',
      rae: false,
      updated_at: '01/01/2026 10:00',
      logo: 'https://api.test/company/logo/3.png',
      ...LEGAL
    };
    const wrapper = mountComponent(CompanyForm, { pinia });
    await flushPromises();

    const img = wrapper.findComponent({ name: 'VImg' });
    expect(img.exists()).toBe(true);
    expect(img.props('src')).toBe('https://api.test/company/logo/3.png?token=fake&v=01%2F01%2F2026%2010%3A00');
    expect(wrapper.text()).toContain('Logo attuale');
  });

  it('mostra il messaggio di errore del backend quando la creazione fallisce', async () => {
    http.uploadRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ko', message: 'Email già in uso' })
    );
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { name: 'Nuova', rae: false, adminEmail: 'admin', adminPassword: 'pw', ...LEGAL };
    const wrapper = mountComponent(CompanyForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.text()).toContain('Email già in uso');
    expect(store.activeForm).toBe(true);
  });
});
