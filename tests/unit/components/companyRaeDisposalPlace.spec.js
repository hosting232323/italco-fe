import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RaeDisposalPlaceTable from '@/components/administration/companyRaeDisposalPlace/RaeDisposalPlaceTable.vue';
import RaeDisposalPlaceForm from '@/components/administration/companyRaeDisposalPlace/RaeDisposalPlaceForm.vue';
import RaeDisposalPlaceDialog from '@/components/administration/companyRaeDisposalPlace/RaeDisposalPlaceDialog.vue';

import http from '@/utils/http';
import { useUserStore } from '@/stores/user';
import { useCompanyStore } from '@/stores/company';
import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

import { createTestPinia, mountComponent } from '../../helpers/mount';

// Non condivide il contratto generico di describeCrudTable/describeCrudForm:
// companyId vive nello store (impostato da open()), non e' un prop.

vi.mock('@/utils/http', () => ({
  default: { makeRequest: vi.fn(), uploadRequest: vi.fn() }
}));

const VALID_ELEMENT = {
  name: 'Deposito Bari',
  rae_registration: 'RD1 del 01/01/26',
  rae_grouping_place: 'Via Bari 1'
};

const rowsOf = (wrapper) => wrapper.findAll('tbody tr');

describe('RaeDisposalPlaceTable', () => {
  beforeEach(() => vi.clearAllMocks());

  const setup = (companyId = 42) => {
    const pinia = createTestPinia();
    const store = useCompanyRaeDisposalPlaceStore();
    store.companyId = companyId;
    return { pinia, store };
  };

  const mountTable = (store, pinia) => {
    store.ready = true;
    store.list = [{ id: 1, ...VALID_ELEMENT }];
    return mountComponent(RaeDisposalPlaceTable, { pinia });
  };

  it('mostra lo scheletro finche la lista non e pronta', () => {
    const { pinia, store } = setup();
    store.ready = false;

    const wrapper = mountComponent(RaeDisposalPlaceTable, { pinia });

    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);
    expect(wrapper.find('.v-data-table').exists()).toBe(false);
  });

  it('mostra una riga per elemento', () => {
    const { pinia, store } = setup();

    const wrapper = mountTable(store, pinia);

    expect(rowsOf(wrapper)).toHaveLength(1);
  });

  it('la matita apre il form sull-elemento scelto', async () => {
    const { pinia, store } = setup();
    const wrapper = mountTable(store, pinia);

    await rowsOf(wrapper)[0].find('.mdi-pencil').trigger('click');

    expect(store.element).toEqual({ id: 1, ...VALID_ELEMENT });
    expect(store.activeForm).toBe(true);
  });

  it('il cestino cancella l-elemento sulla company dello store', async () => {
    const { pinia, store } = setup();
    const deleteElement = vi.spyOn(store, 'deleteElement');
    const wrapper = mountTable(store, pinia);

    await rowsOf(wrapper)[0].find('.mdi-delete').trigger('click');

    expect(deleteElement).toHaveBeenCalledWith({ id: 1, ...VALID_ELEMENT }, expect.any(Function));
  });
});

describe('RaeDisposalPlaceForm', () => {
  beforeEach(() => vi.clearAllMocks());

  const setup = (companyId = 42) => {
    const pinia = createTestPinia();
    const store = useCompanyRaeDisposalPlaceStore();
    store.companyId = companyId;
    return { pinia, store };
  };

  const mountForm = (store, pinia, element = {}) => {
    store.activeForm = true;
    store.element = element;
    return mountComponent(RaeDisposalPlaceForm, { pinia });
  };

  const submit = async (wrapper) => {
    await wrapper.find('form').trigger('submit');
    await flushPromises();
  };

  it('resta chiuso finche non lo si apre', () => {
    const { pinia, store } = setup();
    store.activeForm = false;

    expect(mountComponent(RaeDisposalPlaceForm, { pinia }).find('form').exists()).toBe(false);
  });

  it('annuncia la creazione quando l-elemento e nuovo', () => {
    const { pinia, store } = setup();

    expect(mountForm(store, pinia).text()).toContain('Crea Luogo di Smaltimento');
  });

  it('annuncia la modifica quando l-elemento ha un id', () => {
    const { pinia, store } = setup();

    expect(mountForm(store, pinia, { ...VALID_ELEMENT, id: 7 }).text()).toContain('Modifica Luogo di Smaltimento 7');
  });

  it('non invia nulla se i campi obbligatori sono vuoti', async () => {
    const { pinia, store } = setup();
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia);

    await submit(wrapper);

    expect(createElement).not.toHaveBeenCalled();
  });

  it('crea l-elemento sulla company dello store quando il form e valido', async () => {
    const { pinia, store } = setup();
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT });

    await submit(wrapper);

    expect(createElement).toHaveBeenCalledWith(expect.any(Function));
  });

  it('aggiorna l-elemento gia esistente', async () => {
    const { pinia, store } = setup();
    const updateElement = vi.spyOn(store, 'updateElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT, id: 7 });

    await submit(wrapper);

    expect(updateElement).toHaveBeenCalledWith(expect.any(Function));
  });

  it('alla risposta ok svuota il form, ricarica e chiude', async () => {
    const { pinia, store } = setup();
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT });
    await submit(wrapper);

    createElement.mock.calls.at(-1)[0]({ status: 'ok' });

    expect(store.element).toEqual({});
    expect(store.activeForm).toBe(false);
    expect(initList).toHaveBeenCalled();
  });

  it('il pulsante di annullamento chiude il form', async () => {
    const { pinia, store } = setup();
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT });

    await wrapper.findComponent({ name: 'FormButtons' }).vm.$emit('cancel');

    expect(store.activeForm).toBe(false);
  });
});

