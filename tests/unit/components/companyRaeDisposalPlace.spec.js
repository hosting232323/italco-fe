import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import RaeDisposalPlaceTable from '@/components/administration/companyRaeDisposalPlace/RaeDisposalPlaceTable.vue';
import RaeDisposalPlaceForm from '@/components/administration/companyRaeDisposalPlace/RaeDisposalPlaceForm.vue';

import { useCompanyRaeDisposalPlaceStore } from '@/stores/companyRaeDisposalPlace';

import { createTestPinia, mountComponent } from '../../helpers/mount';

// Non condivide il contratto generico di describeCrudTable/describeCrudForm:
// companyId è un prop obbligatorio e le azioni dello store lo prendono come
// primo argomento, non quello della company in sessione.

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

  const setup = () => {
    const pinia = createTestPinia();
    return { pinia, store: useCompanyRaeDisposalPlaceStore() };
  };

  const mountTable = (store, pinia, companyId = 42) => {
    store.ready = true;
    store.list = [{ id: 1, ...VALID_ELEMENT }];
    return mountComponent(RaeDisposalPlaceTable, { pinia, props: { companyId } });
  };

  it('mostra lo scheletro finche la lista non e pronta', () => {
    const { pinia, store } = setup();
    store.ready = false;

    const wrapper = mountComponent(RaeDisposalPlaceTable, { pinia, props: { companyId: 42 } });

    expect(wrapper.find('.v-skeleton-loader').exists()).toBe(true);
    expect(wrapper.find('.v-data-table').exists()).toBe(false);
  });

  it('chiede la lista per la company passata al montaggio', () => {
    const { pinia, store } = setup();
    const initList = vi.spyOn(store, 'initList');

    mountComponent(RaeDisposalPlaceTable, { pinia, props: { companyId: 42 } });

    expect(initList).toHaveBeenCalledWith(42);
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

  it('il cestino cancella l-elemento sulla company passata', async () => {
    const { pinia, store } = setup();
    const deleteElement = vi.spyOn(store, 'deleteElement');
    const wrapper = mountTable(store, pinia);

    await rowsOf(wrapper)[0].find('.mdi-delete').trigger('click');

    expect(deleteElement).toHaveBeenCalledWith(42, { id: 1, ...VALID_ELEMENT }, expect.any(Function));
  });
});

describe('RaeDisposalPlaceForm', () => {
  beforeEach(() => vi.clearAllMocks());

  const setup = () => {
    const pinia = createTestPinia();
    return { pinia, store: useCompanyRaeDisposalPlaceStore() };
  };

  const mountForm = (store, pinia, element = {}, companyId = 42) => {
    store.activeForm = true;
    store.element = element;
    return mountComponent(RaeDisposalPlaceForm, { pinia, props: { companyId } });
  };

  const submit = async (wrapper) => {
    await wrapper.find('form').trigger('submit');
    await flushPromises();
  };

  it('resta chiuso finche non lo si apre', () => {
    const { pinia, store } = setup();
    store.activeForm = false;

    expect(mountComponent(RaeDisposalPlaceForm, { pinia, props: { companyId: 42 } }).find('form').exists()).toBe(false);
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

  it('crea l-elemento sulla company passata quando il form e valido', async () => {
    const { pinia, store } = setup();
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT }, 42);

    await submit(wrapper);

    expect(createElement).toHaveBeenCalledWith(42, expect.any(Function));
  });

  it('aggiorna l-elemento gia esistente sulla company passata', async () => {
    const { pinia, store } = setup();
    const updateElement = vi.spyOn(store, 'updateElement').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT, id: 7 }, 42);

    await submit(wrapper);

    expect(updateElement).toHaveBeenCalledWith(42, expect.any(Function));
  });

  it('alla risposta ok svuota il form, ricarica e chiude', async () => {
    const { pinia, store } = setup();
    const createElement = vi.spyOn(store, 'createElement').mockImplementation(() => {});
    const initList = vi.spyOn(store, 'initList').mockImplementation(() => {});
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT }, 42);
    await submit(wrapper);

    createElement.mock.calls.at(-1)[1]({ status: 'ok' });

    expect(store.element).toEqual({});
    expect(store.activeForm).toBe(false);
    expect(initList).toHaveBeenCalledWith(42);
  });

  it('il pulsante di annullamento chiude il form', async () => {
    const { pinia, store } = setup();
    const wrapper = mountForm(store, pinia, { ...VALID_ELEMENT });

    await wrapper.findComponent({ name: 'FormButtons' }).vm.$emit('cancel');

    expect(store.activeForm).toBe(false);
  });
});
