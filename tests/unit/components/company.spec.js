import { beforeEach, describe, expect, it, vi } from 'vitest';
import { flushPromises } from '@vue/test-utils';

import CompanyForm from '@/components/administration/company/CompanyForm.vue';
import CompanyTable from '@/components/administration/company/CompanyTable.vue';
import http from '@/utils/http';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import { useCompanySubscriptionStore } from '@/stores/companySubscription';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';
import { createTestPinia, createTestRouter, mountComponent, selectRow } from '../../helpers/mount';


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

  it('e solo di creazione: niente interruttori ne logo, si gestiscono altrove', () => {
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = {};
    const wrapper = mountComponent(CompanyForm, { pinia });

    expect(wrapper.text()).toContain('Crea Company');
    expect(wrapper.findAll('input[type="radio"]')).toHaveLength(0);
    expect(wrapper.find('input[type="file"]').exists()).toBe(false);
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

  it('a creazione riuscita svuota il form, ricarica la lista e si chiude', async () => {
    http.uploadRequest.mockImplementation((url, method, options, func) => func({ status: 'ok' }));
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { name: 'Nuova', adminNickname: 'admin', adminPassword: 'pw', ...LEGAL };
    const wrapper = mountComponent(CompanyForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(store.activeForm).toBe(false);
    expect(store.element).toEqual({});
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

  it('usa un messaggio di ripiego quando il backend non ne manda uno', async () => {
    http.uploadRequest.mockImplementation((url, method, options, func) => func({ status: 'ko' }));
    const pinia = createTestPinia();
    const store = useCompanyStore();
    store.activeForm = true;
    store.element = { name: 'Nuova', adminNickname: 'admin', adminPassword: 'pw', ...LEGAL };
    const wrapper = mountComponent(CompanyForm, { pinia });

    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(wrapper.text()).toContain('Errore durante il salvataggio');
  });
});


describe('CompanyTable', () => {
  beforeEach(() => vi.clearAllMocks());

  const mountTable = (list) => {
    const pinia = createTestPinia();
    const companyStore = useCompanyStore();
    companyStore.ready = true;
    companyStore.list = list;
    const wrapper = mountComponent(CompanyTable, { pinia, router: createTestRouter() });
    return { wrapper, companyStore };
  };

  // Gli interruttori sono nell'ordine delle colonne: RAEE, pianificazione, pagamento.
  const switches = (wrapper) => wrapper.findAll('tbody tr')[0].findAll('input[type="checkbox"]').slice(1);

  const lastPut = () => http.makeRequest.mock.calls.filter(([, method]) => method === 'PUT').at(-1);

  it('non ha piu il bottone Modifica: ne il form ne la modifica passano da qui', async () => {
    const { wrapper, companyStore } = mountTable([{ id: 7, name: 'Attivita' }]);

    await selectRow(wrapper);

    expect(wrapper.find('.mdi-pencil').exists()).toBe(false);
    expect(companyStore.activeForm).toBe(false);
  });

  it('il bottone dedicato apre il popup dei luoghi di smaltimento', async () => {
    const { wrapper, companyStore } = mountTable([{ id: 7, name: 'Attivita RAEE', rae: true }]);
    const disposalPlaceStore = useCompanyRaeDisposalPlaceStore();

    await selectRow(wrapper);
    await wrapper.find('.mdi-recycle').trigger('click');

    expect(disposalPlaceStore.companyId).toBe(7);
    expect(disposalPlaceStore.dialogOpen).toBe(true);
    expect(companyStore.activeForm).toBe(false);
  });

  it.each([
    [0, 'rae'],
    [1, 'automatic_planning'],
    [2, 'automatic_payment']
  ])('l-interruttore %i accende %s con la sola PUT del campo', async (index, key) => {
    http.makeRequest.mockImplementation((url, method, options, func) => func({ status: 'ok', company: { id: 7 } }));
    const { wrapper } = mountTable([{ id: 7, name: 'Attivita' }]);

    await switches(wrapper)[index].setValue(true);
    await flushPromises();

    const [url, method, options] = lastPut();
    expect([url, method]).toEqual(['company/7', 'PUT']);
    expect(options.body).toEqual({ name: 'Attivita', [key]: true });
  });

  it('mostra l-errore del backend e lascia l-interruttore dov-era', async () => {
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ko', message: 'Configura almeno un luogo di smaltimento RAEE prima di attivare il modulo' })
    );
    const { wrapper } = mountTable([{ id: 7, name: 'Attivita', rae: false }]);

    await switches(wrapper)[0].setValue(true);
    await flushPromises();

    expect(wrapper.text()).toContain('Configura almeno un luogo di smaltimento RAEE');
    expect(switches(wrapper)[0].element.checked).toBe(false);
  });

  it('usa un messaggio di ripiego quando il backend non ne manda uno', async () => {
    http.makeRequest.mockImplementation((url, method, options, func) => func({ status: 'ko' }));
    const { wrapper } = mountTable([{ id: 7, name: 'Attivita' }]);

    await switches(wrapper)[1].setValue(true);
    await flushPromises();

    expect(wrapper.text()).toContain('Errore durante il salvataggio');
  });

  it('aggiorna la sessione se la company modificata e quella su cui opera il super admin', async () => {
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', company: { id: 7, name: 'Attivita', automatic_payment: true } })
    );
    const { wrapper } = mountTable([{ id: 7, name: 'Attivita' }]);
    useUserStore().company = { id: 7, name: 'Attivita' };

    await switches(wrapper)[2].setValue(true);
    await flushPromises();

    expect(useUserStore().company.automatic_payment).toBe(true);
  });

  it('non tocca la sessione se la company modificata e un-altra', async () => {
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', company: { id: 7, name: 'Attivita', automatic_payment: true } })
    );
    const { wrapper } = mountTable([{ id: 7, name: 'Attivita' }]);
    useUserStore().company = { id: 99, name: 'Altra' };

    await switches(wrapper)[2].setValue(true);
    await flushPromises();

    expect(useUserStore().company).toEqual({ id: 99, name: 'Altra' });
  });

  it('il bottone dei luoghi di smaltimento esiste solo col modulo RAEE acceso', async () => {
    const spento = mountTable([{ id: 7, name: 'Attivita', rae: false }]).wrapper;
    const acceso = mountTable([{ id: 8, name: 'Attivita', rae: true }]).wrapper;

    await selectRow(spento);
    await selectRow(acceso);

    expect(spento.find('.mdi-recycle').exists()).toBe(false);
    expect(acceso.find('.mdi-recycle').exists()).toBe(true);
  });

  it('il bottone Abbonamento esiste solo col pagamento automatico acceso e apre il popup', async () => {
    const spento = mountTable([{ id: 7, name: 'Attivita', automatic_payment: false }]).wrapper;
    const { wrapper } = mountTable([{ id: 8, name: 'Attivita', automatic_payment: true }]);
    const subscriptionStore = useCompanySubscriptionStore();

    await selectRow(spento);
    await selectRow(wrapper);
    expect(spento.find('.mdi-credit-card-edit-outline').exists()).toBe(false);

    await wrapper.find('.mdi-credit-card-edit-outline').trigger('click');

    expect(subscriptionStore.companyId).toBe(8);
    expect(subscriptionStore.dialogOpen).toBe(true);
  });

  it('non c-e piu il campo prezzo in tabella: sta nel popup dell-abbonamento', () => {
    const { wrapper } = mountTable([
      { id: 7, name: 'Attivita', automatic_payment: true, subscription_price_cents: 4900 }
    ]);

    expect(wrapper.find('input[type="number"]').exists()).toBe(false);
  });

  it('se l-accensione del modulo RAEE e rifiutata l-avviso offre i luoghi di smaltimento', async () => {
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ko', message: 'Configura almeno un luogo di smaltimento RAEE prima di attivare il modulo' })
    );
    const { wrapper } = mountTable([{ id: 7, name: 'Attivita', rae: false }]);

    await switches(wrapper)[0].setValue(true);
    await flushPromises();
    const button = wrapper.findAll('button').find((item) => item.text() == 'Luoghi di smaltimento RAEE');
    await button.trigger('click');

    expect(useCompanyRaeDisposalPlaceStore().companyId).toBe(7);
    expect(useCompanyRaeDisposalPlaceStore().dialogOpen).toBe(true);
  });

  it('un rifiuto su un altro interruttore non offre i luoghi', async () => {
    http.makeRequest.mockImplementation((url, method, options, func) => func({ status: 'ko', message: 'No' }));
    const { wrapper } = mountTable([{ id: 7, name: 'Attivita' }]);

    await switches(wrapper)[1].setValue(true);
    await flushPromises();

    expect(wrapper.findAll('button').find((item) => item.text() == 'Luoghi di smaltimento RAEE')).toBeUndefined();
  });
});
