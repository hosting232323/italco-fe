import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import CompanyForm from '@/components/administration/company/CompanyForm.vue';
import CompanyTable from '@/components/administration/company/CompanyTable.vue';
import http from '@/utils/http';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';
import { createTestPinia, createTestRouter, mountComponent } from '../../helpers/mount';


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
  city: 'Bari'
};


describe('CompanyForm', () => {
  beforeEach(() => vi.clearAllMocks());

  it('non ha piu il modulo RAEE: si gestisce dal popup dei luoghi di smaltimento', () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { id: 7, name: 'Attivita', rae: false, ...LEGAL };
    const wrapper = mountComponent(CompanyForm, { pinia });

    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0);
    expect(wrapper.text()).not.toContain('Modulo RAEE');
  });

  it('manda i dati legali e il codice fiscale nullo quando vuoto in creazione', async () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = {
      name: 'Nuova',
      rae: false,
      adminNickname: 'admin',
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
    store.element = { name: 'Nuova', rae: false, adminNickname: 'admin', adminPassword: 'pw' };
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
      func({ status: 'ko', message: 'Nickname già in uso' })
    );
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { name: 'Nuova', rae: false, adminNickname: 'admin', adminPassword: 'pw', ...LEGAL };
    const wrapper = mountComponent(CompanyForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.text()).toContain('Nickname già in uso');
    expect(store.activeForm).toBe(true);
  });
});


describe('CompanyTable', () => {
  beforeEach(() => vi.clearAllMocks());

  it('il bottone dedicato apre il popup dei luoghi di smaltimento su un popup a parte, non sul form di modifica', async () => {
    const pinia = createTestPinia();
    const companyStore = useCompanyStore();
    companyStore.ready = true;
    companyStore.list = [{ id: 7, name: 'Attivita RAEE', rae: true }];
    const disposalPlaceStore = useCompanyRaeDisposalPlaceStore();
    const wrapper = mountComponent(CompanyTable, { pinia, router: createTestRouter() });

    await wrapper.find('.mdi-recycle').trigger('click');

    expect(disposalPlaceStore.companyId).toBe(7);
    expect(disposalPlaceStore.dialogOpen).toBe(true);
    // Il form di modifica della company resta chiuso: sono due popup distinti.
    expect(companyStore.activeForm).toBe(false);
  });
});