describe('RaeDisposalPlaceDialog', () => {
  beforeEach(() => vi.clearAllMocks());

  const setup = (companyOverrides = {}) => {
    const pinia = createTestPinia();
    useCompanyStore().list = [{ id: 42, name: 'Attivita Test', rae: false, ...companyOverrides }];
    const store = useCompanyRaeDisposalPlaceStore();
    store.dialogOpen = true;
    store.companyId = 42;
    store.ready = true;
    store.list = [];
    return { pinia, store };
  };

  it('mostra il nome della company nel titolo quando la si trova in lista', () => {
    const { pinia } = setup();

    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    expect(wrapper.text()).toContain('Attivita Test');
  });

  it('con il modulo spento non mostra ne il bottone di aggiunta ne la lista', () => {
    const { pinia } = setup({ rae: false });

    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    expect(wrapper.find('.mdi-plus').exists()).toBe(false);
    expect(wrapper.findComponent(RaeDisposalPlaceTable).exists()).toBe(false);
  });

  it('con il modulo acceso mostra il bottone di aggiunta e la lista', () => {
    const { pinia } = setup({ rae: true });

    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    expect(wrapper.find('.mdi-plus').exists()).toBe(true);
    expect(wrapper.findComponent(RaeDisposalPlaceTable).exists()).toBe(true);
  });

  it('aprendo il form di creazione compare sopra la lista, non sotto', async () => {
    const { pinia, store } = setup({ rae: true });
    store.ready = true;
    store.list = []; // v-data-table vuota mostra 'No data available'
    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    await wrapper.find('.mdi-plus').trigger('click');

    const text = wrapper.text();
    const formTitleIndex = text.indexOf('Crea Luogo di Smaltimento');
    const tableMarkerIndex = text.indexOf('No data available');
    expect(formTitleIndex).toBeGreaterThan(-1);
    expect(tableMarkerIndex).toBeGreaterThan(-1);
    expect(formTitleIndex).toBeLessThan(tableMarkerIndex);
  });

  it('il bottone di aggiunta apre il form vuoto', async () => {
    const { pinia, store } = setup({ rae: true });
    store.element = { id: 1, name: 'da svuotare' };
    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    await wrapper.find('.mdi-plus').trigger('click');

    expect(store.activeForm).toBe(true);
    expect(store.element).toEqual({});
  });

  it('accendere il modulo mostra subito la sezione dei luoghi e salva sulla company giusta', async () => {
    const { pinia } = setup({ rae: false });
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', company: { id: 42, name: 'Attivita Test', rae: true } })
    );
    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    await wrapper.findAll('input[type="radio"]')[0].trigger('click');
    await flushPromises();

    // Il successo rilancia companyStore.initList() (debounced): non si puo'
    // assumere che la PUT sia l'ultima chiamata registrata, va cercata.
    const [url, method, options] = http.makeRequest.mock.calls.find(([, requestMethod]) => requestMethod === 'PUT');
    expect([url, method]).toEqual(['company/42', 'PUT']);
    expect(options.body).toEqual({ name: 'Attivita Test', rae: true });
    expect(wrapper.find('.mdi-plus').exists()).toBe(true);
  });

  it('se il backend rifiuta (nessun luogo) la sezione resta aperta e mostra l-errore', async () => {
    const { pinia } = setup({ rae: false });
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ko', message: 'Configura almeno un luogo di smaltimento RAEE prima di attivare il modulo' })
    );
    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    await wrapper.findAll('input[type="radio"]')[0].trigger('click');
    await flushPromises();

    expect(wrapper.text()).toContain('Configura almeno un luogo di smaltimento RAEE');
    // La sezione resta visibile: e' cosi' che si arriva a crearne uno.
    expect(wrapper.find('.mdi-plus').exists()).toBe(true);
  });

  it('aggiorna la sessione se la company modificata e quella attiva del super admin', async () => {
    const { pinia } = setup({ rae: false });
    useUserStore().company = { id: 42, name: 'Attivita Test', rae: false };
    http.makeRequest.mockImplementation((url, method, options, func) =>
      func({ status: 'ok', company: { id: 42, name: 'Attivita Test', rae: true } })
    );
    const wrapper = mountComponent(RaeDisposalPlaceDialog, { pinia });

    await wrapper.findAll('input[type="radio"]')[0].trigger('click');
    await flushPromises();

    expect(useUserStore().company.rae).toBe(true);
  });
});
